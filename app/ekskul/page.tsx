
import Link from "next/link";
import { ambilSemuaEkskul } from "@/data/ambil";
import {
  pendaftar,
  DAFTAR_KATEGORI,
  DAFTAR_HARI,
  JAM_SESI,
  type Kategori,
} from "@/data/ekskul";

export const metadata = {
  title: "Daftar Ekskul",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    kategori?: string;
    hari?: string;
  }>;
}) {
  const params = await searchParams;

  const kategoriValid = DAFTAR_KATEGORI.includes(
    params.kategori as Kategori
  );

  const hariValid = DAFTAR_HARI.includes(params.hari ?? "");

  const kategori = kategoriValid ? params.kategori! : "";
  const hari = hariValid ? params.hari! : "";

  const semuaEkskul = await ambilSemuaEkskul();

  const hasil = semuaEkskul.filter((item) => {
    const cocokKategori =
      !kategori || item.kategori === kategori;

    const cocokHari =
      !hari || item.hari === hari;

    return cocokKategori && cocokHari;
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="mb-2 text-3xl font-bold">
        Daftar Ekskul
      </h1>

      <p className="mb-6 text-gray-600">
        {hasil.length} ekskul ditemukan
      </p>

      <form
        action="/ekskul"
        method="GET"
        className="mb-8 flex flex-wrap gap-4"
      >
        <select
          name="kategori"
          defaultValue={kategori}
          className="rounded-lg border p-3"
        >
          <option value="">Semua kategori</option>

          {DAFTAR_KATEGORI.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          name="hari"
          defaultValue={hari}
          className="rounded-lg border p-3"
        >
          <option value="">Semua hari</option>

          {DAFTAR_HARI.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          Terapkan Filter
        </button>
      </form>

      {hasil.length === 0 ? (
        <p className="py-10 text-center text-gray-500">
          Tidak ada ekskul yang cocok.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((item) => {
            const jumlahPendaftar = pendaftar.filter(
              (p) => p.ekskulId === item.id
            ).length;

            const sisa = item.kuota - jumlahPendaftar;

            return (
              <Link
                key={item.id}
                href={`/ekskul/${item.id}`}
                className="rounded-xl border p-5 shadow-sm transition hover:shadow-md"
              >
                <p className="mb-2 text-sm text-blue-600">
                  {item.kategori}
                </p>

                <h2 className="mb-3 text-xl font-bold">
                  {item.nama}
                </h2>

                <p>Hari: {item.hari}</p>

                <p>
                  Sesi {item.sesi} ({JAM_SESI[item.sesi]})
                </p>

                {sisa <= 0 ? (
                  <p className="mt-4 font-semibold text-red-600">
                    Penuh
                  </p>
                ) : (
                  <p className="mt-4 font-semibold text-green-600">
                    Sisa {sisa} dari {item.kuota} tempat
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
