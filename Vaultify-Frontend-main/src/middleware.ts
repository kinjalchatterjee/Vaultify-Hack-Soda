import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define the public routes you want to allow without authentication
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/onboarding(.*)', '/']);

export default clerkMiddleware(
  async (auth, req) => {
    // Protect all non-public routes
    if (!isPublicRoute(req)) {
      // Use `auth.protect()` to automatically handle unauthenticated users
      await auth.protect();
    }
  },
  { debug: true } // Enable debugging to troubleshoot Clerk middleware behavior
);

// Matcher configuration
export const config = {
  matcher: [
    // Exclude Next.js internals and static assets
    '/((?!_next|[^?]*\\.(?:html?|css|js|jpg|jpeg|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Run middleware for API routes
    '/(api|trpc)(.*)',
  ],
};
