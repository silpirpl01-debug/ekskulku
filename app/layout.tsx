import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "EventKu",
  description: "Katalog dan pemesanan tiket event sekolah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="antialiased">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <main className="mx-auto w-full max-w-5xl flex-1 p-6">{children}</main>
        <footer className="border-t bg-white p-4 text-center text-sm text-slate-500">
          EventKu - dibuat di kelas Junior Web Developer
        </footer>
      </body>
    </html>
  );
}
