import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Task, TaskStatus, TaskPriority } from '@/lib/types';

export function useTasks() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['tasks'],
    queryFn: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []).map(t => ({
        ...t,
        status: t.status as TaskStatus,
        priority: t.priority as TaskPriority,
        tags: t.tags ?? [],
      }));
    },
  });

  const addTask = useMutation({
    mutationFn: async (task: Partial<Task>) => {
      const { error } = await supabase.from('tasks').insert({
        title: task.title!,
        description: task.description ?? null,
        status: task.status ?? 'todo',
        priority: task.priority ?? 'medium',
        tags: task.tags ?? [],
        assignee: task.assignee ?? null,
        due_date: task.due_date ?? null,
        sort_order: task.sort_order ?? 0,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { error } = await supabase.from('tasks').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return { tasks: query.data ?? [], isLoading: query.isLoading, addTask, updateTask, deleteTask };
}
