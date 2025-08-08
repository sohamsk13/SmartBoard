import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';

export async function authenticateRequest(request: NextRequest): Promise<{ userId: string } | null> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  return payload;
}

export function createAuthErrorResponse(): NextResponse {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}

export function createValidationErrorResponse(message: string): NextResponse {
  return NextResponse.json(
    { error: message },
    { status: 400 }
  );
}