import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Connect to the database
        await connectToDatabase();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser)
        {
            return NextResponse.json({ error: 'User not found' }, { status: 400 });
        }

        // Compare passwords
        const match = await bcrypt.compare(password, existingUser.password);
        if (!match)
        {
            return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
        }

        // Return successful response
        return NextResponse.json( { message: 'Sign in successful' }, { status: 200 });

    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}