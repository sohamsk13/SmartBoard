import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/auth';
import { authenticateRequest, createAuthErrorResponse, createValidationErrorResponse } from '@/lib/middleware';

// Get all boards for authenticated user
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return createAuthErrorResponse();
  }

  try {
    const data = await readData();
    const userBoards = data.boards.filter(board => board.userId === auth.userId);
    
    return NextResponse.json(userBoards);
  } catch (error) {
    console.error('Get boards error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new board
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return createAuthErrorResponse();
  }

  try {
    const { name } = await request.json();

    if (!name || name.trim().length === 0) {
      return createValidationErrorResponse('Board name is required');
    }

    const data = await readData();
    
    const newBoard = {
      id: generateId(),
      name: name.trim(),
      userId: auth.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.boards.push(newBoard);
    await writeData(data);

    return NextResponse.json(newBoard);
  } catch (error) {
    console.error('Create board error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}