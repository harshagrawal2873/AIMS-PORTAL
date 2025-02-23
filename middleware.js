// import { NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function middleware(req) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("authToken");
//   console.log("logging the token from cookiestore from next/headers :: ", token);
//   const pathname = req.nextUrl.pathname;

//   const protectedRoutes = [
//     "/home",
//     "/profile",
//     "/about",
//     "/courses",
//     "/help",
//     "/student-record",
//     "/current-semester",
//   ];

//   // Redirect to login if accessing protected route without token
//   if (protectedRoutes.includes(pathname) && !token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next(); // Proceed if authenticated or on public routes
// }

// export const config = {
//   matcher: [
//     "/home",
//     "/profile",
//     "/about",
//     "/courses",
//     "/help",
//     "/student-record",
//     "/current-semester",
//   ],
// };


import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose'; // Use jose for JWT verification

export async function middleware(req) {
  console.log('Middleware triggered for:', req.nextUrl.pathname);

  // Extract token from cookies using next/headers
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value || null;
  console.log('Extracted authToken:', token ? 'Present' : 'Not found');

  // Role-based routing for frontend
  const protectedRoutes = [
    '/home', '/profile', '/about', '/courses', '/help', 
    '/student-record', '/current-semester',
  ];
  const publicRoutes = ['/login', '/register', '/forgot-password'];

  const pathname = req.nextUrl.pathname;

  // If trying to access protected route without a token, redirect to login
  if (protectedRoutes.includes(pathname) && !token) {
    console.log('No token found, redirecting to login.');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (publicRoutes.includes(pathname) && token) {
    console.log('Already authenticated, redirecting to home.');
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // API routes: validate token and role-based access control
  if (pathname.startsWith('/api/')) {
    if (!token) {
      console.warn('Auth token missing in cookies for API route');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
      // Use jose to verify JWT token
      const decoded = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      console.log('Decoded token:', decoded);

      // Attach user role and ID to request headers for use in API routes
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-role', decoded.payload.role.toLowerCase());
      requestHeaders.set('x-user-id', decoded.payload.id);

      console.log('User role set:', decoded.payload.role.toLowerCase());
      console.log('User ID set:', decoded.payload.id);

      // Role-based access control for API routes
      const apiPath = req.nextUrl.pathname;

      if (apiPath.startsWith('/api/admin') && decoded.payload.role.toLowerCase() !== 'admin') {
        console.warn('Access denied: Admins only');
        return NextResponse.json({ message: 'Access denied. Admins only.' }, { status: 403 });
      }

      if (apiPath.startsWith('/api/faculty') && decoded.payload.role.toLowerCase() !== 'professor') {
        console.warn('Access denied: Professors only');
        return NextResponse.json({ message: 'Access denied. Professors only.' }, { status: 403 });
      }

      if (apiPath.startsWith('/api/student') && decoded.payload.role.toLowerCase() !== 'student') {
        console.warn('Access denied: Students only');
        return NextResponse.json({ message: 'Access denied. Students only.' }, { status: 403 });
      }

      // Proceed with API route
      console.log('API route access granted:', apiPath);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  }

  return NextResponse.next(); // Proceed if route is accessible
}

// Apply middleware to all routes (both frontend and API)
export const config = {
  matcher: [
    '/home', '/profile', '/about', '/courses', '/help', 
    '/student-record', '/current-semester', // Frontend protected routes
    '/api/admin/:path*', '/api/faculty/:path*', '/api/student/:path*', // API protected routes
  ],
};
