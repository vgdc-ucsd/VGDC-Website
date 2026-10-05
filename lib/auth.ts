import { NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next"
import { getServerSession } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds.members.read",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      try {
        if (account && account.access_token) {
          const GUILD_MEMBER_URL = `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID!}/member`
          const response = await fetch(GUILD_MEMBER_URL, {
            headers: {
              "Authorization": `Bearer ${account.access_token!}`,
            }
          })
          const guild_member_info = await response.json()
          const roles = guild_member_info.roles as string[]
          if (roles.includes(process.env.DISCORD_OFFICER_ROLE_ID!)) {
            return true
          }
        }
      } catch (_) { }

      return false
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub!
      }
      return session
    },
  },
  pages: {
    signIn: "/",
    error: "/unauthorized?redirect=/"
  }
}

// Use it in server contexts
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions)
}
