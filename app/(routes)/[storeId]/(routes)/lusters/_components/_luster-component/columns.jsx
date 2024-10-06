"use client";

import CellActions from "@/components/table/cell-actions";
import CellLinks from "@/components/table/cell-links";

export const columns = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <CellLinks
        dataId={row.original.id}
        dataLabel={row.getValue("type")}
        paramsName={'lusters'}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => row.getValue("createdAt"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellActions
        dataId={row.original.id}
        paramsName="lusters"
        toastName="luster"
        copyBoolean={true}
      />
    ),
  },
];
