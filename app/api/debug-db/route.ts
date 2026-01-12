import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        const client = await clientPromise;
        const nativeDb = client.db();

        let mongooseState = "Not Connected";
        let mongooseDbName = "Unknown";

        try {
            await dbConnect();
            mongooseState = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
            mongooseDbName = mongoose.connection.db ? mongoose.connection.db.databaseName : "Unknown";
        } catch (e) {
            mongooseState = "Error: " + String(e);
        }

        const debugInfo: any = {
            nativeDbName: nativeDb.databaseName,
            mongooseState,
            mongooseDbName,
            match: nativeDb.databaseName === mongooseDbName
        };

        if (email) {
            const user = await nativeDb.collection('users').findOne({ email });
            if (user) {
                const userId = user._id.toString();
                debugInfo.user = {
                    _id: user._id,
                    _idToString: userId,
                    email: user.email
                };

                debugInfo.counts = {
                    wallets: await nativeDb.collection('wallets').countDocuments({ userId }),
                    categories: await nativeDb.collection('categories').countDocuments({ userId }),
                    transactions: await nativeDb.collection('transactions').countDocuments({ userId }),
                    cards: await nativeDb.collection('cards').countDocuments({ userId })
                };

                // Check Mongoose Query
                // We need to import models inside here to avoid compilation issues if not calling dbConnect
                /* 
                   Skip Importing Models to keep it simple. 
                   We assume if counts > 0 here, data is in DB.
                   The mismatch logic is likely Connection related.
                */
            } else {
                debugInfo.user = "Not Found";
            }
        }

        return NextResponse.json(debugInfo);
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
