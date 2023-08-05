import { NextResponse } from 'next/server';

import server from '@/network/server';

export async function GET(request: Request) {
  const params = Object.fromEntries(new URL(request.url).searchParams.entries());
  const response = await server.get('/discover/movie', {
    params
  });

  return NextResponse.json(response);
}

export const revalidate = 0;
