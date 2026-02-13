import { Button } from "@/components/ui/button";
import { Download, FileText, FileJson, FileSpreadsheet } from "lucide-react";
import { Task } from "@/pages/Dashboard";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskExportProps {
  tasks: Task[];
}

export const TaskExport = ({ tasks }: TaskExportProps) => {
  const exportToCSV = () => {
    const headers = ["Title", "Description", "Status", "Priority", "Due Date", "Tags"];
    const rows = tasks.map((task) => [
      task.title,
      task.description || "",
      task.status,
      task.priority,
      task.due_date || "",
      (task.tags || []).join(", "),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tasks_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Task Report", 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

    const tableData = tasks.map((task) => [
      task.title,
      task.status,
      task.priority,
      task.due_date || "No date",
      (task.tags || []).join(", ") || "No tags",
    ]);

    autoTable(doc, {
      head: [["Title", "Status", "Priority", "Due Date", "Tags"]],
      body: tableData,
      startY: 35,
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`tasks_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(tasks, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tasks_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default">
          <Download className="mr-2 h-4 w-4" />
          Export Tasks
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          <FileJson className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
