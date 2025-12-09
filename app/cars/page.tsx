import Link from "next/link";
import { prisma } from "@/lib/prisma";

type CarsPageProps = {
  searchParams: {
    startDate?: string;
    endDate?: string;
  };
};

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const { startDate, endDate } = searchParams;

  const cars = await prisma.car.findMany({
    where: {
      isActive: true,
      city: "Columbus",
    },
    include: { owner: true },
    orderBy: { pricePerDay: "asc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Available cars in Columbus
            </h1>
            <p className="text-base text-gray-600 mt-2">
              {startDate && endDate
                ? `Showing cars for ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`
                : "Browse our full fleet of vehicles available for rent"}
            </p>
          </div>
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm hover:shadow"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </div>

        {/* Filter/Search Bar */}
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <form action="/cars" method="GET" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  Pickup date
                </label>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={startDate}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                  Return date
                </label>
                <input
                  type="date"
                  name="endDate"
                  defaultValue={endDate}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="flex md:block items-end md:col-span-2">
                <button
                  type="submit"
                  className="w-full md:mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-bold px-6 py-2.5 hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  Update search
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {startDate && endDate && (
              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Note: This starter project does not yet filter by availability. All active cars are shown.</span>
              </div>
            )}
          </form>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-semibold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {cars.length} cars available
          </div>
          <div className="text-gray-600">
            Sorted by price • Low to high
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      {cars.length === 0 ? (
        <div className="text-center py-20 px-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No cars available</h3>
            <p className="text-sm text-gray-600">
              Check back soon or contact support for assistance.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
            >
              Back to home
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <Link
              key={car.id}
              href={`/cars/${car.id}`}
              className="group block rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden"
            >
              <div className="h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs text-gray-500 group-hover:from-gray-200 group-hover:to-gray-300 transition-all relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-gray-900/[0.02] bg-[size:20px_20px]"></div>
                <span className="relative z-10">
                  {car.mainImageUrl || "Add an image for this car in /public/cars"}
                </span>
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
                  {car.year} • {car.seats} seats • {car.transmission.toLowerCase()}
                </p>
                <div className="pt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">
                    ${(car.pricePerDay / 100).toFixed(0)}
                  </span>
                  <span className="text-sm font-medium text-gray-500">/ day</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      {cars.length > 0 && (
        <div className="mt-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 md:p-10 text-center text-white shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Need help choosing?
          </h2>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Our team can help you find the perfect vehicle for your trip. Give us a call or send a message.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="tel:5551234567"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 text-sm font-bold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call 555-123-4567
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              Contact us
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}