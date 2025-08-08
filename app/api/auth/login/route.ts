import { NextRequest, NextResponse } from 'next/server';
import { readData, comparePassword, generateToken } from '@/lib/auth';
import { createValidationErrorResponse } from '@/lib/middleware';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return createValidationErrorResponse('Email and password are required');
    }

    const data = await readData();
    
    // Find user
    const user = data.users.find(user => user.email === email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user without password and token
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}