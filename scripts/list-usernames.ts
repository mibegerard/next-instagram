import prisma from "../lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, name: true, email: true }
  });
  if (users.length === 0) {
    console.log("Aucun utilisateur trouvé.");
    return;
  }
  console.log("Utilisateurs en base :");
  users.forEach(u => {
    console.log(`- id: ${u.id}, username: ${u.username}, name: ${u.name}, email: ${u.email}`);
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
