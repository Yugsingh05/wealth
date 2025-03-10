import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import CheckUser from "@/lib/CheckUser";

const Header = async() => {

  await CheckUser();
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">

      <nav className="container mx-auto flex items-center justify-between px-4 py-4">

        <Link href={"/"}>
          <Image
            className="h-12 auto object-contain"
            src="/logo.png"
            alt="logo"
            width={200}
            height={60}
          />
        </Link>

        <div className="flex items-center space-x-4">
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2 "
            >
              <Button variant={"outline"} className={"hover:cursor-pointer"} >
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <Link
              href="/transaction/create"
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
            >
              <Button className={"flex items-center gap-2 cursor-pointer"}>
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant={"outline"}>Login</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: {
                    width: 40,
                    height: 40,
                  },
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Header;
