
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  ekskul,
  pendaftar,
  tambahPendaftar,
} from "@/data/ekskul";
import { hapusPendaftar } from "@/data/ekskul";
import { JAM_SESI } from "@/data/ekskul";

export type FormState = {
  nama: string;
  kelas: string;
  errorNama?: string;
  errorKelas?: string;
  pesan?: string;
  berhasil?: boolean;
};

export async function daftarEkskul(
  _state: FormState,
  formData: FormData
): Promise<FormState> {
  const nama = String(formData.get("nama") ?? "").trim();
  const kelas = String(formData.get("kelas") ?? "").trim();
  const id = Number(formData.get("id"));

  const hasil: FormState = { nama, kelas };

  // Validasi nama dan kelas
  if (nama.length < 3) {
    hasil.errorNama = "Nama minimal 3 huruf.";
  }

  if (kelas.length < 3) {
    hasil.errorKelas = "Kelas minimal 3 karakter.";
  }

  if (hasil.errorNama || hasil.errorKelas) {
    return hasil;
  }

  const dataEkskul = ekskul.find((e) => e.id === id);

  if (!dataEkskul) {
    hasil.pesan = "Ekskul tidak ditemukan.";
    return hasil;
  }

  const namaNormal = nama.toLowerCase();
  const kelasNormal = kelas.toLowerCase();

  // Cek pendaftaran ganda
  const sudahTerdaftar = pendaftar.some(
    (p) =>
      p.ekskulId === id &&
      p.nama.toLowerCase() === namaNormal &&
      p.kelas.toLowerCase() === kelasNormal
  );

  if (sudahTerdaftar) {
    hasil.pesan = `${nama} (${kelas}) sudah terdaftar di ${dataEkskul.nama}.`;
    return hasil;
  }

  // Cek kuota
  const jumlahAnggota = pendaftar.filter(
    (p) => p.ekskulId === id
  ).length;

  if (jumlahAnggota >= dataEkskul.kuota) {
    hasil.pesan = `Kuota ${dataEkskul.nama} sudah penuh (${dataEkskul.kuota} orang).`;
    return hasil;
  }

  // Cek jadwal bentrok
  const bentrok = pendaftar.find((p) => {
    if (
      p.nama.toLowerCase() !== namaNormal ||
      p.kelas.toLowerCase() !== kelasNormal ||
      p.ekskulId === id
    ) {
      return false;
    }

    const ekskulLain = ekskul.find(
      (e) => e.id === p.ekskulId
    );

    return (
      ekskulLain?.hari === dataEkskul.hari &&
      ekskulLain?.sesi === dataEkskul.sesi
    );
  });

  if (bentrok) {
    const ekskulBentrok = ekskul.find(
      (e) => e.id === bentrok.ekskulId
    );

    hasil.pesan = `Jadwal bentrok dengan ${ekskulBentrok?.nama} (${dataEkskul.hari}, sesi ${dataEkskul.sesi}).`;
    return hasil;
  }

  // Simpan pendaftaran
  const nomor = tambahPendaftar({
    ekskulId: id,
    nama,
    kelas,
  });

  // Simpan nama dan kelas ke cookie
  const cookieStore = await cookies();

  cookieStore.set("nama", nama, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  cookieStore.set("kelas", kelas, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  revalidatePath("/ekskul");
  revalidatePath(`/ekskul/${id}`);

  return {
    nama,
    kelas,
    berhasil: true,
    pesan: `Pendaftaran #${nomor} berhasil: ${dataEkskul.nama}, ${dataEkskul.hari}, sesi ${dataEkskul.sesi} (${JAM_SESI[dataEkskul.sesi]}).`,
  };
}


export async function batalkanEkskul(formData: FormData) {
  const cookieStore = await cookies();

  const nama = cookieStore.get("nama")?.value ?? "";
  const kelas = cookieStore.get("kelas")?.value ?? "";
  const nomor = Number(formData.get("nomor"));

  if (!nama || !kelas || !Number.isInteger(nomor)) return;

  const pendaftaran = pendaftar.find(
    (p) => p.nomor === nomor
  );

  if (!pendaftaran) return;

  // Pastikan pendaftaran benar-benar milik pemilik cookie
  if (
    pendaftaran.nama.toLowerCase() !== nama.toLowerCase() ||
    pendaftaran.kelas.toLowerCase() !== kelas.toLowerCase()
  ) {
    return;
  }

  const ekskulId = pendaftaran.ekskulId;

  hapusPendaftar(nomor);

  revalidatePath("/saya");
  revalidatePath("/ekskul");
  revalidatePath(`/ekskul/${ekskulId}`);
}

