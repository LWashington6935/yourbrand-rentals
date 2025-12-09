import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featuredCars = await prisma.car.findMany({
    where: { isActive: true, city: "Columbus" },
    take: 6,
    include: { owner: true },
  });

  return (
    <>
      {/* FULL-WIDTH HERO */}
      <section
        className="
          relative w-screen mx-[calc(50%-50vw)]
          overflow-hidden bg-gray-900/90
          min-h-[420px] md:min-h-[520px]
        "
      >
        {/* Background image */}
        <Image
          src="/hero-fleet.jpg"
          alt="Columbus rental cars"
          fill
          priority
          className="object-cover opacity-45"
        />
        {/* Dark gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

        {/* Content container */}
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.7fr,1.1fr] items-center">
            {/* Left side: copy + search */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-emerald-400/40 px-4 py-1.5 text-xs font-semibold text-emerald-200 shadow-sm backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Columbus, Ohio • Local fleet, no hidden fees
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white">
                  YourBrand Rentals in Columbus,
                  <span className="block bg-gradient-to-r from-emerald-200 via-white to-emerald-100 bg-clip-text text-transparent">
                    without the airport hassle.
                  </span>
                </h1>
                <p className="mt-4 text-base md:text-lg text-gray-200 max-w-xl leading-relaxed">
                  Pick from a curated local fleet. Fair pricing, simple online
                  checkout, and flexible pickup options across the city.
                </p>
              </div>

              {/* SEARCH FORM */}
              <form
                action="/cars"
                method="GET"
                className="bg-white/95 border border-gray-200 shadow-lg shadow-black/15 rounded-2xl p-6 space-y-4 backdrop-blur"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                      Pickup date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                    />
                  </div>
                  <div className="flex md:block items-end">
                    <button
                      type="submit"
                      className="w-full md:mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-bold px-6 py-3 hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                    >
                      Search available cars
                      <span aria-hidden className="text-base">→</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-emerald-500"
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
                  No charges to search. You only pay once you complete checkout.
                </p>
              </form>

              {/* CTAs under the form */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
                <Link
                  href="/cars"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 bg-white/10 text-white font-semibold hover:bg-white/20 transition"
                >
                  Browse all cars
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs text-gray-200 hover:text-white"
                >
                  Already booked?{" "}
                  <span className="font-semibold underline underline-offset-2">
                    Sign in to your account
                  </span>
                </Link>
              </div>

              {/* Trust strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/10">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Local Columbus operators
                    </p>
                    <p className="text-xs text-gray-200 mt-0.5">
                      Real cars, real people – not a faceless call center.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/10">
                  <span className="text-2xl">🕒</span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Flexible pickup
                    </p>
                    <p className="text-xs text-gray-200 mt-0.5">
                      Downtown, CMH airport, Easton, Polaris, or delivery.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/10">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Secure checkout
                    </p>
                    <p className="text-xs text-gray-200 mt-0.5">
                      Protected by Stripe encryption.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: contact card */}
            <div className="hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden bg-black/55 text-white shadow-2xl border border-white/10">
                <div className="p-6 border-b border-white/10">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-emerald-300">
                    Need help?
                  </p>
                  <p className="text-lg font-bold mt-2">
                    Talk to a real person in Columbus
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    Questions about pickup, insurance, or same-day rentals?
                    We’ve got you.
                  </p>
                </div>

                <div className="p-8 flex flex-col items-center justify-center gap-4 min-h-[220px]">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/40">
                    <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wide">
                      Call or text
                    </span>
                  </div>

                  <p className="text-3xl font-bold tracking-tight">
                    555-123-4567
                  </p>

                  <p className="text-xs text-gray-300">
                    Available <span className="font-semibold">8am – 8pm</span>{" "}
                    (Eastern), 7 days a week.
                  </p>

                  <p className="text-[11px] text-gray-400 mt-2 max-w-xs text-center">
                    Prefer email? Reach out anytime and we’ll confirm your
                    booking details and pickup instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT UNDER HERO */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 space-y-16 py-10">
        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 rounded-3xl p-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                How it works
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Three quick steps to get on the road.
              </p>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 group"
            >
              Browse all cars
              <span
                aria-hidden
                className="group-hover:translate-x-1 transition-transform"
              >
                →
              </span>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-md">
                1
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-2">
                  Choose your dates & car
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Search by dates, then pick the car that fits your trip and
                  budget.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-md">
                2
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-2">
                  Book online in minutes
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Secure Stripe checkout, instant booking in our system.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 text-white flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-md">
                3
              </div>
              <div>
                <p className="font-bold text-gray-900 mb-2">Pickup & drive</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Meet at your chosen pickup spot in Columbus and hit the road.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED CARS */}
        <section className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Featured cars in Columbus
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Curated from our local fleet. More options available on the cars
                page.
              </p>
            </div>
            <Link
              href="/cars"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 group"
            >
              View all cars
              <span
                aria-hidden
                className="group-hover:translate-x-1 transition-transform"
              >
                →
              </span>
            </Link>
          </div>

          {featuredCars.length === 0 ? (
            <div className="text-center py-16 px-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200">
              <p className="text-base text-gray-600">
                No cars are currently available. Check back soon or contact
                support.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCars.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.id}`}
                  className="group block rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
                >
                  {/* IMAGE BLOCK USING next/image */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                    <Image
                      src={car.mainImageUrl || "/cars/placeholder-car.jpg"}
                      alt={car.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
                        {car.city}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {car.isCompanyOwned
                          ? "Our fleet"
                          : `Hosted by ${car.owner.displayName}`}
                      </span>
                    </div>
                    <p className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-gray-700 transition-colors">
                      {car.title}
                    </p>
                    <p className="text-sm text-gray-600">
                      {car.year} • {car.seats} seats •{" "}
                      {car.transmission.toLowerCase()}
                    </p>
                    <div className="pt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {(car.pricePerDay / 100).toFixed(0)}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        / day
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
