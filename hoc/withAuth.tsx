import { Session } from 'next-auth';
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuth } from '../hooks/useAuth';

type TSessionProps = {
  session: Session;
};

export function withAuth<P extends object>(refreshInterval?: number) {
  /*
    @param { number } refreshInterval: number of seconds before each refresh
  */

  return function (Component: React.ComponentType<P>) {
    return function (props: Exclude<P, TSessionProps>) {
      const router = useRouter();
      const { session, loading } = useAuth(refreshInterval);

      if (typeof window !== 'undefined' && loading) {
        return null;
      }

      if (!loading && !session) {
        // or return a custom <AccessDenied /> component or redirect to `/login`.
        // return (
        //   <>
        //     Not signed in <br />
        //     <button onClick={() => signIn()}>Sign in</button>
        //     <pre>{'User is not logged in'}</pre>
        //   </>
        // );
        router.replace('/');
        return null;
      }

      return <Component session={session} {...props} />;
    };
  };
}
