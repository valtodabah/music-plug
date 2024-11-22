import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from 'next/server';

export async function PUT(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { status: 'open' },
            { new: true } // return the updated document
        );

        if (!updatedProject) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(updatedProject, { status: 200 });
    } catch (error) {
        console.error('Error reopening project: ', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}