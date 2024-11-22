import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
    const { projectId } = params;
    const { userId, skill, message } = await req.json();

    if (!userId || !skill || !message) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        const project = await Project.findById(projectId);

        if (!project) {
            return NextResponse.json(
                { error: "Project not found" },
                { status: 404 }
            );
        }

        project.applicants.push({
            user: userId,
            skill,
            message,
        });

        await project.save();

        return NextResponse.json(
            { message: "Application submitted successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error applying to project: ", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}