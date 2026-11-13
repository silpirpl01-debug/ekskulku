
"use client";

import { useActionState, useState } from "react";
import { daftarEkskul, type FormState } from "./DaftarEkskul";

export default function FormDaftar({
  id,
  namaAwal,
  kelasAwal,
}: {
  id: number;
  namaAwal: string;
  kelasAwal: string;
}) {
  const awal: FormState = {
    nama: namaAwal,
    kelas: kelasAwal,
  };

  const [state, formAction, pending] = useActionState(
    daftarEkskul,
    awal
  );

  const [nama, setNama] = useState(namaAwal);
  const [kelas, setKelas] = useState(kelasAwal);

  return (
    <section className="mt-8 rounded-xl border p-6">
      <h2 className="mb-4 text-xl font-bold">
        Daftar ekskul ini
      </h2>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="id" value={id} />

        <div>
          <label className="mb-1 block font-medium">
            Nama
          </label>

          <input
            name="nama"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Masukkan nama"
          />

          {state.errorNama && (
            <p className="mt-1 text-sm text-red-600">
              {state.errorNama}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-medium">
            Kelas
          </label>

          <input
            name="kelas"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Contoh: XII RPL 1"
          />

          {state.errorKelas && (
            <p className="mt-1 text-sm text-red-600">
              {state.errorKelas}
            </p>
          )}
        </div>

        {state.pesan && (
          <p className={state.berhasil ? "text-green-600" : "text-red-600"}>
            {state.pesan}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Memproses ..." : "Daftar"}
        </button>
      </form>
    </section>
  );
}
