"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import Link from "next/link";


export default function AdminDashboard() {
    const idRef = useRef<HTMLInputElement>(null);
    const titleref = useRef<HTMLInputElement>(null);
    const descriptionref = useRef<HTMLTextAreaElement>(null);
    const priceref = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user || session.user.role !== "ADMIN") {
    router.push("/dashboard");
    return null;
  }

  const updatecourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = idRef.current?.value;
    const title = titleref.current?.value
    const description = descriptionref.current?.value
    const price = priceref.current?.value
    const res = await fetch("/api/courses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title, description, price}),
    });

    if (res.ok) {
      alert("Course updated successfully!");
    } else {
      alert("Failed to update course.");
    }
  };

  return (
    <div>
      
      <div className="p-6">
      <h1 className="text-2xl font-bold">Course Update Dashboard</h1>

      <form onSubmit={updatecourse} className="mt-4">
      <input
          type="text"
          ref={idRef}
          placeholder="Course ID"
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          ref={titleref}
          placeholder="Course Title"
          className="border p-2 w-full"
        />
        <textarea
          ref={descriptionref}
          placeholder="Course Description"
          className="border p-2 w-full mt-2"
        />
        <input
          type="number"
          placeholder="Price"
          ref={priceref}
          className="border p-2 w-full mt-2"
        />
        <button className="mt-2 p-2 bg-blue-600 text-white rounded" type="submit">
         Update
        </button>
      </form>
      <Link href="/admin">
            <button className="mt-2 p-2 bg-green-600 text-white rounded">View Courses</button>
          </Link>
    </div>
    </div>
  );
}
