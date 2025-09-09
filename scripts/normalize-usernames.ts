import prisma from "../lib/prisma";

function normalizeUsername(username: string) {
  return username
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .replace(/[^a-zA-Z0-9_]/g, "")
    .toLowerCase();
}

async function main() {
  const users = await prisma.user.findMany();
  for (const user of users) {
    const normalized = normalizeUsername(user.username || "");
    if (user.username !== normalized && normalized) {
      await prisma.user.update({
        where: { id: user.id },
        data: { username: normalized },
      });
      console.log(`Username corrigé : ${user.username} → ${normalized}`);
    }
  }
  console.log("Tous les usernames ont été normalisés.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
