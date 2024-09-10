import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes, including specific pages and all API routes
const isPublicRoute = createRouteMatcher([
  "/site",
  "/api(.*)", // Make all API routes public
  "/agency/sign-in(.*)",
  "/agency/sign-up(.*)",
]);

const afterAuth = async (auth) => {
  const { userId } = auth();
  console.log("afterAuth logic", userId);
  return NextResponse.next();
};

export default clerkMiddleware((auth, request) => {
  const { userId } = auth();
  console.log("beforeAuth logic", userId);

  // If the route is not public, apply authentication
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  // Call afterAuth function to handle logic after authentication check
  return afterAuth(auth);
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Matcher for all routes except static files
    "/", 
    "/(api|trpc)(.*)", // Including API and tRPC routes
  ],
};