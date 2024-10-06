"use client";

import { Button } from '@/components/ui/button';
import Headings from '@/components/custom-ui/headings';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';
import React from 'react';

import { DataTable } from '@/components/table/data-table';

import ApiList from '@/components/custom-ui/api-list';
import { columns } from './_cut-component/columns';

export default function CutClient({ data }) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <Headings
          title={`Cut Grades (${data.length})`}
          description={"Manage cut grades of your store"}
        />
        <Button onClick={() => { router.push(`cuts/new`) }}>
          <Plus className='h-4 w-4 mr-1' />
          Add new
        </Button>
      </div>

      <Separator />

      {/* Data Table */}
      <DataTable
        searchKey={"grade"}
        columns={columns}
        data={data}
      />

      {/* API Section */}
      <Headings
        title={`API`}
        description={"API call for cut grades"}
      />

      <Separator />

      <ApiList
        entryIdName={'cutId'}
        entryName={'cuts'}
      />
    </div>
  );
}
