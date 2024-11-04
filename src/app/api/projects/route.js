import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { CodeSandboxLogoIcon } from "@radix-ui/react-icons";

export async function GET(req) {
    try {
        await connectToDatabase();

        const url = new URL(req.url);
        const ownerId = url.searchParams.get('owner');

        console.log('Owner ID: ', ownerId);

        if (!ownerId) {
            return NextResponse.json({ message: 'User ID is missing from the request' }, { status: 400 });
        }

        // Fetch all projects from owner
        const projects = await Project.find({ owner: ownerId });
    
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error('Error fetching projects: ', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        /* const session = await getServerSession({ req, authOptions });

        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        console.log('Session: ', session); */

        const { owner, name, description, tags } = await req.json();

        if (!owner) {
            throw new Error('User ID is missing from the request');
        }

        await connectToDatabase();

        const newProject = new Project({
            name,
            description,
            owner,
            tags: tags.split(',').map(tag => tag.trim())
        });

        await newProject.save();
    
        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error('Error creating project: ', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}