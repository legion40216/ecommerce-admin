"use client";

import CellActions from "@/components/table/cell-actions";
import CellLinks from "@/components/table/cell-links";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) =>
      <CellLinks
        dataId={row.original.id}
        dataLabel={row.getValue("name")}
        paramsName={'shapes'}
      />
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => row.getValue("createdAt"),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions
      dataId={row.original.id}
      paramsName="shapes"
      toastName="shape"
      copyBoolean={true}
    />,
  },
];
