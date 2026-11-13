
import { ambilEkskul } from "@/data/ambil";
import { JAM_SESI } from "@/data/ekskul";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Suspense } from "react";
import DaftarAnggota from "./DaftarAnggota";
import FormDaftar from "./FormDaftar";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await ambilEkskul(Number(id));

  return {
    title: data?.nama ?? "Ekskul tidak ditemukan",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await ambilEkskul(Number(id));

  if (!data) notFound();

  const cookieStore = await cookies();
  const namaAwal = cookieStore.get("nama")?.value ?? "";
  const kelasAwal = cookieStore.get("kelas")?.value ?? "";

  return (
    <main className="mx-auto max-w-3xl p-8">
      <p className="mb-2 text-blue-600">{data.kategori}</p>

      <h1 className="mb-4 text-3xl font-bold">
        {data.nama}
      </h1>

      <p>Hari: {data.hari}</p>
      <p>
        Sesi {data.sesi} ({JAM_SESI[data.sesi]})
      </p>
      <p>Pembina: {data.pembina}</p>

      <FormDaftar
        id={data.id}
        namaAwal={namaAwal}
        kelasAwal={kelasAwal}
      />

      <Suspense
        fallback={
          <p className="mt-8 text-gray-500">
            Memuat anggota ...
          </p>
        }
      >
        <DaftarAnggota
          id={data.id}
          kuota={data.kuota}
          namaCookie={namaAwal}
        />
      </Suspense>
    </main>
  );
}
