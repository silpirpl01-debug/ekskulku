
import { batalkanEkskul } from "./DaftarEkskul";

export default function TombolBatalkan({
  nomor,
}: {
  nomor: number;
}) {
  return (
    <form action={batalkanEkskul}>
      <input type="hidden" name="nomor" value={nomor} />

      <button
        type="submit"
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
      >
        Batalkan
      </button>
    </form>
  );
}
