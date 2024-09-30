import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await connectToDatabase();
        const projects = await Project.find({ status: 'open' }).populate('owner');
    
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error('Error fetching projects: ', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}