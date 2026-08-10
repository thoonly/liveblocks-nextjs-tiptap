"use client";

import { useEffect } from "react";
import { useRoomSubscriptionSettings } from "@liveblocks/react/suspense";

/**
 * Subscribes the current user to every thread in the room, so they get
 * notified about all new threads and replies instead of only the ones they
 * take part in. Runs once per room/user, and does nothing if the user is
 * already subscribed to everything.
 */
export function useAutoSubscribeThreads() {
  const [{ settings }, updateSettings] = useRoomSubscriptionSettings();

  useEffect(() => {
    if (settings.threads !== "all") {
      updateSettings({ threads: "all" });
    }
  }, [settings.threads, updateSettings]);
}
