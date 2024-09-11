import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function PATCH(request,{params}) {
    try {

        const { userId } = auth(); // Correctly call the auth function
        
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const body = await request.json();
        const { name, billboardId } = body;

        if (!name || !billboardId) {
          return new NextResponse("Missing required fields", { status: 400 });
        }

        if(!params.categoryId) {
            return new NextResponse("category is required", { status: 400 });
        }

        const { categoryId } = params;

        const category = await prisma.category.updateMany({
            where: {
                id: categoryId,
            },
            
            data: {
               name,
               billboardId
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('[categories_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(request,{params}) {
    try {
        const { userId } = auth(); // Correctly call the auth function

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!params.categoryId) {
            return new NextResponse("category is required", { status: 400 });
        }

        const { categoryId } = params;

        const category = await prisma.category.delete({
            where: {
                id: categoryId,
            },
        });

        return NextResponse.json(category);
    } catch (error) {
        console.error('[category_DELETE]', error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(request,{params}) {
    try {
        if(!params.categoryId) {
            return new NextResponse("category is required", { status: 400 });
        }

        const { categoryId } = params;

        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            },
            include: {
                billboard: true
            }
        });

        return NextResponse.json(category);
    } catch (error) {
         console.error('[category_GET]', error)
        return new NextResponse("Internal Error", { status: 500 });
    }
}

