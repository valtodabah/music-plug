import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Connect to the database
        await connectToDatabase();

        // Find user
        const existingUser = await User.findOne({ email });

        // Check if user exists and password matches
        if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
        }

        // Return successful response
        return NextResponse.json({ message: 'Sign in successful' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
