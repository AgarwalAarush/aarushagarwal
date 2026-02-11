import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AINotesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/notes/ai-notes');
  }, [router]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-gray-900 dark:text-white">
      <p className="mb-3">Moving to the new notes route...</p>
      <Link href="/notes/ai-notes" className="hover:underline">
        Continue to AI Notes
      </Link>
    </main>
  );
}
