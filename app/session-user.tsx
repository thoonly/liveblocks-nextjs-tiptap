"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Loading from "./loading";

const STORAGE_KEY = "liveblocks-example-user-id";

type SessionUser = {
  /** The user to authenticate as, or `null` to let the server pick at random */
  userId: string | null;
  setUserId: (userId: string | null) => void;
};

const SessionUserContext = createContext<SessionUser | null>(null);

/**
 * Remembers which user this browser is connected as, so you can act as a
 * specific person instead of the random user the auth endpoint would pick.
 */
export function SessionUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoaded, setLoaded] = useState(false);

  // Read after mount, otherwise the server and client render different users
  useEffect(() => {
    setUserId(localStorage.getItem(STORAGE_KEY));
    setLoaded(true);
  }, []);

  const changeUserId = useCallback((userId: string | null) => {
    if (userId === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, userId);
    }

    setUserId(userId);
  }, []);

  const sessionUser = useMemo(
    () => ({ userId, setUserId: changeUserId }),
    [userId, changeUserId]
  );

  // Wait for the stored user, so we don't connect as someone else first
  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <SessionUserContext.Provider value={sessionUser}>
      {children}
    </SessionUserContext.Provider>
  );
}

export function useSessionUser() {
  const sessionUser = useContext(SessionUserContext);

  if (sessionUser === null) {
    throw new Error("useSessionUser must be used within SessionUserProvider");
  }

  return sessionUser;
}
