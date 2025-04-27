import React from 'react'

import Client from './components/client';
import { auth, clerkClient, } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

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


export default async function AccountManagementPage() {
  const { userId } = auth();

  if (!userId) {
      redirect("/sign-in");
  }

  const user = await clerkClient.users.getUser(userId);

  if (user.publicMetadata.role !== "admin") {
      redirect("/unauthorized");
  }

  // Pass userId to getUsers to exclude the current admin
  const users = await getUsers(userId);

  const formattedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.role ? 'Approved' : 'Pending',
  }));

  return (
      <Client 
          users={formattedUsers} 
      />
  );
}