
import Link from "next/link";
import { cookies } from "next/headers";
import { ekskul, pendaftar, JAM_SESI } from "@/data/ekskul";
import TombolBatalkan from "@/app/ekskul/[id]/TombolBatalkan";

export const metadata = {
  title: "Ekskul Saya",
};

export default async function Page() {
  const cookieStore = await cookies();

  const nama = cookieStore.get("nama")?.value;
  const kelas = cookieStore.get("kelas")?.value;

  if (!nama || !kelas) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <h1 className="mb-4 text-3xl font-bold">
          Ekskul Saya
        </h1>

        <p className="mb-4">
          Kamu belum mendaftar apa pun.
        </p>

        <Link
          href="/ekskul"
          className="font-semibold text-blue-600 hover:underline"
        >
          Lihat daftar ekskul
        </Link>
      </main>
    );
  }

  const daftarSaya = pendaftar.filter(
    (p) =>
      p.nama.toLowerCase() === nama.toLowerCase() &&
      p.kelas.toLowerCase() === kelas.toLowerCase()
  );

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Ekskul Saya
      </h1>

      <section className="mb-8 rounded-xl border p-6">
        <h2 className="text-xl font-bold">{nama}</h2>
        <p className="text-gray-600">
          {kelas} · {daftarSaya.length} ekskul diikuti
        </p>
      </section>

      {daftarSaya.length === 0 ? (
        <p>Belum ada ekskul yang diikuti.</p>
      ) : (
        <div className="space-y-4">
          {daftarSaya.map((item) => {
            const dataEkskul = ekskul.find(
              (e) => e.id === item.ekskulId
            );

            if (!dataEkskul) return null;

            return (
              <div
                key={item.nomor}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5"
              >
                <div>
                  <Link
                    href={`/ekskul/${dataEkskul.id}`}
                    className="text-lg font-bold text-blue-600 hover:underline"
                  >
                    {dataEkskul.nama}
                  </Link>

                  <p className="mt-1 text-gray-600">
                    {dataEkskul.hari}, sesi {dataEkskul.sesi} (
                    {JAM_SESI[dataEkskul.sesi]})
                  </p>
                </div>

                <TombolBatalkan nomor={item.nomor} />
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
