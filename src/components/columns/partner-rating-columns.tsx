import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { PartnerRating } from "@/lib/api/services/monev-service"
import { ColumnDef } from "@tanstack/react-table"

export const partnerRatingColumns: ColumnDef<PartnerRating>[] = [
 {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "activity_id",
    header: "Activity ID",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.original.rating || 0

      return (
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "is_anonymous",
    header: "Anonymous",
    cell: ({ row }) => {
      return row.original.is_anonymous ? "Yes" : "No"
    },
  },
  {
    accessorKey: "is_published",
    header: "Published",
    cell: ({ row }) => {
      const isPublished = row.original.is_published

      return (
        <Badge
          className={
            isPublished
              ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-50"
              : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-50"
          }
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      )
    },
  },
]
