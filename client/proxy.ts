import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const isPublicPage = pathname === "/" || pathname.startsWith("/auth");

    if (token && isPublicPage) {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    if (
      token &&
      token.onBoarded === false &&
      !pathname.startsWith("/on-board")
    ) {
      return NextResponse.redirect(new URL("/on-board", req.url));
    }

    if (token && token.onBoarded === true && pathname.startsWith("/on-board")) {
      return NextResponse.redirect(new URL("/home", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        if (pathname === "/" || pathname.startsWith("/auth")) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
