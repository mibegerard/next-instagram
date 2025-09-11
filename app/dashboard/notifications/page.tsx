import prisma from "@/lib/prisma"; // Instance Prisma pour interagir avec la base de données
import { getUserId } from "@/lib/utils"; // Fonction utilitaire pour récupérer l'ID de l'utilisateur connecté
import NotificationsList from "@/app/dashboard/notifications/NotificationsList"; // Composant client affichant la liste des notifications

// Page principale des notifications
export default async function NotificationsPage() {
  // 1️⃣ Récupération de l'utilisateur connecté
  const userId = await getUserId();

  // Si l'utilisateur n'est pas connecté, afficher un message
  if (!userId) {
    return (
      <main className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <p className="text-gray-400">
          Vous devez être connecté pour voir vos notifications.
        </p>
      </main>
    );
  }

  // 2️⃣ Requête vers la base de données : récupérer les notifications de l'utilisateur
  const notifications = await prisma.notification.findMany({
    where: {
      userId,              // Notifications destinées à l'utilisateur connecté
      fromId: { not: userId }, // Exclure les notifications générées par lui-même
    },
    include: {
      from: true, // Inclure les informations de l'utilisateur qui a généré la notification
      post: true, // Inclure les informations du post associé si existant
    },
    orderBy: {
      createdAt: "desc", // Trier par date de création décroissante (les plus récentes en premier)
    },
    take: 20, // Limiter à 20 notifications pour l'affichage
  });

  // 3️⃣ Affichage côté UI via le composant client NotificationsList
  // On transmet les notifications récupérées en prop initialNotifications
  return <NotificationsList initialNotifications={notifications} />;
}
