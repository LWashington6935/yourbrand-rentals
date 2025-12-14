// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BookingStatus, PickupLocation } from "@prisma/client";

// ✅ DO NOT specify apiVersion (let Stripe SDK handle it)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any)?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();

  const carId = formData.get("carId")?.toString();
  const startDateStr = formData.get("startDate")?.toString();
  const endDateStr = formData.get("endDate")?.toString();
  const pickupLocationStr = formData.get("pickupLocation")?.toString();

  if (!carId || !startDateStr || !endDateStr || !pickupLocationStr) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate <= startDate) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  const days =
    Math.ceil(
      (endDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) || 1;

  const totalPrice = days * car.pricePerDay;

  const booking = await prisma.booking.create({
    data: {
      userId: (session.user as any).id,
      carId: car.id,
      startDate,
      endDate,
      pickupLocation: pickupLocationStr as PickupLocation,
      totalPrice,
      status: BookingStatus.PENDING,
    },
  });

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
          unit_amount: totalPrice, // cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking.id,
    },
    success_url: `${process.env.APP_URL}/bookings/success?bookingId=${booking.id}`,
    cancel_url: `${process.env.APP_URL}/cars/${car.id}`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
