import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

export default function EditProject({ params }) {
    const router = useRouter();
    const [project, setProject] = useState({
        name: '',
        description: '',
        tags: '',
    });

    useEffect(() => {
        fetchProject();
    }, []);

    const fetchProject = async () => {
        try {
            const response = await axios.get(`/api/projects/${params.id}`);
            setProject(response.data.project);
        } catch (error) {
            console.error('Error fetching project: ', error);
        }
    };

    const handleChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/projects/${params.id}`, project);
            router.push('/profile'); // Redirect back to profile page after updating
        } catch (error) {
            console.error('Error updating project: ', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
          <h1>Edit Project</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Project Name"
              value={project.name}
              onChange={handleChange}
              required
            />
            <Textarea
              name="description"
              placeholder="Project Description"
              value={project.description}
              onChange={handleChange}
              rows={4}
              required
            />
            <Input
              name="tags"
              placeholder="Tags (comma-separated)"
              value={project.tags}
              onChange={handleChange}
              required
            />
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </div>
      );
}