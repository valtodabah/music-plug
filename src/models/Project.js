import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: [String], required: true }],
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    applicants: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            message: { type: String, required: true },
            status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
        }
    ],
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);