"use client";

import { useUser } from "@liveblocks/react";
import { useAllUserIds } from "./use-all-user-ids";
import { useSessionUser } from "./session-user";

/**
 * Avatar stack that does NOT require a RoomProvider.
 *
 * Room presence hooks (`useOthers`, `useSelf`) only exist inside a room, so
 * this component takes the user ids to display and resolves their info with
 * `useUser`, which is served by `LiveblocksProvider`'s `resolveUsers`.
 */
export function Avatars({
  userIds,
  maxShown = 5,
  highlightedUserId,
}: {
  userIds: string[];
  maxShown?: number;
  /** Drawn with a solid ring, e.g. the user you're connected as */
  highlightedUserId?: string | null;
}) {
  const shown = userIds.slice(0, maxShown);
  const hidden = userIds.length - shown.length;

  return (
    <div className="flex items-center pl-2">
      {shown.map((userId) => (
        <div key={userId} className="group relative -ml-2">
          <UserAvatar
            userId={userId}
            isHighlighted={userId === highlightedUserId}
          />
          <Tooltip>
            <UserName userId={userId} />
          </Tooltip>
        </div>
      ))}

      {hidden > 0 && (
        <div className="group relative -ml-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-xs font-medium ring-2 ring-background">
            +{hidden}
          </div>
          <Tooltip>{hidden} more</Tooltip>
        </div>
      )}
    </div>
  );
}

/**
 * Avatars for everyone with access to the document, fetched from the mock
 * database. Unlike a presence-based stack, this does not need a room.
 */
export function MemberAvatars({ maxShown }: { maxShown?: number }) {
  const userIds = useAllUserIds();
  const { userId } = useSessionUser();

  return (
    <Avatars userIds={userIds} maxShown={maxShown} highlightedUserId={userId} />
  );
}

/**
 * Resolves a single user id, so `useUser` is called once per component
 * instead of inside a loop.
 */
function UserAvatar({
  userId,
  isHighlighted,
}: {
  userId: string;
  isHighlighted?: boolean;
}) {
  const { user, isLoading } = useUser(userId);

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse ring-2 ring-background" />
    );
  }

  return (
    <Avatar
      name={user?.name ?? userId}
      picture={user?.avatar}
      isHighlighted={isHighlighted}
    />
  );
}

function UserName({ userId }: { userId: string }) {
  const { user } = useUser(userId);
  return <>{user?.name ?? userId}</>;
}

export function Avatar({
  name,
  picture,
  isHighlighted,
}: {
  name: string;
  picture?: string;
  isHighlighted?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center w-8 h-8 rounded-full bg-muted ring-2 ${
        isHighlighted ? "ring-primary" : "ring-background"
      }`}
      title={name}
    >
      {picture ? (
        <img
          alt={name}
          src={picture}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="text-xs font-medium text-muted-foreground">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute top-full left-1/2 z-10 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs text-card-foreground opacity-0 shadow transition-opacity group-hover:opacity-100">
      {children}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
