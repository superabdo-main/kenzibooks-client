// types/next-auth.d.ts
import { Organization } from "@/stores/organizations.store"
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    error?: string
  }

  interface User extends DefaultUser {
    uuid?: string
    phone?: string
    username?: string
    accessToken?: string
    ownedOrganizations?: Organization[]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string
    error?: string
  }
}