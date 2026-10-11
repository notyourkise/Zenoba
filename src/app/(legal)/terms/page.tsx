import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Zenoba",
  description:
    "Ketentuan penggunaan Zenoba, akun, materi belajar, dan simulasi IT infrastructure.",
};

export default function TermsPage() {
  return (
    <article>
      <h1>Terms of Service</h1>
      <p>
        Terakhir diperbarui: <time dateTime="2026-10-11">11 Oktober 2026</time>
      </p>
      <p>
        Ketentuan ini menjelaskan penggunaan Zenoba, platform pembelajaran IT
        infrastructure dengan area Learn, Labs, Challenges, dan Consultant.
        Zenoba sudah tersedia untuk digunakan. Ketentuan ini mencakup fitur
        yang tersedia pada versi yang Anda gunakan, bukan janji ketersediaan
        fitur yang masih direncanakan.
      </p>

      <h2>Ruang lingkup layanan</h2>
      <p>
        Zenoba membantu Anda memahami konsep melalui materi, interaksi,
        latihan, kuis, dan studi kasus. Networking merupakan domain pembelajaran
        pertama yang tersedia. Kategori berlabel Soon belum dapat digunakan.
        Materi, konfigurasi latihan, penilaian, dan antarmuka dapat berubah
        selama pengembangan.
      </p>

      <h2>Akun dan akses</h2>
      <p>
        Gunakan alamat email yang Anda kuasai dan informasi akun yang sesuai.
        Jaga kerahasiaan password, tautan pemulihan, dan sesi login. Jangan
        membagikan akun atau mengakses akun orang lain tanpa izin. Keluar dari
        akun setelah memakai perangkat bersama.
      </p>
      <p>
        Pendaftaran dengan email membuat akun Zenoba dengan password. Jika
        Google login diaktifkan, Anda dapat menggunakan akun Google untuk
        autentikasi dan pembuatan akun. Ketersediaan Google login serta email
        pemulihan bergantung pada konfigurasi dan layanan pihak terkait. Zenoba
        tidak meminta password akun Google Anda.
      </p>

      <h2>Pengguna usia anak</h2>
      <p>
        Jika Anda masih berusia anak, penggunaan akun dan pemrosesan data
        pribadi memerlukan keterlibatan serta persetujuan orang tua atau wali
        sesuai ketentuan yang berlaku. Zenoba belum menyediakan alur verifikasi
        persetujuan orang tua/wali. Jangan mendaftarkan data anak untuk
        penggunaan nyata sebelum mekanisme tersebut disiapkan.
      </p>

      <h2>Penggunaan yang diperbolehkan</h2>
      <p>
        Gunakan Zenoba untuk belajar dan berlatih secara bertanggung jawab.
        Jangan mencoba melewati pembatasan akses, memanipulasi skor atau XP,
        mengirim konten berbahaya, mengganggu layanan, menyalahgunakan email
        pemulihan, atau mengambil data pengguna lain. Pengujian keamanan di luar
        latihan yang disediakan memerlukan izin pengelola terlebih dahulu.
      </p>

      <h2>Batas simulasi dan hasil pembelajaran</h2>
      <p>
        Terminal, jaringan, perangkat, harga, dan skenario proyek merupakan
        simulasi pembelajaran. Perintah dalam simulator tidak dijalankan pada
        perangkat jaringan nyata. Jangan memasukkan password asli, token, data
        pelanggan, atau konfigurasi rahasia ke dalam jawaban dan latihan.
      </p>
      <p>
        Skor, XP, status kelulusan latihan, dan hasil Consultant merupakan umpan
        balik belajar, bukan sertifikasi profesi, jaminan kompetensi, penawaran
        harga nyata, atau rekomendasi teknis untuk langsung diterapkan pada
        sistem produksi. Verifikasi setiap penerapan di lingkungan nyata bersama
        pihak yang berwenang dan kompeten.
      </p>

      <h2>Materi dan hasil pekerjaan</h2>
      <p>
        Materi dan identitas Zenoba, serta materi pihak ketiga, tetap mengikuti
        hak dan lisensi pemiliknya. Akses belajar tidak dengan sendirinya
        memberikan hak untuk menjual ulang atau mengatasnamakan materi tersebut.
        Penggunaan yang diperbolehkan oleh hukum dan lisensi terkait tetap
        berlaku.
      </p>
      <p>
        Anda bertanggung jawab atas jawaban dan data yang Anda kirimkan. Zenoba
        memprosesnya untuk menjalankan latihan, memberikan penilaian, menyimpan
        progres, dan menampilkan kembali hasil pekerjaan Anda. Mengirim jawaban
        tidak memindahkan kepemilikan karya Anda kepada Zenoba.
      </p>

      <h2>Privasi dan layanan pihak ketiga</h2>
      <p>
        Baca <Link href="/privacy-policy">Privacy Policy</Link> untuk memahami
        data yang diproses, tujuannya, penyimpanan, dan pilihan Anda. Tautan
        kebijakan ini merupakan pemberitahuan, bukan persetujuan tanpa batas
        untuk penggunaan data di luar tujuan yang dijelaskan. Ketentuan Google
        dan penyedia layanan lain juga berlaku ketika Anda menggunakan layanan
        mereka.
      </p>

      <h2>Ketersediaan dan perubahan</h2>
      <p>
        Layanan dapat mengalami gangguan, koreksi materi, atau perubahan fitur.
        Jangan menjadikannya satu-satunya penyimpanan pekerjaan penting. Zenoba
        belum menyediakan transaksi pembayaran atau langganan dalam alur aplikasi
        saat ini; jangan
        menganggap penawaran pembayaran di luar aplikasi sebagai bagian dari
        layanan ini.
      </p>
      <p>
        Tanggal pembaruan di halaman ini menunjukkan versi ketentuan. Perubahan
        tujuan pemrosesan data atau persyaratan yang memerlukan persetujuan
        tidak dianggap disetujui hanya karena halaman ini diperbarui.
      </p>

      <h2>Pengelola dan komunikasi</h2>
      <p>
        Zenoba dikelola secara mandiri oleh Fikri Haikal sebagai pengelola
        perseorangan. Penggunaan layanan mengikuti hukum yang
        berlaku di Republik Indonesia.
      </p>
      <p>
        Pertanyaan seputar ketentuan layanan, laporan operasional atau keamanan,
        dan kendala akses akun dapat disampaikan melalui email ke{" "}
        <a href="mailto:founder@zenoba.tech">
          founder@zenoba.tech
        </a>
        .
      </p>
    </article>
  );
}
