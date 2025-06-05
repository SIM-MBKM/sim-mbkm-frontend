import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Evaluation } from "@/lib/api/services/monev-service";

export const evaluationColumns: ColumnDef<Evaluation>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "mahasiswa_id",
    header: "Mahasiswa ID",
  },
  {
    accessorKey: "dosen_pemonev_id",
    header: "Dosen Pemonev ID",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge
          className={
            status === "completed"
              ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
              : status === "in_progress"
              ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50"
              : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50"
          }
        >
          {status === "completed"
            ? "Completed"
            : status === "in_progress"
            ? "In Progress"
            : "Pending"}
        </Badge>
      );
    },
  },
];
