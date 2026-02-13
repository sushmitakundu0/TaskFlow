import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { TaskDialog } from "@/components/TaskDialog";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { TaskExport } from "@/components/TaskExport";
import { useTaskReminders } from "@/hooks/useTaskReminders";
import { CalendarView } from "@/components/CalendarView";
import { DroppableColumn } from "@/components/DroppableColumn";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskCard } from "@/components/TaskCard";
import { Card } from "@/components/ui/card";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: "pending" | "in-progress" | "completed";
  priority: string;
  due_date: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"board" | "calendar">("board");
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useTaskReminders(tasks);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  useEffect(() => {
    // Filter tasks based on search query and filters
    let filtered = tasks;

    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.status.toLowerCase().includes(query) ||
          task.priority.toLowerCase().includes(query) ||
          task.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [searchQuery, tasks, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks((data || []) as Task[]);
      setFilteredTasks((data || []) as Task[]);
    } catch (error: any) {
      toast.error("Failed to load tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw error;
      
      toast.success("Task deleted successfully");
      fetchTasks();
    } catch (error: any) {
      toast.error("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask) {
        const { error } = await supabase
          .from("tasks")
          .update(taskData)
          .eq("id", editingTask.id);

        if (error) throw error;
        toast.success("Task updated successfully");
      } else {
        if (!user?.id) {
          toast.error("User not authenticated");
          return;
        }

        const { error } = await supabase.from("tasks").insert({
          title: taskData.title!,
          description: taskData.description || null,
          status: taskData.status || "pending",
          priority: taskData.priority || "medium",
          due_date: taskData.due_date || null,
          tags: taskData.tags || [],
          user_id: user.id,
        });

        if (error) throw error;
        toast.success("Task created successfully");
      }

      fetchTasks();
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to save task");
      console.error("Error saving task:", error);
    }
  };

  const groupTasksByStatus = () => {
    const grouped: Record<string, Task[]> = {
      pending: [],
      "in-progress": [],
      completed: [],
    };

    filteredTasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    return grouped;
  };

  const groupedTasks = groupTasksByStatus();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Check if we're over a column
    const overId = over.id as string;
    const isOverColumn = ["pending", "in-progress", "completed"].includes(overId);
    
    if (isOverColumn && activeTask.status !== overId) {
      handleStatusChange(activeTask.id, overId as Task["status"]);
      return;
    }

    // Check if we're over another task - get its column
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask && activeTask.status !== overTask.status) {
      handleStatusChange(activeTask.id, overTask.status);
    }
  };

  const handleDragEnd = () => {
    setActiveId(null);
  };

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId);

      if (error) throw error;
      fetchTasks();
    } catch (error: any) {
      toast.error("Failed to update task status");
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <TaskExport tasks={filteredTasks} />
              <Button onClick={handleCreateTask}>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs for Board and Calendar Views */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "board" | "calendar")}>
          <TabsList className="mb-6">
            <TabsTrigger value="board">Board View</TabsTrigger>
            <TabsTrigger value="calendar">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="board">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading tasks...</div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <div className="grid gap-6 md:grid-cols-3">
                  {Object.entries(groupedTasks).map(([status, statusTasks]) => (
                    <DroppableColumn
                      key={status}
                      status={status}
                      tasks={statusTasks}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
                <DragOverlay>
                  {activeId ? (
                    <TaskCard
                      task={tasks.find((t) => t.id === activeId)!}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </TabsContent>

          <TabsContent value="calendar">
            {loading ? (
              <div className="text-center text-muted-foreground">Loading tasks...</div>
            ) : (
              <CalendarView tasks={filteredTasks} onEditTask={handleEditTask} />
            )}
          </TabsContent>
        </Tabs>
      </main>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Dashboard;
