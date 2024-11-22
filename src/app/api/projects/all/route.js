import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const ownerId = url.searchParams.get('owner');

        console.log('Owner ID: ', ownerId);

        if (!ownerId) {
            return NextResponse.json({ message: 'User ID is missing from the request' }, { status: 400 });
        }

        const projects = await Project.find({ owner: { $ne: ownerId }, status: 'open' })
            .populate('applicants.user', 'name email')
            .lean();
    
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error('Error fetching projects: ', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}