// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BookingStatus, PickupLocation } from "@prisma/client";

const stripeSecret = process.env.STRIPE_SECRET_KEY;

// Only create Stripe instance if we actually have a key
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: "2024-06-20" })
  : null;

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const origin = url.origin; // e.g. http://localhost:3000 or https://your-vercel-url

  const session = await getServerSession(authOptions);

  // Read form data once here so we can re-use carId if needed
  const formData = await req.formData();
  const carId = formData.get("carId") as string | null;
  const startDateStr = formData.get("startDate") as string | null;
  const endDateStr = formData.get("endDate") as string | null;
  const pickupLocationStr = formData.get("pickupLocation") as string | null;

  // If not logged in → send them to login, then back to the car page
  if (!session || !session.user || !(session.user as any).id) {
    const callbackTarget = carId ? `/cars/${carId}` : "/";
    return NextResponse.redirect(
      `${origin}/login?callbackUrl=${encodeURIComponent(callbackTarget)}`
    );
  }

  // Basic validation
  if (!carId || !startDateStr || !endDateStr || !pickupLocationStr) {
    return NextResponse.redirect(
      `${origin}/?error=${encodeURIComponent("Missing fields")}`
    );
  }

  const car = await prisma.car.findUnique({ where: { id: carId } });

  if (!car) {
    return NextResponse.redirect(
      `${origin}/?error=${encodeURIComponent("Car not found")}`
    );
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime()) ||
    endDate <= startDate
  ) {
    return NextResponse.redirect(
      `${origin}/cars/${car.id}?error=${encodeURIComponent("Invalid dates")}`
    );
  }

  const diffMs = endDate.getTime() - startDate.getTime();
  const days = Math.max(
    1,
    Math.ceil(diffMs / (1000 * 60 * 60 * 24)) // at least 1 day
  );

  const totalPrice = days * car.pricePerDay;
  const userId = (session.user as any).id as string;

  // Create booking in PENDING status
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

  // 🔹 DEV / “no Stripe configured” mode:
  // If STRIPE_SECRET_KEY is missing, just skip Stripe
  // and pretend the payment succeeded so you can keep building.
  if (!stripe) {
    console.warn(
      "[checkout] STRIPE_SECRET_KEY not set – skipping Stripe and redirecting straight to success page."
    );
    return NextResponse.redirect(
      `${origin}/bookings/success?bookingId=${booking.id}`
    );
  }

  // 🔹 Real Stripe checkout
  try {
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
            unit_amount: totalPrice, // already in cents from DB
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
      },
      success_url: `${origin}/bookings/success?bookingId=${booking.id}`,
      cancel_url: `${origin}/cars/${car.id}`,
    });

    return NextResponse.redirect(checkoutSession.url!);
  } catch (err) {
    console.error("[checkout] Stripe error:", err);
    return NextResponse.redirect(
      `${origin}/cars/${car.id}?error=${encodeURIComponent(
        "Unable to start checkout"
      )}`
    );
  }
}
