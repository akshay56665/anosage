"use client";
import { User } from "next-auth";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-100">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-2xl font-bold mb-4 md:mb-0">
          ReviewKit
        </Link>
        {session ? (
          <>
            <div className="flex justify-center items-center gap-5">
              <Button onClick={() => router.replace("/dashboard")}>
                Dashboard
              </Button>
            </div>
          </>
        ) : (
          <Button
            onClick={() => router.replace("/signin")}
            className="w-full md:w-auto"
            variant={"outline"}
          >
            Login
          </Button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
