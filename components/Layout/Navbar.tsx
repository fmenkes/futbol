import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/client';
import { Box, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useEffect } from 'react';

const Navbar: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const [session, loading] = useSession();

  return (
    <Box as="nav" bg="gray.200" px="4" mb="4">
      <Flex h="16" alignItems="center" justifyContent="space-between">
        {!session && (
          <NextLink href="/api/auth/signin" passHref>
            <Link>Sign in</Link>
          </NextLink>
        )}
        {session && (
          <>
            <Box>{session.user.email}</Box>
            <Box>
              <NextLink href="/" passHref>
                <Link>Home</Link>
              </NextLink>
            </Box>
            <Box>
              <NextLink href="/stats" passHref>
                <Link>Stats</Link>
              </NextLink>
            </Box>
            <Box>
              <NextLink href="/matches" passHref>
                <Link>Matches</Link>
              </NextLink>
            </Box>
            <Box>
              <NextLink href="/api/auth/signout" passHref>
                <Link>Sign out</Link>
              </NextLink>
            </Box>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
