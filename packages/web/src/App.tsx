import { useEffect, useState } from 'react';
import { UpdateNotice } from './components/UpdateNotice';
import { api } from './lib/api';

// Content placeholder. The desktop shell + OTA content-update system is the real
// technology here; the content itself is a single "Hello World!" fetched from the
// backend. Replace this with the real content UI later.
export function App() {
  const [message, setMessage] = useState('…');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getHello()
      .then((r) => setMessage(r.message))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 text-slate-900">
      <h1 className="text-5xl font-bold tracking-tight">{error ? '⚠️' : message}</h1>
      <p className="mt-3 text-sm text-slate-500">
        {error ? error : 'JaSamKrompir — content placeholder'}
      </p>
      <UpdateNotice />
    </div>
  );
}
