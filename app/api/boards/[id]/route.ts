import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/auth';
import { authenticateRequest, createAuthErrorResponse, createValidationErrorResponse } from '@/lib/middleware';

// Update board
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return createAuthErrorResponse();
  }

  try {
    const { name } = await request.json();
    const boardId = params.id;

    if (!name || name.trim().length === 0) {
      return createValidationErrorResponse('Board name is required');
    }

    const data = await readData();
    const boardIndex = data.boards.findIndex(
      board => board.id === boardId && board.userId === auth.userId
    );

    if (boardIndex === -1) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    data.boards[boardIndex].name = name.trim();
    data.boards[boardIndex].updatedAt = new Date().toISOString();
    await writeData(data);

    return NextResponse.json(data.boards[boardIndex]);
  } catch (error) {
    console.error('Update board error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete board
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return createAuthErrorResponse();
  }

  try {
    const boardId = params.id;
    const data = await readData();
    
    const boardIndex = data.boards.findIndex(
      board => board.id === boardId && board.userId === auth.userId
    );

    if (boardIndex === -1) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    // Remove board and all its tasks
    data.boards.splice(boardIndex, 1);
    data.tasks = data.tasks.filter(task => task.boardId !== boardId);
    await writeData(data);

    return NextResponse.json({ message: 'Board deleted successfully' });
  } catch (error) {
    console.error('Delete board error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}