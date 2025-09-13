import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB" } })
      .middleware(async ({ req }) => {
        console.log("[UploadThing] Middleware appelé pour imageUploader");
        console.log("Headers:", req.headers);
        try {
          const session = await auth();
          console.log("[UploadThing] Session:", session);
          const user = session?.user;
          if (!user) {
            console.log("[UploadThing] Pas d'utilisateur, Unauthorized");
            throw new Error("Unauthorized");
          }
          console.log("[UploadThing] Utilisateur authentifié:", user.id);
          return { userId: user.id };
        } catch (err) {
          console.log("[UploadThing] Erreur middleware:", err);
          throw err;
        }
      })
      .onUploadComplete(async ({ metadata, file }) => {
        console.log("[UploadThing] onUploadComplete appelé");
        console.log("[UploadThing] metadata:", metadata);
        console.log("[UploadThing] file:", file);
        console.log("Upload complete for userId:", metadata.userId);
        console.log("file url", file.url);
        return { uploadedBy: metadata.userId };
      }),

  reelUploader: f({ video: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
      console.log("[UploadThing] Middleware appelé pour reelUploader");
      console.log("Headers:", req.headers);
      try {
        const session = await auth();
        console.log("[UploadThing] Session:", session);
        const user = session?.user;
        if (!user) {
          console.log("[UploadThing] Pas d'utilisateur, Unauthorized");
          throw new Error("Unauthorized");
        }
        console.log("[UploadThing] Utilisateur authentifié:", user.id);
        // On peut ajouter la caption via req.body si besoin
        return { userId: user.id };
      } catch (err) {
        console.log("[UploadThing] Erreur middleware:", err);
        throw err;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] onUploadComplete appelé pour reelUploader");
      console.log("[UploadThing] metadata:", metadata);
      console.log("[UploadThing] file:", file);
      // Crée le post de type REEL dans la base
      try {
        const { userId } = metadata;
        // On suppose que la caption peut être passée via metadata ou à compléter
        const caption = ""; // À adapter si besoin
        const { PrismaClient } = require("@prisma/client");
        const prisma = new PrismaClient();
        await prisma.post.create({
          data: {
            userId,
            fileUrl: file.url,
            caption,
            type: "REEL",
          },
        });
        console.log("[UploadThing] Post REEL créé dans la base");
        return { uploadedBy: userId, reelUrl: file.url };
      } catch (err) {
        console.error("[UploadThing] Erreur création reel:", err);
        throw err;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
