// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BookingStatus, PickupLocation } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

function toPickupLocation(value: string): PickupLocation | null {
  // Ensure the incoming string matches your Prisma enum values
  const allowed = Object.values(PickupLocation) as string[];
  return allowed.includes(value) ? (value as PickupLocation) : null;
}

export async function POST(req: NextRequest) {
  // ✅ Stripe SDK needs a key at runtime — if missing, fail safely with a redirect
  if (!process.env.STRIPE_SECRET_KEY) {
    const url = new URL(req.url);
    return NextResponse.redirect(
      `${url.origin}/?error=Missing+STRIPE_SECRET_KEY`,
      303
    );
  }

  const session = await getServerSession(authOptions);

  // ✅ If not logged in, redirect to login (303 so browser does GET)
  if (!session || !session.user || !(session.user as any).id) {
    const url = new URL(req.url);
    return NextResponse.redirect(
      `${url.origin}/login?callbackUrl=${encodeURIComponent("/cars")}`,
      303
    );
  }

  const formData = await req.formData();

  const carId = (formData.get("carId") as string | null)?.trim() || null;
  const startDateStr =
    (formData.get("startDate") as string | null)?.trim() || null;
  const endDateStr =
    (formData.get("endDate") as string | null)?.trim() || null;
  const pickupLocationStr =
    (formData.get("pickupLocation") as string | null)?.trim() || null;

  if (!carId || !startDateStr || !endDateStr || !pickupLocationStr) {
    return NextResponse.redirect("/?error=Missing+fields", 303);
  }

  const pickupLocation = toPickupLocation(pickupLocationStr);
  if (!pickupLocation) {
    return NextResponse.redirect(`/cars/${carId}?error=Invalid+pickup+location`, 303);
  }

  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) {
    return NextResponse.redirect("/?error=Car+not+found", 303);
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
    return NextResponse.redirect(`/cars/${carId}?error=Invalid+dates`, 303);
  }

  const diffMs = endDate.getTime() - startDate.getTime();
  const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  // pricePerDay is cents — keep everything in cents
  const totalPrice = days * car.pricePerDay;

  const userId = (session.user as any).id as string;

  // Create booking first
  const booking = await prisma.booking.create({
    data: {
      userId,
      carId: car.id,
      startDate,
      endDate,
      pickupLocation,
      totalPrice,
      status: BookingStatus.PENDING,
    },
  });

  // Prefer explicit APP_URL for prod (Vercel), otherwise infer from request
  const reqUrl = new URL(req.url);
  const baseUrl = process.env.APP_URL?.trim() || reqUrl.origin;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: car.title,
            description: `${days} day rental in ${car.city}`,
          },
          // Stripe expects cents
          unit_amount: totalPrice,
        },
      },
    ],
    metadata: { bookingId: booking.id },
    success_url: `${baseUrl}/bookings/success?bookingId=${booking.id}`,
    cancel_url: `${baseUrl}/cars/${car.id}`,
  });

  // ✅ CRITICAL FIX: use 303 so the browser does GET to Stripe (prevents CloudFront 403)
  return NextResponse.redirect(checkoutSession.url!, 303);
}
