// Import de l'adaptateur Prisma pour NextAuth
import { PrismaAdapter } from "@auth/prisma-adapter";
// Import de l'instance Prisma pour interagir avec la base de données
import prisma from "@/lib/prisma";

// Import des providers pour NextAuth
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Import pour le hashage des mots de passe
import bcrypt from "bcryptjs";

// Import de NextAuth et types nécessaires
import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

// Configuration principale de NextAuth
export const config = {
  // Redirection vers la page de connexion personnalisée
  pages: {
    signIn: "/login",
  },

  // Adaptateur Prisma pour stocker les utilisateurs et sessions dans la base de données
  adapter: PrismaAdapter(prisma),

  // Définition des providers d'authentification
  providers: [
    // Auth via Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Auth via Email + mot de passe
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },

      // Fonction d'autorisation pour vérifier les credentials
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // Recherche de l'utilisateur dans la base
        const user = await prisma.user.findUnique({ where: { email } });

        // Si l'utilisateur existe et a un mot de passe, on vérifie le hash
        if (user && user.password) {
          const isValid = await bcrypt.compare(password, user.password);
          if (isValid) {
            return {
              id: user.id,
              name: user.name ?? user.email,
              email: user.email,
              image: user.image ?? undefined,
              username: user.username ?? user.email.split("@")[0],
            };
          }
        }

        // Si l'utilisateur n'existe pas, on le crée automatiquement
        if (!user) {
          const hashed = await bcrypt.hash(password, 10); // Hash du mot de passe
          const newUser = await prisma.user.create({
            data: {
              email,
              password: hashed,
              name: email.split("@")[0],
              username: email.split("@")[0],
              image: "/alt.jpeg",
              bio: "",
              website: "",
            },
          });

          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            image: newUser.image,
            username: newUser.username,
          };
        }

        // Retourne null si authentification échoue
        return null;
      },
    }),
  ],

  // Stratégie de session basée sur JWT
  session: {
    strategy: "jwt",
  },

  // Callbacks pour manipuler les sessions et JWT
  callbacks: {
    // Callback session : ajout des informations utilisateur dans la session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }
      return session;
    },

    // Callback JWT : mise à jour du token avec les infos de la base
    async jwt({ token, user }) {
      // Recherche de l'utilisateur dans la base
      const prismaUser = await prisma.user.findFirst({
        where: { email: token.email },
      });

      // Si pas trouvé, on renvoie le token de l'utilisateur courant
      if (!prismaUser) {
        token.id = user.id;
        return token;
      }

      // Si l'utilisateur n'a pas de username, on le met à jour automatiquement
      if (!prismaUser.username) {
        await prisma.user.update({
          where: { id: prismaUser.id },
          data: { username: prismaUser.name?.split(" ").join("").toLowerCase() },
        });
      }

      // Retourne les informations nécessaires dans le token
      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        username: prismaUser.username,
        picture: prismaUser.image,
      };
    },
  },
} satisfies NextAuthOptions;

// Export de la configuration NextAuth
export default NextAuth(config);

// Fonction utilitaire pour utiliser l'authentification côté serveur
export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}
