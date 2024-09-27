import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";

export async function GET(req, { params }) {
    try {
        await connectToDatabase();

        // Fetch project by ID and populate collaborators
        const project = await Project.findById(params.projectId).populate("user", "name email");

        if (!project) {
            return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(project), { status: 200 });
    } catch (error) {
        console.error('Error fetching project: ', error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}