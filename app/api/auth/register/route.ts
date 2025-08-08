import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, hashPassword, generateId } from '@/lib/auth';
import { createValidationErrorResponse } from '@/lib/middleware';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return createValidationErrorResponse('Email, password, and name are required');
    }

    if (password.length < 6) {
      return createValidationErrorResponse('Password must be at least 6 characters');
    }

    const data = await readData();
    
    // Check if user already exists
    const existingUser = data.users.find(user => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: generateId(),
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString()
    };

    data.users.push(newUser);
    await writeData(data);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}