// app/bookings/success/page.tsx
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";
import { sendBookingNotificationEmail } from "@/lib/email";

type Props = {
  searchParams: {
    bookingId?: string;
  };
};

export default async function BookingSuccessPage({ searchParams }: Props) {
  const bookingId = searchParams.bookingId;

  let booking:
    | (Awaited<ReturnType<typeof prisma.booking.findUnique>> & {
        car: { title: string; city: string };
        user: { email: string | null } | null;
      })
    | null = null;

  if (bookingId) {
    try {
      // 1) mark as PAID and fetch related data
      booking = (await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.PAID },
        include: { car: true, user: true },
      })) as any;

      // 2) fire email notification (do not block page if it fails)
      try {
        await sendBookingNotificationEmail({
          bookingId: booking.id,
          carTitle: booking.car.title,
          carCity: booking.car.city,
          startDate: booking.startDate,
          endDate: booking.endDate,
          pickupLocation: booking.pickupLocation,
          totalPriceCents: booking.totalPrice,
          customerEmail: booking.user?.email ?? null,
        });
      } catch (emailError) {
        console.error("[booking-email] Failed to send notification:", emailError);
      }
    } catch (e) {
      console.error("[booking-success] Failed to update booking:", e);
    }
  }

  return (
    <div className="max-w-md mx-auto text-center space-y-4">
      <h1 className="text-2xl font-bold">Payment successful</h1>
      <p className="text-sm text-gray-600">
        Your booking and payment have been recorded.
      </p>

      {booking && (
        <div className="text-sm text-gray-700 bg-white rounded-xl shadow p-4 text-left">
          <p>
            <strong>Car:</strong> {booking.car.title}
          </p>
          <p>
            <strong>Dates:</strong>{" "}
            {booking.startDate.toDateString()} –{" "}
            {booking.endDate.toDateString()}
          </p>
          <p>
            <strong>Pickup:</strong> {booking.pickupLocation}
          </p>
          <p>
            <strong>Total:</strong> ${(booking.totalPrice / 100).toFixed(2)}
          </p>
          <p>
            <strong>Status:</strong> {booking.status}
          </p>
        </div>
      )}

      <a
        href="/cars"
        className="inline-block mt-4 px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-900"
      >
        Back to cars
      </a>
    </div>
  );
}
