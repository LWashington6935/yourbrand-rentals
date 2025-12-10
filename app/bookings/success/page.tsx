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

  const b = booking;

  // Fire-and-forget email
  try {
    await sendBookingNotificationEmail({
      bookingId: b.id,
      carTitle: b.car.title,
      carCity: b.car.city,
      startDate: b.startDate as Date,
      endDate: b.endDate as Date,
      customerEmail: b.user.email ?? "",
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
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mx-auto shadow-lg">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Booking confirmed!
          </h1>
          <p className="text-base text-gray-600">
            Your trip is locked in. We&apos;ve sent a confirmation email with your
            booking details.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 text-left space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
              {b.car.city}
            </span>
            <span className="text-xs text-gray-600 font-medium">
              {totalDays} {totalDays === 1 ? 'day' : 'days'}
            </span>
          </div>
          
          <div>
            <p className="text-lg font-bold text-gray-900 mb-1">
              {b.car.title}
            </p>
            <p className="text-sm text-gray-600">
              {b.car.year} • {b.car.seats} seats •{" "}
              {b.car.transmission.toLowerCase()}
            </p>
          </div>

          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-600">Total amount paid</span>
              <span className="text-2xl font-bold text-gray-900">
                ${(b.totalPrice / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-bold hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            View my bookings
          </Link>
          <Link
            href="/cars"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Browse more cars
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact us at{" "}
            <a href="tel:5551234567" className="font-semibold text-gray-700 hover:text-gray-900">
              555-123-4567
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}