export { default } from "next-auth/middleware"

export const config = { matcher: ["/notes/:path*", "/forum/:path*", "/profile/:path*"] }