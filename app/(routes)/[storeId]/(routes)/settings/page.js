import React from 'react'

import prisma from '@/lib/prismadb';
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server';
import SettingForm from './_components/setting-form';

export default async function page({params}) {
  const {userId} = auth()

  if(!userId) {
      redirect('/sign-in')
  }
  const store = await prisma.store.findUnique({
    where: {
        id: params.storeId
    }
})


if(!store) {
  redirect('/')
}

  return (
      <SettingForm 
      store={store}
      />
  )
}
