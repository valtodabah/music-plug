import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from 'next/server';

export async function PUT(req) {
    try {
        const { id, status } = await req.json();

        if (!id) {
            return NextResponse.json({ message: 'Project ID is missing from the request' }, { status: 400 });
        }

        await connectToDatabase();

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedProject) {
            return NextResponse.json({ message: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json(updatedProject, { status: 200 });
    } catch(error) {
        console.error('Error updating project: ', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}