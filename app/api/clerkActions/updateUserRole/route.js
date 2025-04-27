import { auth, clerkClient } from '@clerk/nextjs/server'

export async function POST(req) {
    const { userId } = auth();
    
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const adminUser = await clerkClient.users.getUser(userId);
    
    if (adminUser.publicMetadata.role !== "admin") {
        return new Response("Forbidden", { status: 403 });
    }

    try {
        const { userId: targetUserId, newRole } = await req.json();

        // Prevent the admin user from changing their own role
        if (targetUserId === userId) {
            return new Response("Forbidden", { status: 403 });
        }

        // Update the user's role
        await clerkClient.users.updateUser(targetUserId, {
            publicMetadata: { role: newRole },
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Failed to update user role:', error);
        return new Response(JSON.stringify({ error: 'Failed to update user role' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}