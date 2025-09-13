"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import SubmitButton from "@/components/SubmitButton";
import { Comment } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { deleteComment } from "@/lib/actions";

type Props = {
  comment: Comment;
};

function CommentOptions({ comment }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <MoreHorizontal className="h-5 w-5 hidden group-hover:inline cursor-pointer dark:text-neutral-400" />
      </DialogTrigger>
      <DialogContent aria-describedby="dialog-desc" className="dialogContent">
        <div id="dialog-desc" className="sr-only">Options du commentaire</div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const result = await deleteComment({ id: comment.id });
            if ("error" in result) {
              toast.error(result.error);
            } else if (result.success) {
              toast.success("Commentaire supprimé avec succès");
            }
          }}
          className="postOption"
        >
          <SubmitButton className="text-red-500 font-bold disabled:cursor-not-allowed w-full p-3">
            Delete
          </SubmitButton>
        </form>

        <DialogClose className="postOption border-0 w-full p-3">
          Cancel
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default CommentOptions;
