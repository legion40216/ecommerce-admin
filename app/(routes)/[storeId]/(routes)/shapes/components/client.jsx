"use client";
import React from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { DataTable } from '@/components/table/data-table';
import ApiList from '@/components/custom-ui/api-list';
import { columns } from './client/columns';
import { Button } from '@/components/ui/button';
import Headings from '@/components/custom-ui/headings';
import { Separator } from '@/components/ui/separator';

export default function ShapeClient({ data }) {
  const router = useRouter();

  return (
    <div className="space-y-3">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <Headings
          title={`Shapes (${data.length})`}
          description={"Manage shapes of your store"}
        />
        <Button onClick={() => { router.push(`shapes/new`) }}>
          <Plus className='h-4 w-4 mr-1' />
          Add new
        </Button>
      </div>

      <Separator />

      {/* Data Table */}
      <DataTable
        searchKey={"name"}
        columns={columns}
        data={data}
      />

      {/* API Section */}
      <Headings
        title={`API`}
        description={"API call for shapes"}
      />

      <Separator />

      <ApiList
        entryIdName={'shapeId'}
        entryName={'shapes'}
      />
    </div>
  );
}
