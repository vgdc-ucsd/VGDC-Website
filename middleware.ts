import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * This method helps intercept incoming requests so that 
 * Nextjs server components can access URL data via headers. 
 *
 * https://nextjs.org/docs/app/building-your-application/routing/middleware?ref=propelauth.com
 * 
 * @param request an HTTP request object 
 * @returns a response object with customized headers
 */

export function middleware(request: NextRequest) {
  // Add a new header x-current-path which passes the path to downstream components
  const headers = new Headers(request.headers);
  const testhost = "56a4-2600-1700-7c01-1380-301b-91f5-2629-245b.ngrok-free.app"
  headers.set("x-current-path", `https://${request.nextUrl.host}${request.nextUrl.pathname}`);
  headers.set("x-host-name", request.nextUrl.host)
  headers.set("x-port",request.nextUrl.port)
  return NextResponse.next({ headers });

  
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};