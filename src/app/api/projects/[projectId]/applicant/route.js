import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import mongoose from "mongoose";
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
    const { projectId } = params;
    const { applicantId, skill, action } = await req.json();

    if (!applicantId || !skill || !action || !projectId) {
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

        const applicant = project.applicants.find(
            (app) => app.user.toString() === applicantId && app.skill === skill
        );

        if (action === "accept") {
            project.collaborators.push({
                user: mongoose.Types.ObjectId.createFromHexString(applicantId), // Ensure valid ObjectId using createFromHexString
                skill,
            });
        }

        // Remove applicant from project
        project.applicants = project.applicants.filter(
            (app) => app.user.toString() !== applicantId || app.skill !== skill
        );

        await project.save();

        return NextResponse.json(
            project,
            { status: 200 }
        );
    } catch (error) {
        console.error("Error applying to project: ", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}