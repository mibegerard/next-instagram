"use client";

import { deletePost } from "@/lib/actions";
import { PostWithExtras } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SubmitButton from "@/components/SubmitButton";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type Props = {
  post: PostWithExtras;
  userId?: string;
  className?: string;
};

function PostOptions({ post, userId, className }: Props) {
  const isPostMine = post.userId === userId;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MoreHorizontal
          className={cn(
            "h-5 w-5 cursor-pointer dark:text-neutral-400",
            className
          )}
        />
      </DialogTrigger>
      <DialogContent aria-describedby="dialog-desc" className="dialogContent">
        <div id="dialog-desc" className="sr-only">Options du post</div>
        {isPostMine && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const result = await deletePost({ id: post.id });
              if ("error" in result) {
                toast.error(result.error);
              } else if (result.success) {
                toast.success("Post supprimé avec succès");
              }
            }}
            className="postOption"
          >
            <SubmitButton className="text-red-500 font-bold disabled:cursor-not-allowed w-full p-3">
              Delete post
            </SubmitButton>
          </form>
        )}

        {isPostMine && (
          <Link
            scroll={false}
            href={`/dashboard/p/${post.id}/edit`}
            className="postOption p-3"
          >
            Edit
          </Link>
        )}

        <form action="" className="postOption border-0">
          <button className="w-full p-3">Hide like count</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PostOptions;
