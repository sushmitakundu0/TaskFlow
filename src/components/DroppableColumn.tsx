import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/pages/Dashboard";
import { DraggableTaskCard } from "./DraggableTaskCard";
import { Card } from "@/components/ui/card";

interface DroppableColumnProps {
  status: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const DroppableColumn = ({
  status,
  tasks,
  onEdit,
  onDelete,
}: DroppableColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <Card ref={setNodeRef} className="p-6">
      <h2 className="mb-4 text-lg font-semibold capitalize">
        {status.replace("-", " ")}
        <span className="ml-2 text-sm text-muted-foreground">
          ({tasks.length})
        </span>
      </h2>
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4 min-h-[200px]">
          {tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {tasks.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No tasks
            </p>
          )}
        </div>
      </SortableContext>
    </Card>
  );
};
