import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const handler = NextAuth({
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
            (session.user as any).id = token.sub!;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };