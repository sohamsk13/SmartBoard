'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Calendar } from 'lucide-react';

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

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => Promise<void>;
  task?: Task | null;
}

export default function TaskDialog({ isOpen, onClose, onSave, task }: TaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const taskData: Partial<Task> = {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      };

      await onSave(taskData);
      
      // Reset form
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTitle('');
      setDescription('');
      setDueDate('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-[#1A0B2E]/95 border-purple-500/10 backdrop-blur-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            {task ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="text-purple-200 text-sm font-medium mb-2 block">
                Task Title <span className="text-purple-400">*</span>
              </label>
              <Input
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#2A1B3E]/60 border-purple-500/10 text-white placeholder:text-purple-300/50 
                  focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200
                  hover:bg-[#2A1B3E]/80"
                disabled={isLoading}
                autoFocus
              />
            </div>
            
            <div>
              <label className="text-purple-200 text-sm font-medium mb-2 block">
                Description
              </label>
              <Textarea
                placeholder="Add a description (optional)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-[#2A1B3E]/60 border-purple-500/10 text-white placeholder:text-purple-300/50 
                  focus:border-purple-500 focus:ring-purple-500/20 min-h-[120px] resize-none transition-all duration-200
                  hover:bg-[#2A1B3E]/80"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label className="text-purple-200 text-sm font-medium mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-[#2A1B3E]/60 border-purple-500/10 text-white 
                  focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200
                  hover:bg-[#2A1B3E]/80
                  [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert
                  [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <DialogFooter className="flex gap-2 pt-4 border-t border-purple-500/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="bg-[#2A1B3E]/60 border-purple-500/10 text-purple-200 
                hover:bg-[#2A1B3E]/80 hover:text-white transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="bg-gradient-to-r from-violet-600 to-purple-600 
                hover:from-violet-700 hover:to-purple-700 text-white 
                shadow-lg shadow-purple-500/25 transition-all duration-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{task ? 'Saving...' : 'Creating...'}</span>
                </div>
              ) : (
                <span>{task ? 'Save Changes' : 'Create Task'}</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}