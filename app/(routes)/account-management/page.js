import React from 'react'

import { auth, clerkClient, } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import AccountManagenetClient from './components/client';

// Exclude the admin user funtion
async function getUsers(adminUserId) {
  const users = (await clerkClient().users.getUserList()).data;
  return users
      .filter(user => user.id !== adminUserId) // Exclude the admin user
      .map(user => ({
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.publicMetadata.role,
      }));
}
export default async function page() {
  const { userId } = auth();

  // If user is not logged in, redirect to sign-in
  if (!userId) {
      redirect("/sign-in");
  }

  // Get the current user
  const user = await clerkClient.users.getUser(userId);

  // If user is not admin, redirect to unauthorized
  if (user.publicMetadata.role !== "admin") {
      redirect("/unauthorized");
  }

  // Pass userId to getUsers to exclude the current admin
  const users = await getUsers(userId);
  
  // Format the users
  const formattedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.role ? 'Approved' : 'Pending',
  }));

  return (
      <AccountManagenetClient
          users={formattedUsers} 
      />
  );
}