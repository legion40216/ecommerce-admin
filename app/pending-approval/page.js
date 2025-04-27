import { Button } from '@/components/ui/button';
import { SignOutButton } from '@clerk/nextjs'
import React from 'react'

export default function page() {
  return (
       <div className="flex flex-col items-center justify-center min-h-screen py-2">
       <h1 className="text-4xl font-bold mb-4">Account Pending Approval</h1>
       <p className="mb-4">Your account is currently pending approval. Please check back later or contact an administrator.</p>
       <SignOutButton>
         <Button
         variant="outline"
         >
           Sign out
         </Button>
       </SignOutButton>
     </div>
  )
}