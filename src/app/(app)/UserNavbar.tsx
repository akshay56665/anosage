"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

function UserNavbar() {
  const router = useRouter();

  const handleLogOut = async () => {
    await signOut();
    router.replace("/");
  };
  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold mb-4 md:mb-0">
          ReviewKit
        </Link>

        <div>
          <Button onClick={handleLogOut} className="w-full md:w-auto  text-md ">
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default UserNavbar;
