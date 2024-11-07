import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const userId = url.searchParams.get('id');

        const user = await User.findById(userId);

        if (!user || !userId) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        console.log('User found: ', user);

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(req) {
    const session = await getServerSession({ req, authOptions });
    if (!session)
    {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const { id, ...updates } = await req.json();

        await connectToDatabase();

        const user = await User.findByIdAndUpdate(id, {$set: {
                ...updates,
            }}, { new: true });
        console.log('User found: ', id);

        if (!user)
        {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}