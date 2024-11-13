import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from 'next/server';
import mongoose, { connect } from 'mongoose';

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

export async function PUT(req) {
    try {
        const { id, name, description, tags } = await req.json();

        if (!id) {
            return NextResponse.json({ message: 'Project ID is missing from the request' }, { status: 400 });
        }

        await connectToDatabase();

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { name, description, tags: tags.split(',').map(tag => tag.trim()) },
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

export async function DELETE(req) {
    try {
        const url = new URL(req.url);
        const projectId = url.searchParams.get('id');

        if (!projectId) {
            return NextResponse.json({ message: 'Project ID is missing from the request' }, { status: 400 });
        }

        await connectToDatabase();

        await Project.findByIdAndDelete(projectId);

        return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting project: ', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}