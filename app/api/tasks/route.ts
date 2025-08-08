import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData, generateId } from '@/lib/auth';
import { authenticateRequest, createAuthErrorResponse, createValidationErrorResponse } from '@/lib/middleware';

// Get all tasks for authenticated user
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return createAuthErrorResponse();
  }

  try {
    const url = new URL(request.url);
    const boardId = url.searchParams.get('boardId');

    const data = await readData();
    let userTasks = data.tasks.filter(task => task.userId === auth.userId);
    
    if (boardId) {
      userTasks = userTasks.filter(task => task.boardId === boardId);
    }

    // Sort by order and creation date
    userTasks.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new task
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return createAuthErrorResponse();
  }

  try {
    const { title, description, boardId, dueDate } = await request.json();

    if (!title || title.trim().length === 0) {
      return createValidationErrorResponse('Task title is required');
    }

    if (!boardId) {
      return createValidationErrorResponse('Board ID is required');
    }

    const data = await readData();
    
    // Verify board exists and belongs to user
    const board = data.boards.find(
      board => board.id === boardId && board.userId === auth.userId
    );
    
    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    // Get the highest order number for tasks in this board
    const boardTasks = data.tasks.filter(task => task.boardId === boardId);
    const maxOrder = Math.max(...boardTasks.map(task => task.order), 0);

    const newTask = {
      id: generateId(),
      title: title.trim(),
      description: description?.trim() || '',
      status: 'pending' as const,
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      boardId,
      userId: auth.userId,
      order: maxOrder + 1
    };

    data.tasks.push(newTask);
    await writeData(data);

    return NextResponse.json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}