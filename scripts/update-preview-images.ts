import prisma from "../lib/prisma";

async function main() {
  await prisma.post.updateMany({
    where: { fileUrl: "/public/test1.jpg" },
    data: { fileUrl: "/previewtest1.png" }
  });
  await prisma.post.updateMany({
    where: { fileUrl: "/public/test2.jpg" },
    data: { fileUrl: "/previewtest2.png" }
  });
  await prisma.post.updateMany({
    where: { fileUrl: "/public/test3.jpg" },
    data: { fileUrl: "/previewtest3.png" }
  });
  await prisma.post.updateMany({
    where: { fileUrl: "/public/test4.jpg" },
    data: { fileUrl: "/previewtest4.png" }
  });
  console.log("Mise à jour des images de preview terminée.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
