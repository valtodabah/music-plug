import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from 'next/server';
import User from "@/models/User";

export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        // Fetch project by ID and populate collaborators
        const project = await Project.findById(params.projectId).populate("user", "name email");

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json((project), { status: 200 });
    } catch (error) {
        console.error('Error fetching project: ', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}