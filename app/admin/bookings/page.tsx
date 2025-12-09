// app/admin/bookings/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      car: true,
      user: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Bookings dashboard
          </h1>
          <p className="text-sm text-gray-500">
            All recent bookings, straight from your database.
          </p>
        </div>
        <Link
          href="/"
          className="text-xs font-medium text-gray-700 hover:text-black"
        >
          ← Back to site
        </Link>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-gray-500">
          No bookings yet. Once someone completes checkout, they will show up
          here.
        </p>
      ) : (
        <div className="overflow-x-auto border border-gray-100 rounded-2xl bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-left">Car</th>
                <th className="px-3 py-2 text-left">Customer</th>
                <th className="px-3 py-2 text-left">Dates</th>
                <th className="px-3 py-2 text-left">Pickup</th>
                <th className="px-3 py-2 text-left">Total</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-gray-100">
                  <td className="px-3 py-2 align-top">
                    <div className="text-xs text-gray-600">
                      {b.createdAt.toLocaleDateString()}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {b.createdAt.toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="font-medium text-gray-800">
                      {b.car.title}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {b.car.city}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="text-xs text-gray-800">
                      {b.user?.email ?? "Unknown"}
                    </div>
                    {b.user?.name && (
                      <div className="text-[11px] text-gray-500">
                        {b.user.name}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-gray-700">
                    <div>{b.startDate.toDateString()}</div>
                    <div className="text-[11px] text-gray-400">
                      to {b.endDate.toDateString()}
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-gray-700">
                    {b.pickupLocation}
                  </td>
                  <td className="px-3 py-2 align-top text-xs text-gray-800">
                    ${(b.totalPrice / 100).toFixed(2)}
                  </td>
                  <td className="px-3 py-2 align-top">
                    <span
                      className={
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold " +
                        (b.status === "PAID"
                          ? "bg-emerald-50 text-emerald-700"
                          : b.status === "PENDING"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-red-50 text-red-700")
                      }
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
