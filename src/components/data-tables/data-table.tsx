"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Loader2 } from "lucide-react";

interface DataTableProps {
  columns: any[];
  data: any[];
  isLoading?: boolean;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onFinalize?: (row: any) => void;
  onPublish?: (row: any) => void;
}

export function DataTable({
  columns,
  data,
  isLoading = false,
  onEdit,
  onDelete,
  onFinalize,
  onPublish,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="pl-8 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey} className="font-medium">
                  {column.header}
                </TableHead>
              ))}
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    <span className="ml-2">Loading data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={`${row.id}-${column.accessorKey}`}>
                      {column.cell
                        ? column.cell({ row })
                        : row[column.accessorKey]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-gray-50"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(row)}>
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem onClick={() => onDelete(row)}>
                            Delete
                          </DropdownMenuItem>
                        )}
                        {onFinalize && row.status !== "completed" && (
                          <DropdownMenuItem onClick={() => onFinalize(row)}>
                            Finalize
                          </DropdownMenuItem>
                        )}
                        {onPublish && !row.is_published && (
                          <DropdownMenuItem onClick={() => onPublish(row)}>
                            Publish
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
