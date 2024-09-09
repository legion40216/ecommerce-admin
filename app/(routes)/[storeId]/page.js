import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import React from 'react'

export default async function page({params}) {

    const {userId} = auth()

    if(!userId) {
        redirect('/sign-in')
    }

    const store = await prisma.store.findUnique({
        where: {
            id: params.storeId,
        }
    })

    if(!store) {
        redirect('/')
    }

  return (
    <div className="font-semibold">
        pageID
    </div>
  )
}
