import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function getSafeNextPath(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/notes';
}

export default function NotesAccess() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nextPath = getSafeNextPath(router.query.next);

  useEffect(() => {
    if (router.query.logout !== '1') return;

    fetch('/api/notes-access', { method: 'DELETE' }).finally(() => {
      router.replace('/notes-access');
    });
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/notes-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Unable to unlock Notes.');
        return;
      }

      await router.replace(nextPath);
    } catch {
      setError('Unable to unlock Notes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 dark:bg-[#1D1E21]">
      <Head>
        <title>Notes Access | Aarush Agarwal</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-700 dark:bg-[#1D1E21]"
      >
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
          Private notes
        </p>
        <h1 className="text-2xl text-gray-900 dark:text-white">Enter password</h1>
        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
          This section is available to invited readers.
        </p>

        <label className="mt-6 block text-sm font-medium text-gray-900 dark:text-white" htmlFor="notes-password">
          Password
        </label>
        <input
          id="notes-password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none transition focus:border-gray-900 dark:border-gray-600 dark:bg-[#1D1E21] dark:text-white dark:focus:border-white"
          required
        />

        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
        >
          {isSubmitting ? 'Unlocking…' : 'Unlock notes'}
        </button>
      </form>
    </main>
  );
}
