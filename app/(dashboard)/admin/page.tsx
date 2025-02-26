"use client"

import { useEffect, useState } from "react";
import Link from "next/link";


export default function CoursesList() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data.allCourses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const deletecourse = async(id: string) =>{
    try {
      await fetch("/api/courses",{
        method: "DELETE",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({id})
      });

      setCourses((prevCourse)=> prevCourse.filter((course)=>course.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Something went wrong.");
    }
  }
  

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
              <p className="font-bold">ID: {course.id}</p>
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p>{course.description}</p>
              <p className="font-bold">Price: ₹{course.price}</p>
              <div>
              <Link href="/edit-courses">
          <button className="mt-2 p-2 bg-blue-600 text-white rounded">Edit</button>
        </Link>
              </div>
              <div>
                <button
                  onClick={() => deletecourse(course.id)}
                  className="mt-2 p-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div>
        <Link href="/admin-courses">
          <button className="mt-2 p-2 bg-green-600 text-white rounded">Add Course</button>
        </Link>
      </div>
    </div>
  );
}