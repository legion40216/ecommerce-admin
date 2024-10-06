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
        paramsName={'cuts'}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => row.getValue("createdAt"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellActions
        dataId={row.original.id}
        paramsName="cuts"
        toastName="cut"
        copyBoolean={true}
      />
    ),
  },
];
