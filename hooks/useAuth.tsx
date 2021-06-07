import { Session } from 'next-auth';
import { useEffect } from 'react';
import useSwr, { mutate } from 'swr';

const sessionUrl = '/api/auth/session';

async function fetchSession(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not fetch session from ${url}`);
  }

  const session: Session = await response.json();

  if (!session || Object.keys(session).length === 0) {
    return null;
  }

  return session;
}

// useSwr from `swr` package: yarn add swr
export function useAuth(refreshInterval?: number) {
  /*
    custom hook that keeps the session up-to-date by refreshing it

    @param {number} refreshInterval: The refresh/polling interval in seconds. default is 20.
    @return {tuple} A tuple of the Session and boolean
  */
  const { data, error } = useSwr(sessionUrl, fetchSession, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
  });

  useEffect(() => {
    const intervalId = setInterval(
      () => mutate(sessionUrl),
      (refreshInterval || 20) * 1000,
    );

    return () => clearInterval(intervalId);
  }, []);

  return {
    session: data,
    loading: typeof data === 'undefined' && typeof error === 'undefined',
  };
}
