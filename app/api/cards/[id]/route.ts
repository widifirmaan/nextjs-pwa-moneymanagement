import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        // Remove id/userId from body to prevent tampering keys
        const { id: _, userId: __, _id: ___, ...updateData } = body;

        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('cards').updateOne(
            { _id: id, userId: session.user.id },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating card:', error);
        return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection('cards').deleteOne({
            _id: id,
            userId: session.user.id
        });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting card:', error);
        return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
    }
}
