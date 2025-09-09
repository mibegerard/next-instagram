import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const session = await auth();
      const user = session?.user;
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),

  reelUploader: f({ video: { maxFileSize: "16MB" } })
    .middleware(async ({ req }) => {
      const session = await auth();
      const user = session?.user;
      if (!user) throw new Error("Unauthorized");
      // On peut ajouter la caption via req.body si besoin
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
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
        return { uploadedBy: userId, reelUrl: file.url };
      } catch (err) {
        console.error("Erreur création reel:", err);
        throw err;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
