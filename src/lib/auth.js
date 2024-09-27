import NextAuth from 'next-auth';
import CredentialProviders from 'next-auth/providers/credentials';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export const authOptions = {
    providers:
    [
        CredentialProviders({
            name: 'Credentials',
            credentials:
            {
                email: { label: "Email", type: "email", placeholder: "frank@ocean.com" },
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

                return { id: user._id.toString(), name: user.name, email: user.email };
                
            }
        })
    ],
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
            }
            return token;
        },
        async session({ session, token }) {
            // Fetch all user data from the database
            await connectToDatabase();
            const user = await User.findById(token.id);

            // Add the user data to the session
            session.user = {
                id: token.id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                skills: user.skills || [],
                portfolio: user.portfolio || [],
                profilePicture: user.profilePicture,
                socialMedia: user.socialMedia || [],
            };

            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development',
}