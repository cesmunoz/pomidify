import NextAuth, { DefaultSession } from "next-auth";

export type UserSession = {
  address: string;
  token?: {
    accessToken: string;
  };
} & DefaultSession["user"];

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: UserSession;
  }
}
