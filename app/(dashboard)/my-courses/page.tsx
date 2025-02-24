
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EnrolledCourses() {
    
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await fetch("/api/my-courses");
        if (!res.ok) throw new Error("Failed to fetch enrolled courses");
        const data = await res.json();
        setCourses(data.enrolledCourses || []);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

   const{data: session} = useSession();
      const route = useRouter();
  
  
      if (!session?.user) {
          route.push("/dashboard")
          return null
      }

  if (loading) return <p>Loading enrolled courses...</p>;

  return (
    <div className="p-6">
        {session.user.name}
      <h1 className="text-2xl font-bold">My Courses</h1>
      {courses.length === 0 ? (
        <p>You are not enrolled in any courses.</p>
      ) : (
        <ul className="mt-4">
          {courses.map((course) => (
            <li key={course.id} className="p-4 border rounded mb-2">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p>{course.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
