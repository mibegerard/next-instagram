import { unstable_noStore as noStore } from "next/cache";
import prisma from "./prisma";

export async function fetchUserTaggedPosts(username: string) {
  noStore();
  try {
    const data = await prisma.post.findMany({
      where: {
        taggedUsers: {
          some: {
            user: { username },
          },
        },
      },
      include: {
        comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
        likes: { include: { user: true } },
        savedBy: true,
        user: true,
        taggedUsers: {       // ici, inclure la relation PostTag
          include: {
            user: true,      // et inclure l'utilisateur tagué
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return data.map(post => ({ ...(post as any), type: (post as any).type ?? "POST" }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch tagged posts");
  }
}

export async function fetchUserReels(username: string) {
  noStore();
  try {
    const data = await prisma.post.findMany({
      where: {
        user: { username },
        type: "REEL",
      },
      include: {
        comments: { include: { user: true }, orderBy: { createdAt: "desc" } },
        likes: { include: { user: true } },
        savedBy: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return data.map(post => ({ ...(post as any), type: (post as any).type ?? "REEL" }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch reels");
  }
}

export async function fetchPosts() {
  // equivalent to doing fetch, cache: no-store
  noStore();

  try {
    const data = await prisma.post.findMany({
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // Ajout du champ type si absent
  return data.map(post => ({ ...(post as any), type: (post as any).type ?? "POST" }));

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function fetchPostById(id: string) {
  noStore();

  try {
    const data = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
    });
    if (!data) return null;
  return { ...(data as any), type: (data as any).type ?? "POST" };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch post");
  }
}

export async function fetchPostsByUsername(username: string, postId?: string) {
  noStore();

  try {
    const data = await prisma.post.findMany({
      where: {
        user: {
          username,
        },
        NOT: {
          id: postId,
        },
      },
      include: {
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
        savedBy: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  return data.map(post => ({ ...(post as any), type: (post as any).type ?? "POST" }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function fetchProfile(username: string) {
  noStore();

  try {
    console.log("fetchProfile called with username:", username);
    const data = await prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        posts: {
          orderBy: {
            createdAt: "desc",
          },
        },
        saved: {
          orderBy: {
            createdAt: "desc",
          },
        },
        followedBy: {
          include: {
            follower: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
        following: {
          include: {
            following: {
              include: {
                following: true,
                followedBy: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      console.warn("No user found for username:", username);
    }
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch profile");
  }
}

export async function fetchSavedPostsByUsername(username: string) {
  noStore();

  try {
    const data = await prisma.savedPost.findMany({
      where: {
        user: {
          username,
        },
      },
      include: {
        post: {
          include: {
            comments: {
              include: {
                user: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
            likes: {
              include: {
                user: true,
              },
            },
            savedBy: true,
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch saved posts");
  }
}
