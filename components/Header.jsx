
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { ThemeChanger } from "./ThemeChanger";
import CheckUser from "@/lib/CheckUser";
import logo from "../public/finspendlogo.png"
const Header = async() => {


  await CheckUser();
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b dark:bg-slate-900">

      <nav className="container mx-auto flex items-center justify-between px-4 py-4">

        <Link href={"/"}>
        <Image
  className="h-12 w-auto object-contain" 
  src={logo}
  alt="logo"
  height={100} 
  width={200} 
/>

        </Link>

        <div className="flex items-center space-x-2">
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-white hover:text-blue-600 flex items-center gap-2 "
            >
              <Button variant={"outline"} className={"hover:cursor-pointer dark:text-black hover:dark:bg-blue-600 dark:bg-white hover:dark:text-white bg-black"} >
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <ThemeChanger/>

           


            <Link
              href="/transaction/create"
              className="text-gray-600 hover:text-blue-600 flex items-center gap-2 "
            >
              <Button className={"flex items-center gap-2 cursor-pointer  hover:dark:bg-blue-600 hover:dark:text-white hover:bg-white hover:text-black border-2"}>
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
