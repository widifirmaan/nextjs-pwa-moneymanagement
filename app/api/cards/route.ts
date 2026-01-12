import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/lib/db';

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        console.log(`[API/CARDS] Fetching cards for user: ${session.user.email} (ID: ${session.user.id})`);

        const client = await clientPromise;
        const db = client.db();

        const cards = await db.collection('cards')
            .find({ userId: session.user.id })
            .toArray();

        // Convert _id to id
        const formattedCards = cards.map(c => ({
            ...c,
            id: c._id.toString(),
            _id: undefined
        }));

        return NextResponse.json(formattedCards);
    } catch (error) {
        console.error('Error fetching cards:', error);
        return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { cardName, cardHolderName, cardNumber, expiryDate, cvv, cardType, color, bankName, id } = body;

        const client = await clientPromise;
        const db = client.db();

        const newCard = {
            _id: id, // Use client-generated ID as _id for consistency or let mongo generate it. 
            // In context we generate UUID. Let's use that as _id string to keep sync easy.
            userId: session.user.id,
            cardName,
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv,
            cardType,
            color,
            bankName,
            createdAt: new Date(),
        };

        await db.collection('cards').insertOne(newCard);

        return NextResponse.json({ ...newCard, id: newCard._id, _id: undefined });
    } catch (error) {
        console.error('Error creating card:', error);
        return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
    }
}
