import { NextRequest, NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/auth';
import { authenticateRequest, createAuthErrorResponse, createValidationErrorResponse } from '@/lib/middleware';

// Reorder tasks
export async function PUT(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth) {
    return createAuthErrorResponse();
  }

  try {
    const { taskIds } = await request.json();

    if (!Array.isArray(taskIds)) {
      return createValidationErrorResponse('Task IDs must be an array');
    }

    const data = await readData();
    
    // Update order for each task
    taskIds.forEach((taskId, index) => {
      const taskIndex = data.tasks.findIndex(
        task => task.id === taskId && task.userId === auth.userId
      );
      
      if (taskIndex !== -1) {
        data.tasks[taskIndex].order = index + 1;
        data.tasks[taskIndex].updatedAt = new Date().toISOString();
      }
    });

    await writeData(data);

    return NextResponse.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    console.error('Reorder tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}