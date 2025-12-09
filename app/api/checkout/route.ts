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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !(session.user as any).id) {
    const url = new URL(req.url);
    return NextResponse.redirect(
      `${url.origin}/login?callbackUrl=${encodeURIComponent(url.pathname)}`
    );
  }

  const formData = await req.formData();
  const carId = formData.get("carId") as string | null;
  const startDateStr = formData.get("startDate") as string | null;
  const endDateStr = formData.get("endDate") as string | null;
  const pickupLocationStr = formData.get("pickupLocation") as string | null;

  if (!carId || !startDateStr || !endDateStr || !pickupLocationStr) {
    return NextResponse.redirect("/?error=Missing+fields");
  }

  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) {
    return NextResponse.redirect("/?error=Car+not+found");
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
    return NextResponse.redirect(`/cars/${carId}?error=Invalid+dates`);
  }

  const diffMs = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const totalPrice = days * car.pricePerDay;

  const userId = (session.user as any).id as string;

  // Create booking with PENDING status first
  const booking = await prisma.booking.create({
    data: {
      userId,
      carId: car.id,
      startDate,
      endDate,
      pickupLocation: pickupLocationStr as PickupLocation,
      totalPrice,
      status: BookingStatus.PENDING,
    },
  });

  const appUrl = process.env.APP_URL || "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: car.title,
            description: `${days} day rental in ${car.city}`,
          },
          unit_amount: totalPrice, // in cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking.id,
    },
    success_url: `${appUrl}/bookings/success?bookingId=${booking.id}`,
    cancel_url: `${appUrl}/cars/${car.id}`,
  });

  return NextResponse.redirect(checkoutSession.url!);
}
