"use client";

import { useEffect, useState } from "react";

/**
 * Every user ID from the mock database. Returns an empty list until loaded.
 */
export function useAllUserIds() {
  const [userIds, setUserIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/users/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Problem fetching users");
        }

        return response.json();
      })
      .then((userIds: string[]) => {
        if (!cancelled) {
          setUserIds(userIds);
        }
      })
      .catch(() => {
        // Leave the list empty if the users can't be fetched
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return userIds;
}
