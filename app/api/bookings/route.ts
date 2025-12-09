import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PickupLocation } from "@prisma/client";

export async function POST(req: NextRequest) {
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

  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@customer.com" },
  });

  if (!demoUser) {
    return NextResponse.redirect(`/cars/${carId}?error=Demo+user+missing`);
  }

  try {
    await prisma.booking.create({
      data: {
        userId: demoUser.id,
        carId: car.id,
        startDate,
        endDate,
        pickupLocation: pickupLocationStr as PickupLocation,
        totalPrice,
        status: BookingStatus.PENDING,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(`/cars/${carId}?error=Could+not+create+booking`);
  }

  return NextResponse.redirect("/bookings/success");
}
