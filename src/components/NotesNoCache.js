import { useEffect } from 'react';

export default function NotesNoCache() {
  useEffect(() => {
    function reloadPersistedNotesPage(event) {
      if (event.persisted) {
        window.location.reload();
      }
    }

    window.addEventListener('pageshow', reloadPersistedNotesPage);
    return () => window.removeEventListener('pageshow', reloadPersistedNotesPage);
  }, []);

  return null;
}
