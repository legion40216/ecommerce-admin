import React from 'react'
import { Badge } from "@/components/ui/badge"
import CellActions from './cell-actions';
import CellRoleSwitch from './cell-rollswitch';

export const columns = [
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "firstName",
        header: "First Name",
    },
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <Badge variant={status === 'Approved' ? 'success' : 'warning'}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const currentRole = row.original.role;
            return (
                currentRole &&
                <Badge variant='secondary'>
                    {currentRole}
                </Badge>
            )
        },
    },
    {
        id: "switch",
        cell: ({ row }) => {
            const currentRole = row.original.role;
            return (
                <CellRoleSwitch 
                    dataId={row.original.id} 
                    currentRole={currentRole} 
                />
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <CellActions dataId={row.original.id} />,
    },
];