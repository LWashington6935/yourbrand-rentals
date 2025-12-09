"use client";

/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<"bookings" | "profile" | "payment">(
    "bookings"
  );

  const userName =
    session?.user?.name || (session?.user?.email?.split("@")[0] ?? "Guest");
  const userEmail = session?.user?.email ?? "";

  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "YB";

  // While NextAuth is checking the session
  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex items-center gap-3 text-sm text-gray-700 bg-white px-4 py-3 rounded-2xl shadow border border-gray-200">
          <svg
            className="animate-spin h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Checking your account…
        </div>
      </div>
    );
  }

  // If not signed in, show a friendly message
  if (!session) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-lg border border-gray-200 p-8 space-y-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">My account</h1>
          <p className="text-sm text-gray-600">
            You need to be signed in to view your bookings and account details.
          </p>
          <div className="flex flex-col gap-3 mt-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-bold hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg"
            >
              Go to login
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Signed-in view
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Welcome back, {userName}!
                </h1>
                {userEmail && (
                  <p className="text-xs text-gray-500 mt-1">{userEmail}</p>
                )}
                <p className="text-sm text-gray-600 mt-1">
                  Manage your bookings and account settings
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/cars"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-bold hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New booking
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                  />
                </svg>
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats (demo) */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                  Total bookings
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">1</p>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                  Upcoming trips
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">127</p>
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                  Rewards points
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "bookings"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
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
                  My bookings
                </span>
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "profile"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </span>
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                  activeTab === "payment"
                    ? "text-gray-900 border-b-2 border-gray-900 bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Payment
                </span>
              </button>
            </nav>
          </div>

          <div className="p-6 md:p-8">
            {/* Bookings Tab (demo) */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Your bookings
                  </h2>
                  <p className="text-sm text-gray-600">
                    View and manage your upcoming and past rentals
                  </p>
                </div>

                {/* Upcoming Booking */}
                <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider">
                        <svg
                          className="w-3 h-3"
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
                        Upcoming
                      </span>
                      <span className="text-xs text-gray-600 font-semibold">
                        Pickup in 3 days
                      </span>
                    </div>
                    <button className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                      View details →
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">
                        Vehicle
                      </p>
                      <p className="text-base font-bold text-gray-900">
                        2023 Toyota Camry
                      </p>
                      <p className="text-sm text-gray-600">
                        Sedan • Automatic • 5 seats
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">
                        Dates
                      </p>
                      <p className="text-base font-bold text-gray-900">
                        Dec 10 - Dec 13, 2024
                      </p>
                      <p className="text-sm text-gray-600">
                        3 days • Downtown pickup
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-emerald-200">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Total paid</p>
                      <p className="text-2xl font-bold text-gray-900">$195</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                        Modify
                      </button>
                      <button className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                        View receipt
                      </button>
                    </div>
                  </div>
                </div>

                {/* Past Bookings */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                    Past bookings
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        car: "2022 Honda Accord",
                        dates: "Nov 5-8, 2024",
                        total: "$210",
                      },
                      {
                        car: "2023 Ford Escape",
                        dates: "Oct 12-15, 2024",
                        total: "$240",
                      },
                    ].map((booking, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {booking.car}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {booking.dates}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {booking.total}
                          </p>
                          <button className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors mt-1">
                            View →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab (demo) */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Profile settings
                  </h2>
                  <p className="text-sm text-gray-600">
                    Update your personal information and preferences
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                        Full name
                      </label>
                      <input
                        type="text"
                        defaultValue={userName}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                        Email address
                      </label>
                      <input
                        type="email"
                        defaultValue={userEmail}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                      Driver's license number
                    </label>
                    <input
                      type="text"
                      placeholder="D1234567"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-bold hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg">
                      Save changes
                    </button>
                    <button className="px-6 py-3 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Tab (demo) */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Payment methods
                  </h2>
                  <p className="text-sm text-gray-600">
                    Manage your saved payment methods
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Saved Card */}
                  <div className="p-6 rounded-2xl border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
                        <svg
                          className="w-3 h-3"
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
                        Default
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white flex-shrink-0">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold text-gray-900">
                          •••• •••• •••• 4242
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Expires 12/25
                        </p>
                        <div className="flex gap-2 mt-3">
                          <button className="text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors">
                            Edit
                          </button>
                          <span className="text-gray-300">•</span>
                          <button className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Add New Card */}
                  <button className="w-full p-6 rounded-2xl border-2 border-dashed border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 transition-all text-center group">
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-gray-900">
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add new payment method
                    </div>
                  </button>
                </div>

                {/* Billing History */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                    Billing history
                  </h3>
                  <div className="space-y-2">
                    {[
                      {
                        date: "Dec 10, 2024",
                        amount: "$195.00",
                        status: "Paid",
                      },
                      {
                        date: "Nov 5, 2024",
                        amount: "$210.00",
                        status: "Paid",
                      },
                      {
                        date: "Oct 12, 2024",
                        amount: "$240.00",
                        status: "Paid",
                      },
                    ].map((invoice, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {invoice.date}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Rental payment
                          </p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {invoice.amount}
                            </p>
                            <p className="text-xs text-emerald-600 font-semibold">
                              {invoice.status}
                            </p>
                          </div>
                          <button className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                            Download →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-blue-900 mb-1">
                Demo Account Notice
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                This page is currently showing demo data. In production, this
                would display your actual bookings, profile information, and
                payment methods connected to your account in the database.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
