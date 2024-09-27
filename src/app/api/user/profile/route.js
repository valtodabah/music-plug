import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req) {
    try {
        // Get the user session
        const session = await getServerSession({ req, authOptions });
        console.log(session);

        if (!session)
        {
            return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
        }

        const userId = session.user.id;

        await connectToDatabase();
        const user = await User.findById(userId);

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

export async function PATCH(req) {
    try {
        const { id, name, email, bio, portfolio, skills, profilePicture, socialMedia } = await req.json();

        await connectToDatabase();
        const user = await User.findById(id);
        console.log('User found: ', id);

        if (!user)
        {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.portfolio = portfolio || user.portfolio;
        user.skills = skills || user.skills;
        user.profilePicture = profilePicture || user.profilePicture;
        user.socialMedia = socialMedia || user.socialMedia;

        await user.save();

        return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}