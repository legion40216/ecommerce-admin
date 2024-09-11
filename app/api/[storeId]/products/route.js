import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        const body = await request.json();
        const { name, price, isFeatured, isArchived, categoryId, colorId, sizeId, images } = body;

        if (!name || !price || !categoryId || !colorId || !sizeId || !images || !params.storeId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: images.map((image) => ({ url: image.url }))
                    }
                }
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('[PRODUCTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        if (!params.storeId) {
            return new NextResponse("Store is required", { status: 400 });
        }

        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const sizeId = searchParams.get('sizeId');
        const colorId = searchParams.get('colorId');
        const isFeatured = searchParams.get('isFeatured');
        const isArchived = searchParams.get('isArchived');

        let query = { storeId: params.storeId };

        if (categoryId) query.categoryId = categoryId;
        if (sizeId) query.sizeId = sizeId;
        if (colorId) query.colorId = colorId;
        if (isFeatured !== null) query.isFeatured = isFeatured === 'true';
        if (isArchived !== null) query.isArchived = isArchived === 'true';

        const products = await prisma.product.findMany({
            where: query,
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('[PRODUCTS_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}