import { NextResponse, NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, '10 m'),
});

export const config = {
  matcher: '/api/:path*',
};

export default async function middleware(request: NextRequest) {
  // const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
  // const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  // return success
  //   ? NextResponse.next()
  //   : new Response('Too many requests', {
  //       status: 429,
  //       headers: {
  //         'X-RateLimit-Limit': limit.toString(),
  //         'X-RateLimit-Remaining': remaining.toString(),
  //         'X-RateLimit-Reset': reset.toString(),
  //       },
  //     });
  return NextResponse.next();
}
