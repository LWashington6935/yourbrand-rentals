import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

type CarPageProps = {
  params: { id: string };
};

export default async function CarPage({ params }: CarPageProps) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: { owner: true },
  });

  if (!car) return notFound();

  // Helper to get a safe src (assumes files in /public/cars)
  const mainImageSrc =
    car.mainImageUrl && car.mainImageUrl.trim().length > 0
      ? car.mainImageUrl.startsWith("/")
        ? car.mainImageUrl
        : `/cars/${car.mainImageUrl}`
      : "/cars/placeholder-car.jpg";

  const galleryImages =
    car.imageUrls && car.imageUrls.length > 0
      ? car.imageUrls.map((url) =>
          url.startsWith("/") ? url : `/cars/${url}`
        )
      : [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          Home
        </Link>
        <span>→</span>
        <Link href="/cars" className="hover:text-gray-900 transition-colors">
          Cars
        </Link>
        <span>→</span>
        <span className="text-gray-900 font-semibold">{car.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.8fr,1.2fr]">
        {/* Left Column - Car Details */}
        <section className="space-y-6">
          {/* Main Image */}
          <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-lg bg-gray-200">
            <Image
              src={mainImageSrc}
              alt={car.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>

          {/* Small gallery (if you have extra images) */}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {galleryImages.map((src, i) => (
                <div
                  key={i}
                  className="relative h-20 md:h-24 rounded-2xl overflow-hidden border border-gray-200 bg-gray-100"
                >
                  <Image
                    src={src}
                    alt={`${car.title} - photo ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Title & Meta */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {car.city}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    {car.isCompanyOwned
                      ? "Our fleet"
                      : `Hosted by ${car.owner.displayName}`}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {car.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {car.year} • {car.brand} {car.model} • {car.seats} seats •{" "}
                  {car.transmission.toLowerCase()}
                </p>
              </div>
            </div>

            <p className="text-base text-gray-700 leading-relaxed">
              {car.description}
            </p>
          </div>

          {/* Features */}
          <div className="border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Vehicle details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100">
                <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                    Year
                  </p>
                  <p className="text-sm font-bold text-gray-900">{car.year}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100">
                <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                    Seats
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {car.seats}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-100">
                <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                    Transmission
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {car.transmission}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column - Booking Card */}
        <section>
          <div className="sticky top-20">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 space-y-6">
              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">
                  ${(car.pricePerDay / 100).toFixed(0)}
                </span>
                <span className="text-lg text-gray-600">/ day</span>
              </div>

              {/* Booking Form
                 NOTE: this still posts to /api/checkout.
                 You need an API route at app/api/checkout/route.ts
                 or change this action to a route that exists. */}
              <form action="/api/checkout" method="POST" className="space-y-4">
                <input type="hidden" name="carId" value={car.id} />

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    Pickup date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    Return date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                    Pickup location
                  </label>
                  <select
                    name="pickupLocation"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  >
                    <option value="DOWNTOWN">Downtown Columbus</option>
                    <option value="CMH_AIRPORT">CMH Airport</option>
                    <option value="EASTON">Easton</option>
                    <option value="POLARIS">Polaris</option>
                    <option value="DELIVERY">
                      Delivery (extra fee may apply)
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-bold px-6 py-4 hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  Continue to payment
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>

                <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
                  <svg
                    className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span>
                    You&apos;ll be redirected to a secure Stripe checkout page.
                    After payment, your booking will be confirmed in the system.
                  </span>
                </div>
              </form>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <svg
                    className="w-5 h-5 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">Free cancellation</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <svg
                    className="w-5 h-5 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    Instant booking confirmation
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <svg
                    className="w-5 h-5 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
              </div>
            </div>

            {/* Contact Host */}
            {!car.isCompanyOwned && (
              <div className="mt-4 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg">
                    {car.owner.displayName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {car.owner.displayName}
                    </p>
                    <p className="text-xs text-gray-600">Vehicle host</p>
                  </div>
                </div>
                <button className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                  Message host
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
