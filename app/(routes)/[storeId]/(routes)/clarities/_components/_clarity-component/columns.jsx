"use client";

import CellActions from "@/components/table/cell-actions";
import CellLinks from "@/components/table/cell-links";

export const columns = [
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <CellLinks
        dataId={row.original.id}
        dataLabel={row.getValue("grade")}
        paramsName={'clarities'}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => row.getValue("createdAt"),
  },
  {
    accessorKey: "updatedAt",
    header: "Date Updated",
    cell: ({ row }) => row.getValue("updatedAt"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellActions
        dataId={row.original.id}
        paramsName="clarities"
        toastName="clarity"
        copyBoolean={true}
      />
    ),
  },
];
