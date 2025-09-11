import { followUser } from "@/lib/actions";
import SubmitButton from "./SubmitButton";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import React from "react";

function FollowButton({
  profileId,
  isFollowing,
  className,
  buttonClassName,
}: {
  profileId: string;
  isFollowing?: boolean;
  className?: string;
  buttonClassName?: string;
}) {
  const [optimisticFollowing, setOptimisticFollowing] = React.useState<boolean>(!!isFollowing);
  const [loading, setLoading] = React.useState(false);

  return (
    <form
      className={className}
      action={async () => {
        setLoading(true);
        setOptimisticFollowing((prev) => !prev);
        await followUser({ id: profileId });
        setLoading(false);
      }}
    >
      <input type="hidden" value={profileId} name="id" />
      <SubmitButton
        disabled={loading}
        className={buttonVariants({
          variant: optimisticFollowing ? "secondary" : "default",
          className: cn("!font-bold w-full", buttonClassName),
          size: "sm",
        })}
      >
        {optimisticFollowing ? "Unfollow" : "Follow"}
      </SubmitButton>
    </form>
  );
}

export default FollowButton;
