import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth,clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';

import MainNav from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import Link from "next/link";


export default async function Navbar() {
  const {userId} = auth()

  if(!userId) {
    redirect("/sign-in")
  }

  const stores = await prisma.store.findMany()

   
  const user = await clerkClient.users.getUser(userId);
  const showAccoutManagement = user.publicMetadata.role === "admin"

  return (
    <nav className="container-full sticky flex justify-between items-center px-4 py-4 border-b border-gray-200">
      <div>
        <div className="flex gap-4 items-center">
          <StoreSwitcher 
            stores={stores}
          />
          {stores.length > 0 && <MainNav />}
        </div>
      </div>
 
      <div className="flex items-center gap-2 text-primary">
        {
          showAccoutManagement &&
          <Button size="sm" variant="outline" asChild>
          <Link href="/dashboard/account-management">
            <span className="font-bold">
              User Management
            </span>
          </Link>
        </Button>
        }
    
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}