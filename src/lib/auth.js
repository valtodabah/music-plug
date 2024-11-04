import NextAuth from 'next-auth';
import CredentialProviders from 'next-auth/providers/credentials';
import { connectToDatabase, clientPromise } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

export const authOptions = {
    providers:
    [
        CredentialProviders({
            name: 'Credentials',
            credentials:
            {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials)
            {
                await connectToDatabase();
                const user = await User.findOne({ email: credentials.email });

                if (!user)
                {
                    throw new Error('User not found');
                }

                if (!await bcrypt.compare(credentials.password, user.password))
                {
                    throw new Error('Invalid password');
                }

                return { id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    bio: user.bio,
                    skills: user.skills,
                    portfolio: user.portfolio,
                    profilePicture: user.profilePicture,
                    socialMedia: user.socialMedia
                };
                
            }
        })
    ],
    adapter: MongoDBAdapter(clientPromise, { databaseName: 'artisthub' }),
    session:
    {
        strategy: 'jwt',
    },
    jwt:
    {
        secret: process.env.NEXTAUTH_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages:
    {
        signIn: '/auth/signin',
        error: '/auth/error', // Error code passed in query string as ?error=
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                console.log("User ID: ", user.id);
                token.name = user.name;
                token.email = user.email;
                token.bio = user.bio;
                token.skills = user.skills || [];
                token.portfolio = user.portfolio || [];
                token.profilePicture = user.profilePicture;
                token.socialMedia = user.socialMedia || [];
            }
            return token;
        },
        async session({ session, token }) {
            // Directly attach the user data from JWT token to session object
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.bio = token.bio;
            session.user.skills = token.skills;
            session.user.portfolio = token.portfolio;
            session.user.profilePicture = token.profilePicture;
            session.user.socialMedia = token.socialMedia;

            console.log("Session user ID: ", session.user.id);

            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development',
}