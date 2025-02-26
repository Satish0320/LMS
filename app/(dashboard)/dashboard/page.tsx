"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Dashboard(){

    const{data: session, status} = useSession();
    const route = useRouter();

    if(status === "loading") return <p>Loading....</p>

    if (!session?.user) {
        route.push("/login")
        return null
    }
  // console.log(session)


    return (
        <div className="p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p>Welcome, {session.user.name} ({session.user.role})</p>
  
        {session.user.role === "ADMIN" ? (
          <div>
            <h2 className="text-xl font-semibold mt-4">Admin Panel</h2>
            <Link href="/admin">
              <button className="mt-2 p-2 bg-blue-600 text-white rounded" >Manage Courses</button>
            </Link>
          </div> 
    ) : (
        <div>
          <h2 className="text-xl font-semibold mt-4"> Courses</h2>
          <Link href="/courses">
            <button className="mt-2 p-2 bg-green-600 text-white rounded">View Courses</button>
          </Link>
          <div>
          <h2 className="text-xl font-semibold mt-4">Enrolled Courses</h2>
          <Link href="/my-courses">
            <button className="mt-2 p-2 bg-green-600 text-white rounded">View Courses</button>
          </Link>
        </div>
        </div>
        
      )}
    </div>
    )
}
