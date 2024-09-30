import { getServerSession } from 'next-auth';
import multer from 'multer';
import cloudinary from '@/lib/cloudinary';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

const upload = multer({ storage: multer.memoryStorage() });

export async function POST(req) {
    try {
        // Get the user session
        const session = await getServerSession({ req, authOptions });

        if (!session)
        {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const file = await req.json();
        const userId = session.user.id;

        console.log("Received file: ", file);
        console.log("Received userId: ", userId);

        const uploadResponse = await cloudinary.uploader.upload(file.file, {
            folder: 'profile_pictures',
        });

        console.log("Cloudinary upload response: ", uploadResponse);

        await connectToDatabase();

        const user = await User.findById(userId);

        if (!user) {
            console.error('User not found');
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        user.profilePicture = uploadResponse.secure_url;
        await user.save();

        return NextResponse.json({ imageUrl: uploadResponse.secure_url }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
};