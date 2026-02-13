import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/pages/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface CalendarViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const CalendarView = ({ tasks, onEditTask }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get tasks for selected date
  const tasksForDate = selectedDate
    ? tasks.filter((task) => {
        if (!task.due_date) return false;
        const taskDate = new Date(task.due_date);
        return (
          taskDate.getDate() === selectedDate.getDate() &&
          taskDate.getMonth() === selectedDate.getMonth() &&
          taskDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  // Get dates that have tasks
  const datesWithTasks = tasks
    .filter((task) => task.due_date)
    .map((task) => new Date(task.due_date!));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 text-success border-success/20";
      case "in-progress":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[350px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            modifiers={{
              hasTask: datesWithTasks,
            }}
            modifiersStyles={{
              hasTask: {
                fontWeight: "bold",
                textDecoration: "underline",
                color: "hsl(var(--primary))",
              },
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate
              ? `Tasks for ${format(selectedDate, "MMMM d, yyyy")}`
              : "Select a date"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksForDate.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No tasks scheduled for this date
            </p>
          ) : (
            <div className="space-y-3">
              {tasksForDate.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onEditTask(task)}
                  className="p-4 rounded-lg border border-border bg-card hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium mb-1 truncate">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getStatusColor(task.status)} variant="outline">
                          {task.status}
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {task.tags && task.tags.length > 0 && (
                          <>
                            {task.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
