"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-gray-800">Welcome to LMS</h1>
      <p className="mt-2 text-lg text-gray-600 max-w-2xl">
        A modern Learning Management System (LMS) where users can buy courses, watch videos, 
        and enhance their skills. Admins can upload and manage content, and payments are seamlessly integrated.
      </p>

      {/* Authentication Buttons */}
      <div className="mt-6">
        {session ? (
          <button
            onClick={() => signOut()}
            className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        ) : (
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Additional Links */}
      <div className="mt-8 space-x-4">
        <Link href="/courses" className="text-blue-600 font-semibold hover:underline">
          Browse Courses
        </Link>
        <Link href="/dashboard" className="text-blue-600 font-semibold hover:underline">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
