import { NextResponse, NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname == "/auth") {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }
  if (req.nextUrl.pathname == "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-url", req.nextUrl.pathname);
  if (req.nextUrl.searchParams.get("callbackUrl")) {
    reqHeaders.set(
      "callbackUrl",
      req.nextUrl.searchParams.get("callbackUrl") || "/app"
    );
  }

  // pass the header to the layout
  return NextResponse.next({
    request: {
      headers: reqHeaders,
    },
  });
}
