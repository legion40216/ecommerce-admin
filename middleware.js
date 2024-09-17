// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   "/site",
//   "/api(.*)",
//   "/agency/sign-in(.*)",
//   "/agency/sign-up(.*)",
//   "/sign-in(.*)",
//   "/unauthorized",
//   "/pending-approval",  // Add this route as public
// ]);

// const handleAuth = async (auth, req) => {
//   const { userId, sessionClaims } = auth();
//   const role = sessionClaims?.metadata.role;

//   if (isPublicRoute(req)) {
//     return NextResponse.next();
//   }

//   if (!userId) {
//     console.log('User is not authenticated, redirecting to sign-in');
//     return NextResponse.redirect(new URL("/sign-in", req.url));
//   }

//   // Allow access to account management for admins
//   if (req.nextUrl.pathname.startsWith('/admin/account-management')) {
//     if (role === "admin") {
//       return NextResponse.next();
//     } else {
//       console.log('User is not an admin, redirecting to unauthorized');
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }
//   }

//   // Allow access to dashboard for users with 'user' or 'admin' role
//   if (role === "user" || role === "admin") {
//     console.log('User is authenticated and has the correct role, allowing access');
//     return NextResponse.next();
//   }

//   // Redirect to pending approval page for users without a role
//   if (!role) {
//     console.log('User is authenticated but pending approval');
//     return NextResponse.redirect(new URL("/pending-approval", req.url));
//   }

//   // If we reach here, the user is authenticated but doesn't have a valid role
//   return NextResponse.redirect(new URL("/unauthorized", req.url));
// };

// export default clerkMiddleware((auth, req) => {
//   if (!isPublicRoute(req)) {
//     auth().protect();
//   }
//   return handleAuth(auth, req);
// });

// export const config = {
//   matcher: [
//     '/((?!.*\\..*|_next).*)',
//     '/',
//     '/(api|trpc)(.*)',
//   ],
// };

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/dashboard(.*)'])
const isPublicRoute = createRouteMatcher(['/api(.*)', '/sign-in(.*)', '/sign-out(.*)','/pending-approval'])

export default clerkMiddleware((auth, req) => {
  const { userId, sessionClaims } = auth()

  // Allow access to public routes
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // If the user isn't signed in and the route is private, redirect to sign-in
  if (!userId) {
    return auth().redirectToSignIn({ returnBackUrl: req.url })
  }

  // Check user role from session claims
  const userRole = sessionClaims?.metadata?.role

  // If user is not admin or user, redirect to pending approval
  if (userRole !== 'admin' && userRole !== 'user') {
    return NextResponse.redirect(new URL('/pending-approval', req.url))
  }

  // If user role is 'user' and trying to access admin routes, redirect to unauthorized
  if (userRole === 'user' && isAdminRoute(req)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }

  // Allow access for all other cases
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}