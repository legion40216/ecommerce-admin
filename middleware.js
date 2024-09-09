import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes, including specific pages and all API routes
const publicRoutes = [
  "/site",
  "/api(.*)", // Make all API routes public
  "/agency/sign-in(.*)",
  "/agency/sign-up(.*)",
];

const isPublicRoute = createRouteMatcher(publicRoutes);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const path = req.nextUrl.pathname;

  console.log("Middleware processing path:", path);

  if (isPublicRoute(req)) {
    console.log("Public route accessed:", path);
    return NextResponse.next();
  }

  if (!userId) {
    console.log("Unauthenticated user redirected to sign-in");
    return NextResponse.redirect(new URL('/agency/sign-in', req.url));
  }

  console.log("Authenticated user:", userId);
  // You can add more custom logic here if needed

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Matcher for all routes except static files
    "/",
    "/(api|trpc)(.*)", // Including API and tRPC routes
  ],
};