import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {

    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    const userId = request.cookies.get('user');
    console.log('Middleware... user:', userId)
    if (!userId) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/home', '/api/todo:path*']
}