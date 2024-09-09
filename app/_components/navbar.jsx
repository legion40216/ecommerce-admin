import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';

import MainNav from "./_navbar/main-nav";
import StoreSwitcher from "./_navbar/store-switcher";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Navbar() {
  const {userId} = auth()

  if(!userId) {
    redirect("/sign-in")
  }

  const stores = await prisma.store.findMany({
    where: {
      userId
    }
  })

  return (
    <nav className="container-full sticky flex justify-between items-center px-4 py-4 border-b border-gray-200">
      <div className="flex gap-4 items-center">
        <StoreSwitcher 
        stores={stores}
        />
        <MainNav />
      </div>
      <div className="flex items-center gap-2 text-primary">
      <Button size="sm" variant="outline" asChild>
         <Link href="/">
          <span className="font-bold">
            Dashboard
          </span>
         </Link>
        </Button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}