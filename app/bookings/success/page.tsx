// app/bookings/success/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendBookingNotificationEmail } from "@/lib/email";

type SuccessPageProps = {
  searchParams?: {
    bookingId?: string;
  };
};

export default async function BookingSuccessPage({
  searchParams = {},
}: SuccessPageProps) {
  const bookingId = searchParams.bookingId;

  // No booking id -> 404
  if (!bookingId) {
    return notFound();
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      car: true,
      user: true,
    },
  });

  // Booking not found -> 404
  if (!booking) {
    return notFound();
  }

  const b = booking!;

  // Fire-and-forget email – no totalPrice here (type doesn’t allow it)
  try {
    await sendBookingNotificationEmail({
      bookingId: b.id,
      carTitle: b.car.title,
      carCity: b.car.city,
      startDate: b.startDate,
      endDate: b.endDate,
      customerEmail: b.user.email,
    });
  } catch (err) {
    console.error("Failed to send booking notification email", err);
  }

  const totalDays =
    Math.ceil(
      (b.endDate.getTime() - b.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    ) || 1;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-lg border border-gray-200 p-8 space-y-6 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mx-auto">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Booking confirmed
        </h1>
        <p className="text-sm text-gray-600">
          Your trip is locked in. We’ve sent a confirmation email with your
          booking details.
        </p>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left space-y-2">
          <p className="text-sm font-semibold text-gray-900">
            {b.car.title}
          </p>
          <p className="text-xs text-gray-600">
            {b.car.year} • {b.car.seats} seats •{" "}
            {b.car.transmission.toLowerCase()}
          </p>
          <p className="text-xs text-gray-600">
            {b.car.city} • {totalDays} day rental
          </p>
          <p className="text-sm font-bold text-gray-900 mt-2">
            Total: ${(b.totalPrice / 100).toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-bold hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg"
          >
            View my bookings
          </Link>
          <Link
            href="/cars"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Browse more cars
          </Link>
        </div>
      </div>
    </div>
  );
}
