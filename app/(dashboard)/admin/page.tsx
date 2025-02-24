"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function AdminDashboard() {
    const titleref = useRef<HTMLInputElement>(null);
    const descriptionref = useRef<HTMLTextAreaElement>(null);
    const priceref = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user || session.user.role !== "ADMIN") {
    router.push("/dashboard");
    return null;
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = titleref.current?.value
    const description = descriptionref.current?.value
    const price = priceref.current?.value
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, price}),
    });

    if (res.ok) {
      alert("Course added successfully!");
    } else {
      alert("Failed to add course.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <form onSubmit={handleAddCourse} className="mt-4">
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
          Add Course
        </button>
      </form>
    </div>
  );
}
