'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskBoardCard from '@/components/TaskBoardCard';
import CreateBoardDialog from '@/components/CreateBoardDialog';
import TaskDialog from '@/components/TaskDialog';
import { LogOut, Plus, CheckCircle, User, Sparkles, BarChart3 } from 'lucide-react';

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

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { makeRequest, isLoading } = useApi();
  const [boards, setBoards] = useState<TaskBoard[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<TaskBoard | null>(null);
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Load boards on component mount
  useEffect(() => {
    loadBoards();
  }, []);

  // Load tasks when boards are available
  useEffect(() => {
    if (boards.length > 0) {
      // Load tasks for all boards
      loadAllTasks();
    }
  }, [boards]);

  const loadBoards = async () => {
    try {
      const data = await makeRequest('/api/boards');
      setBoards(data);
      if (data.length > 0 && !selectedBoard) {
        setSelectedBoard(data[0]);
      }
    } catch (error) {
      console.error('Failed to load boards:', error);
    }
  };

  const loadAllTasks = async () => {
    try {
      const allTasks = await Promise.all(
        boards.map(board => makeRequest(`/api/tasks?boardId=${board.id}`))
      );
      
      // Combine all tasks into a single array
      const combinedTasks = allTasks.flat();
      setTasks(combinedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const createBoard = async (name: string) => {
    try {
      const newBoard = await makeRequest('/api/boards', {
        method: 'POST',
        body: { name },
      });
      setBoards([...boards, newBoard]);
      if (!selectedBoard) {
        setSelectedBoard(newBoard);
      }
      setIsCreateBoardOpen(false);
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  const deleteBoard = async (boardId: string) => {
    try {
      await makeRequest(`/api/boards/${boardId}`, {
        method: 'DELETE',
      });
      const updatedBoards = boards.filter(board => board.id !== boardId);
      setBoards(updatedBoards);
      if (selectedBoard?.id === boardId) {
        setSelectedBoard(updatedBoards[0] || null);
      }
    } catch (error) {
      console.error('Failed to delete board:', error);
    }
  };

  const createTask = async (taskData: Partial<Task>) => {
    if (!selectedBoard) return;
    
    try {
      const newTask = await makeRequest('/api/tasks', {
        method: 'POST',
        body: { ...taskData, boardId: selectedBoard.id },
      });
      setTasks([...tasks, newTask]);
      setIsTaskDialogOpen(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await makeRequest(`/api/tasks/${taskId}`, {
        method: 'PUT',
        body: updates,
      });
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      setIsTaskDialogOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await makeRequest(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  
  const toggleTaskStatus = async (taskId: string, currentStatus: 'pending' | 'completed') => {
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;

  const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
  
  try {
    // Include required title field when updating
    await updateTask(taskId, {
      title: task.title,  // Required field
      status: newStatus
    });

    // Update local state
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  } catch (error) {
    console.error('Failed to toggle task status:', error);
  }

  // In Dashboard.tsx toggleTaskStatus
console.log('Toggling status:', { taskId, currentStatus, newStatus });
};

  


//   const toggleTaskStatus = async (
//   taskId: string,
//   currentStatus: 'pending' | 'completed'
// ) => {
//   const task = tasks.find(t => t.id === taskId);
//   if (!task) return;

//   const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

//   await updateTask(taskId, {
//     title: task.title,               // ✅ required by backend
//     description: task.description,   // keep existing
//     dueDate: task.dueDate,            // keep existing
//     status: newStatus
//   });
// };


  const openTaskDialog = (task?: Task) => {
    setEditingTask(task || null);
    setIsTaskDialogOpen(true);
  };

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen bg-[#0A0118] relative overflow-hidden">
      {/* Professional gradient overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0118] via-[#1A0B2E] to-[#0A0118]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full filter blur-[128px]" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full filter blur-[128px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[500px] bg-indigo-500/10 rounded-full filter blur-[128px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg shadow-purple-500/25">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                TaskBoards
                <Sparkles className="w-6 h-6 text-purple-300" />
              </h1>
              <p className="text-purple-200 flex items-center gap-2">
                <User className="w-4 h-4" />
                Welcome back, {user?.name}
              </p>
            </div>
          </div>
          
          <Button
            onClick={logout}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Total Boards</p>
                  <p className="text-2xl font-bold text-white">{boards.length}</p>
                </div>
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Total Tasks</p>
                  <p className="text-2xl font-bold text-white">{totalTasks}</p>
                </div>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-300">{completedTasks}</p>
                </div>
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-300">{pendingTasks}</p>
                </div>
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Boards</CardTitle>
                  <Button
                    onClick={() => setIsCreateBoardOpen(true)}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {boards.map((board) => (
                  <div
                    key={board.id}
                    onClick={() => setSelectedBoard(board)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedBoard?.id === board.id
                        ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-400/30 shadow-lg'
                        : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium truncate">{board.name}</p>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBoard(board.id);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-300 hover:text-red-200 hover:bg-red-500/20 h-auto p-1"
                      >
                        ×
                      </Button>
                    </div>
                    <p className="text-purple-200 text-xs">
                      {tasks.filter(task => task.boardId === board.id).length} tasks
                    </p>
                  </div>
                ))}
                
                {boards.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-purple-200 mb-4">No boards yet</p>
                    <Button
                      onClick={() => setIsCreateBoardOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create your first board
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedBoard ? (
              <TaskBoardCard
                board={selectedBoard}
                tasks={tasks.filter(task => task.boardId === selectedBoard.id)}
                onCreateTask={() => openTaskDialog()}
                onEditTask={openTaskDialog}
                onDeleteTask={deleteTask}
                onToggleStatus={toggleTaskStatus}
                isLoading={isLoading}
              />
            ) : (
              <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
                <CardContent className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                    <p className="text-white text-xl mb-2">Get Started</p>
                    <p className="text-purple-200 mb-6">Create a board to organize your tasks</p>
                    <Button
                      onClick={() => setIsCreateBoardOpen(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/25"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Board
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateBoardDialog
        isOpen={isCreateBoardOpen}
        onClose={() => setIsCreateBoardOpen(false)}
        onCreate={createBoard}
      />

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? (updates) => updateTask(editingTask.id, updates) : createTask}
        task={editingTask}
      />
    </div>
  );
}