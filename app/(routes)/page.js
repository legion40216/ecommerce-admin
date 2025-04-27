import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { redirect } from 'next/navigation';

import React from 'react'
import DashboardClient from './_components/dashboard-client'

export default async function page() {
  const {userId} = auth()

  if(!userId) {
    redirect("/sign-in")
  }

  const store = await prisma.store.findFirst({})

  if(store) {
    redirect(`/${store.id}`)
  }
  
  return (
    <div>
      <DashboardClient/>
    </div>
  )
}
