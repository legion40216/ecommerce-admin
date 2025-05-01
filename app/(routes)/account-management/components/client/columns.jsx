import React from 'react'
import { Badge } from "@/components/ui/badge"
import CellActions from './columns/cell-actions';
import CellRoleSwitch from './columns/cell-role-switch';

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
            const currentStatus = row.original.status;
            return (
                <Badge variant={currentStatus === 'Approved' ? 'success' : 'warning'}>
                    {currentStatus}
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
        cell: ({ row }) => {
            const userId = row.original.role;
            return (
            <CellActions dataId={userId} />
            );
        },
    },
];