"use client";

export default function GalatEvent({ error, retry }: { error: unknown; retry: () => void }) {
  const pesan = error instanceof Error ? error.message : "Terjadi kesalahan.";
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-semibold text-red-700">Data event gagal dimuat</h2>
      <p className="mt-1 text-sm text-red-600">{pesan}</p>
      <button onClick={() => retry()} className="mt-4 rounded bg-red-600 px-4 py-2 text-white">
        Coba lagi
      </button>
    </div>
  );
}