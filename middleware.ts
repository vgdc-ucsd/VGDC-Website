import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * This method helps intercept incoming requests so that 
 * Nextjs server components can access URL data via headers. 
 * This is used for the blog page component
 * https://nextjs.org/docs/app/building-your-application/routing/middleware?ref=propelauth.com
 * 
 * @param request an HTTP request object 
 * @returns a response object with customized headers
 */

export function middleware(request: NextRequest) {
  // Add a new header x-current-path which passes the path to downstream components
  const headers = new Headers(request.headers);
  headers.set("x-current-path", `https://${request.nextUrl.host}${request.nextUrl.pathname}`);
  headers.set("x-host-name",request.nextUrl.hostname)
  headers.set("x-port",request.nextUrl.port)
  return NextResponse.next({ headers });
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};