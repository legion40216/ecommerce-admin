"use client"
import React from 'react'
import { DataTable } from '@/components/table/data-table'
import Headings from '@/components/custom-ui/headings';
import { columns } from './_account-mangement-client/columns';

export default function Client({
    users,
}) {

    return (
        <div className="space-y-5">
            <Headings
                title="Account Management"
                description="Manage user accounts, roles, and approval status"
            />
            <DataTable
                columns={columns}
                data={users}
                searchKey="email"
            />
        </div>
    )
}