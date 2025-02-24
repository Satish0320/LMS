"use client";

import { useEffect, useState } from "react";

export default function CoursesList() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data.Allcourses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleBuyCourse = async (courseId: string) => {
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Course purchased successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error buying course:", error);
      alert("Failed to buy the course.");
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Available Courses</h1>
      {courses.length === 0 ? (
        <p>No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {courses.map((course) => (
            <div key={course.id} className="p-4 border rounded">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p>{course.description}</p>
              <p className="font-bold">Price: ₹{course.price}</p>
              <button
                onClick={() => handleBuyCourse(course.id)}
                className="mt-2 p-2 bg-green-600 text-white rounded"
              >
                Buy Course
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
