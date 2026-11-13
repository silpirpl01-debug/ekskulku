
import { ambilAnggota } from "@/data/ambil";

export default async function DaftarAnggota({
  id,
  kuota,
  namaCookie,
}: {
  id: number;
  kuota: number;
  namaCookie: string;
}) {
  const anggota = await ambilAnggota(id);

  return (
    <section className="mt-8 rounded-xl border p-6">
      <h2 className="mb-2 text-xl font-bold">
        Anggota terdaftar
      </h2>

      <p className="mb-4 text-gray-600">
        {anggota.length} dari {kuota} tempat terisi
      </p>

      {anggota.length === 0 ? (
        <p>Belum ada anggota.</p>
      ) : (
        <ul className="space-y-3">
          {anggota.map((item) => (
            <li key={item.nomor} className="border-b pb-3">
              <span className="font-medium">{item.nama}</span>

              {item.nama === namaCookie && (
                <span className="ml-2 rounded bg-green-100 px-2 py-1 text-sm text-green-700">
                  Kamu
                </span>
              )}

              <p className="text-sm text-gray-600">
                {item.kelas}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
