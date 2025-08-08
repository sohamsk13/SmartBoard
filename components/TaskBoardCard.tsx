'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Edit2, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';

interface TaskBoard {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  boardId: string;
  userId: string;
  order: number;
}

interface TaskBoardCardProps {
  board: TaskBoard;
  tasks: Task[];
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string, currentStatus: 'pending' | 'completed') => void;
  isLoading: boolean;
}

export default function TaskBoardCard({
  board,
  tasks,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  isLoading
}: TaskBoardCardProps) {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  const getDueDateStatus = (dueDate: string | undefined) => {
    if (!dueDate) return null;
    
    const due = new Date(dueDate);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    
    if (isBefore(due, today)) {
      return { status: 'overdue', color: 'destructive', icon: AlertCircle };
    } else if (isBefore(due, tomorrow)) {
      return { status: 'due-today', color: 'warning', icon: Clock };
    } else if (isBefore(due, addDays(today, 3))) {
      return { status: 'due-soon', color: 'default', icon: Calendar };
    }
    
    return { status: 'future', color: 'secondary', icon: Calendar };
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const TaskItem = ({ task, showBoardView = true }: { task: Task; showBoardView?: boolean }) => {
    const dueDateStatus = getDueDateStatus(task.dueDate);

    // In TaskBoardCard.tsx checkbox handler
console.log('Checkbox changed:', { taskId: task.id, currentStatus: task.status });
    
    return (
      <div 
        className={`group relative ${
          showBoardView 
            ? 'bg-[#1A0B2E]/60 border border-purple-500/10 rounded-xl p-4 hover:bg-[#2A1B3E]/60 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10' 
            : 'bg-[#1A0B2E]/60 border border-purple-500/10 rounded-lg p-3 hover:bg-[#2A1B3E]/60 transition-all duration-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <Checkbox
  checked={task.status === 'completed'}
  onCheckedChange={(checked) => {
    // Pass the current status, not the new status
    onToggleStatus(task.id, task.status);
  }}
  className="mt-1 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
/>

          
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium leading-tight ${
                  task.status === 'completed' 
                    ? 'text-green-300 line-through' 
                    : 'text-white'
                }`}>
                  {task.title}
                </h4>
                
                {task.description && (
                  <p className="text-purple-200 text-sm mt-1 leading-relaxed">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-3">
                  {task.dueDate && (
                    <Badge 
                      variant={dueDateStatus?.color as any}
                      className={`text-xs px-2 py-1 ${
                        dueDateStatus?.status === 'overdue' 
                          ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                          : dueDateStatus?.status === 'due-today'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      {dueDateStatus?.icon && <dueDateStatus.icon className="w-3 h-3 mr-1" />}
                      {format(new Date(task.dueDate), 'MMM d')}
                    </Badge>
                  )}
                  
                  <span className="text-purple-300 text-xs">
                    {format(new Date(task.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  onClick={() => onEditTask(task)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-purple-300 hover:text-white hover:bg-purple-500/20"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onDeleteTask(task.id)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-300 hover:text-white hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
  <Card className="bg-[#1A0B2E]/40 border-purple-500/10 backdrop-blur-xl shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
    <CardHeader className="border-b border-white/5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="text-white text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {board.name}
          </CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-purple-200/80 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {tasks.length} tasks • {completionRate}% complete
            </span>
            {completionRate > 0 && (
              <div className="w-24 h-2 bg-[#2A1B3E] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-[#2A1B3E] rounded-lg p-1">
            <Button
              onClick={() => setViewMode('board')}
              variant={viewMode === 'board' ? 'default' : 'ghost'}
              size="sm"
              className={`px-3 py-1 text-xs ${
                viewMode === 'board' 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/25' 
                  : 'text-purple-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Board
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className={`px-3 py-1 text-xs ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/25' 
                  : 'text-purple-200 hover:text-white hover:bg-white/5'
              }`}
            >
              List
            </Button>
          </div>
          
          <Button
            onClick={onCreateTask}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
    </CardHeader>
    
    <CardContent className="pt-6">
      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-[#2A1B3E]/30 rounded-xl border border-purple-500/10">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-purple-300" />
          </div>
          <p className="text-white text-lg mb-2 font-medium">No tasks yet</p>
          <p className="text-purple-200/80 mb-6">Create your first task to get started</p>
          <Button
            onClick={onCreateTask}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      ) : viewMode === 'board' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Tasks Column */}
          <div className="space-y-4 bg-[#2A1B3E]/30 p-4 rounded-xl border border-purple-500/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/25"></div>
              <h3 className="text-white font-medium">Pending ({pendingTasks.length})</h3>
            </div>
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
          
          {/* Completed Tasks Column */}
          <div className="space-y-4 bg-[#2A1B3E]/30 p-4 rounded-xl border border-purple-500/10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/25"></div>
              <h3 className="text-white font-medium">Completed ({completedTasks.length})</h3>
            </div>
            <div className="space-y-3">
              {completedTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} showBoardView={false} />
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);
}