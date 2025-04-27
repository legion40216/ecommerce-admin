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