"use client";

import * as Popover from "@radix-ui/react-popover";
import { useUser } from "@liveblocks/react";
import { useState } from "react";
import { Avatar } from "./avatars";
import { useAllUserIds } from "./use-all-user-ids";
import { useSessionUser } from "./session-user";

/**
 * Chooses which user this browser is connected as. Changing it re-authenticates
 * and reconnects, so comments and notifications come from the chosen person.
 */
export default function UserPicker() {
  const { userId, setUserId } = useSessionUser();
  const userIds = useAllUserIds();
  const [isOpen, setOpen] = useState(false);

  const select = (nextUserId: string | null) => {
    setUserId(nextUserId);
    setOpen(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setOpen}>
      <Popover.Trigger className="inline-flex items-center gap-2 whitespace-nowrap rounded-md pl-1 pr-2 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground">
        <SessionUserLabel userId={userId} />
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="m2.5 4 2.5 2.5L7.5 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="end"
          sideOffset={4}
          className="rounded-xl border border-border bg-card text-card-foreground shadow text-sm overflow-hidden w-[260px] z-20"
        >
          <div className="px-3 py-2 border-b border-border bg-muted/50 text-xs text-muted-foreground">
            Connect as
          </div>

          <div className="max-h-[320px] overflow-auto p-1">
            {userIds.map((id) => (
              <UserOption
                key={id}
                userId={id}
                isSelected={id === userId}
                onSelect={() => select(id)}
              />
            ))}
          </div>

          <div className="border-t border-border p-1">
            <button
              className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => select(null)}
            >
              <span className="flex items-center justify-center w-8 h-8 shrink-0 rounded-full border border-dashed border-border text-xs">
                ?
              </span>
              Random user
              {userId === null && <Check />}
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function SessionUserLabel({ userId }: { userId: string | null }) {
  if (userId === null) {
    return (
      <>
        <span className="flex items-center justify-center w-7 h-7 shrink-0 rounded-full border border-dashed border-border text-xs text-muted-foreground">
          ?
        </span>
        <span className="text-muted-foreground">Random user</span>
      </>
    );
  }

  return <ResolvedUserLabel userId={userId} />;
}

function ResolvedUserLabel({ userId }: { userId: string }) {
  const { user } = useUser(userId);

  return (
    <>
      <img
        alt=""
        src={user?.avatar}
        className="w-7 h-7 shrink-0 rounded-full object-cover bg-muted"
      />
      {user?.name ?? userId}
    </>
  );
}

function UserOption({
  userId,
  isSelected,
  onSelect,
}: {
  userId: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { user } = useUser(userId);

  return (
    <button
      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground"
      onClick={onSelect}
      aria-pressed={isSelected}
    >
      <Avatar name={user?.name ?? userId} picture={user?.avatar} />
      <span className="truncate">{user?.name ?? userId}</span>
      {isSelected && <Check />}
    </button>
  );
}

function Check() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="ml-auto shrink-0"
    >
      <path
        d="M3 7.5 5.5 10 11 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
