"use client";
import { Button } from "@/components/ui/button";
import { useParams} from "next/navigation";
import Link from "next/link";
import CellActions from "./cell-actions";

export const columns = [
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => {
      const params = useParams();
      const billboardId = row.original.id;
      return (
        <Button className="font-semibold" variant="link" asChild>
          <Link href={`/${params.storeId}/billboards/${billboardId}`}>
            {row.getValue("label")}
          </Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions billboardId={row.original.id} />,
  },
];