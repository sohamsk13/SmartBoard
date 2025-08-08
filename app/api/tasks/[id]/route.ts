import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/auth';
import { authenticateRequest, createAuthErrorResponse, createValidationErrorResponse } from '@/lib/middleware';

// Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return createAuthErrorResponse();
  }

  try {
    const { title, description, status, dueDate } = await request.json();
    const taskId = params.id;

    if (!title || title.trim().length === 0) {
      return createValidationErrorResponse('Task title is required');
    }

    if (status && !['pending', 'completed'].includes(status)) {
      return createValidationErrorResponse('Invalid status');
    }

    const data = await readData();
    const taskIndex = data.tasks.findIndex(
      task => task.id === taskId && task.userId === auth.userId
    );

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    data.tasks[taskIndex].title = title.trim();
    data.tasks[taskIndex].description = description?.trim() || '';
    data.tasks[taskIndex].status = status || data.tasks[taskIndex].status;
    data.tasks[taskIndex].dueDate = dueDate || data.tasks[taskIndex].dueDate;
    data.tasks[taskIndex].updatedAt = new Date().toISOString();

    await writeData(data);

    return NextResponse.json(data.tasks[taskIndex]);
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return createAuthErrorResponse();
  }

  try {
    const taskId = params.id;
    const data = await readData();
    
    const taskIndex = data.tasks.findIndex(
      task => task.id === taskId && task.userId === auth.userId
    );

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    data.tasks.splice(taskIndex, 1);
    await writeData(data);

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}