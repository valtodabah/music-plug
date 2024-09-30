"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ProjectPage() {
    const router = useRouter();
    const { projectId } = router.query; // Get project ID from URL
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (projectId) {
            // Fetch project details by ID
            const fetchProject = async () => {
                try {
                    const response = await axios.get(`/api/projects/${projectId}`);
                    setProject(response.data);
                } catch (err) {
                    setError(err.response.data.error);
                }
            };

            fetchProject();
        }
    }, [projectId]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!project) {
        return <p>Loading...</p>;
    }

    return (
        <div style={styles.container}>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            <p><strong>Status:</strong> {project.status === 'open' ? 'Open for collaboration' : 'Closed'}</p>
            <p><strong>Tags:</strong> {project.tags.join(', ')}</p>

            <h3>Collaborators</h3>
            {project.collaborators.length > 0 ? (
                <ul>
                    {project.collaborators.map((collaborator) => (
                        <li key={collaborator._id} style={styles.collaboratorItem}>
                            <img src={collaborator.profilePicture || '/default-profile.png'} alt="Profile" style={styles.collaboratorImage} />
                            <p>{collaborator.name}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No collaborators yet.</p>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto'
    },
    collaboratorItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px'
    },
    collaboratorImage: {
        width: '50px',
        height: '50px',
        borderRadius: '50%'
    }
};