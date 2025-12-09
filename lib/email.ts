// lib/email.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type BookingEmailPayload = {
  bookingId: string;
  carTitle: string;
  carCity: string;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  totalPriceCents: number;
  customerEmail?: string | null;
};

export async function sendBookingNotificationEmail(payload: BookingEmailPayload) {
  const recipientsEnv = process.env.BOOKING_ALERT_RECIPIENTS;
  const fromEmail = process.env.BOOKING_ALERT_FROM || "bookings@example.com";

  if (!process.env.RESEND_API_KEY || !recipientsEnv) {
    console.warn(
      "[booking-email] Missing RESEND_API_KEY or BOOKING_ALERT_RECIPIENTS – skipping email."
    );
    return;
  }

  const recipients = recipientsEnv
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.warn("[booking-email] No valid recipients – skipping email.");
    return;
  }

  const {
    bookingId,
    carTitle,
    carCity,
    startDate,
    endDate,
    pickupLocation,
    totalPriceCents,
    customerEmail,
  } = payload;

  const totalDollars = (totalPriceCents / 100).toFixed(2);

  const subject = `New PAID booking: ${carTitle} (${carCity})`;
  const text = [
    `A new PAID booking has been confirmed.`,
    "",
    `Booking ID: ${bookingId}`,
    `Car: ${carTitle} (${carCity})`,
    `Dates: ${startDate.toDateString()} → ${endDate.toDateString()}`,
    `Pickup location: ${pickupLocation}`,
    `Total price: $${totalDollars}`,
    customerEmail ? `Customer email: ${customerEmail}` : "",
    "",
    `Please prepare the car for these dates and location.`,
  ]
    .filter(Boolean)
    .join("\n");

  await resend.emails.send({
    from: fromEmail,
    to: recipients,
    subject,
    text,
  });
}
