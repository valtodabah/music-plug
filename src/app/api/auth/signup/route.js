import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        // Connect to the database
        await connectToDatabase();

        // Check if user exits
        const existingUser = await User.findOne({ email });
        if (existingUser)
        {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        // Return successful response
        return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}