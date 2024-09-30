import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req, { params }) {
    try {
        const session = await getServerSession({ req, authOptions });

        if (!session) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { projectId } = params;
        const { message } = await req.json();

        await connectToDatabase();
        const project = await Project.findById(params.projectId);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        const applicant = {
            user: session.user.id,
            message
        };

        project.applicants.push(applicant);
        await project.save();

        return NextResponse.json({ message: "Application submitted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error applying to project: ", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}