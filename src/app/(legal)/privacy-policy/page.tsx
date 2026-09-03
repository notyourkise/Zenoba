import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Netloka",
  description:
    "Penjelasan data akun, Google login, sesi, progres belajar, hasil latihan, dan email pemulihan pada Netloka.",
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <h1>Privacy Policy</h1>
      <p>
        Terakhir diperbarui: <time dateTime="2026-09-03">3 September 2026</time>
      </p>
      <p>
        Kebijakan ini menjelaskan bagaimana fitur Netloka memproses data ketika
        Anda membuat akun dan menggunakan layanan pembelajaran. Netloka masih
        dalam tahap pengembangan, belum diluncurkan ke staging atau production.
        Penjelasan integrasi berlaku ketika integrasi tersebut dikonfigurasi dan
        digunakan; tersedianya kode tidak berarti layanan eksternal sudah aktif.
      </p>

      <h2>Data akun dan autentikasi</h2>
      <p>
        Akun email menyimpan alamat email, nama yang Anda isi, identitas akun,
        peran pengguna, serta waktu pembuatan dan perubahan akun. Password
        diproses untuk autentikasi dan disimpan sebagai hash, bukan teks
        password yang dapat dibaca kembali. Nama dapat diperbarui melalui
        Profile.
      </p>
      <p>
        Jika Anda memilih Google login, Netloka menerima identitas akun Google,
        alamat email, informasi verifikasi email, nama, dan foto profil yang
        diberikan Google. Sistem dapat menyimpan token serta metadata OAuth yang
        diberikan penyedia untuk menghubungkan dan mengautentikasi akun. Izin
        login yang digunakan adalah openid, email, dan profile; aplikasi tidak
        meminta akses isi Gmail, Google Drive, kontak, atau kalender. Password
        Google tidak diterima oleh Netloka.
      </p>

      <h2>Data aktivitas belajar</h2>
      <p>
        Netloka menyimpan progres lesson, waktu penyelesaian, jawaban kuis,
        skor, status kelulusan, percobaan Labs dan Challenges, serta transaksi
        XP. Pada Consultant, data dapat mencakup pilihan perangkat, anggaran,
        topologi, rencana IP/VLAN, penilaian, dan feedback. Data ini dihubungkan
        dengan akun agar hasil dapat dinilai dan dilanjutkan kembali.
      </p>
      <p>
        Gunakan data contoh dalam latihan. Aplikasi tidak membutuhkan dokumen
        identitas, informasi keuangan pribadi, password perangkat nyata, atau
        data rahasia milik sekolah, perusahaan, maupun pelanggan.
      </p>

      <h2>Tujuan pemrosesan</h2>
      <p>
        Data digunakan untuk membuat dan mengautentikasi akun, menjalankan
        pemulihan akses, memeriksa hak akses, menyimpan progres, menilai
        jawaban, menghitung XP, dan menampilkan hasil proyek. Informasi
        kesalahan teknis dapat tercatat dalam log untuk membantu diagnosis dan
        pemeliharaan.
      </p>
      <p>
        Alur aplikasi saat ini tidak menyediakan iklan bertarget, penjualan
        data, atau pelacakan lintas situs untuk pemasaran. Pemrosesan di luar
        tujuan yang dijelaskan memerlukan dasar yang sesuai dan pemberitahuan
        tersendiri; membaca halaman ini bukan persetujuan untuk tujuan baru.
      </p>

      <h2>Cookie dan penyimpanan browser</h2>
      <p>
        Autentikasi menggunakan cookie untuk sesi login, perlindungan
        permintaan, dan tujuan kembali setelah login. Preferensi tema dapat
        disimpan pada penyimpanan lokal browser. Memblokir atau menghapus cookie
        dapat membuat Anda keluar dari akun atau menghambat proses login.
        Menghapus data browser tidak otomatis menghapus akun dan progres di
        server.
      </p>

      <h2>Email pemulihan password</h2>
      <p>
        Saat Anda meminta reset password untuk akun email yang sesuai, sistem
        membuat token pemulihan dan mengirim tautan ke alamat email akun melalui
        SMTP yang dikonfigurasi untuk Hostinger Email. Penyedia email memproses
        alamat tujuan dan isi pesan untuk pengiriman. Jangan membagikan tautan
        tersebut kepada orang lain.
      </p>
      <p>
        Database menyimpan hash token dengan masa berlaku 30 menit. Token hanya
        dapat digunakan sekali; permintaan baru menggantikan token sebelumnya.
        Berakhirnya masa berlaku tidak dengan sendirinya berarti seluruh catatan
        email atau data akun sudah dihapus.
      </p>

      <h2>Pihak yang terlibat</h2>
      <p>
        Google memproses autentikasi ketika Anda memilih Google login; penyedia
        email memproses pengiriman pesan pemulihan. Data aplikasi disimpan
        melalui database PostgreSQL pada lingkungan yang menjalankan Netloka.
        Pihak yang mengoperasikan lingkungan tersebut dapat memiliki akses
        administratif yang diperlukan untuk pengelolaan layanan.
      </p>
      <p>
        Saat deployment dilakukan, penyedia hosting atau reverse proxy dapat
        memproses data koneksi seperti alamat IP, waktu permintaan, dan
        informasi browser. Lokasi penyimpanan, pihak infrastruktur yang
        diaktifkan, serta ketentuan transfer data perlu ditetapkan sebelum
        peluncuran; kebijakan ini tidak mengklaim semua data hanya berada di
        Indonesia.
      </p>

      <h2>Penyimpanan dan keamanan</h2>
      <p>
        Data akun dan pembelajaran tetap tersimpan di database sampai dihapus
        melalui pengelolaan data. Versi ini belum memiliki jadwal retensi atau
        penghapusan akun otomatis. Jadwal penyimpanan, penanganan cadangan,
        serta prosedur permintaan penghapusan perlu ditetapkan sebelum
        penggunaan umum; tidak ada janji penghapusan otomatis dalam periode
        tertentu.
      </p>
      <p>
        Aplikasi menggunakan pemeriksaan sesi dan hak akses, validasi masukan,
        serta hash untuk password dan token reset. Langkah tersebut tidak
        menjamin keamanan mutlak. Pengujian integrasi dan pengamanan operasional
        tetap diperlukan sebelum layanan dibuka untuk umum.
      </p>

      <h2>Pilihan dan hak Anda</h2>
      <p>
        Anda dapat memperbarui nama melalui Profile, keluar dari sesi, atau
        menggunakan pemulihan password untuk akun email. Akses Google dapat
        dikelola melalui pengaturan koneksi pihak ketiga pada akun Google;
        pencabutan akses tersebut tidak otomatis menghapus data Netloka.
      </p>
      <p>
        Sesuai ketentuan pelindungan data yang berlaku, Anda dapat meminta
        informasi, akses atau salinan, perbaikan, penghentian pemrosesan,
        penghapusan, maupun menarik persetujuan jika pemrosesan didasarkan pada
        persetujuan. Hak tersebut mengikuti syarat dan pengecualian hukum. Versi
        ini belum menyediakan ekspor atau penghapusan akun mandiri.
      </p>

      <h2>Data anak</h2>
      <p>
        Pemrosesan data anak membutuhkan persetujuan orang tua atau wali sesuai
        ketentuan yang berlaku. Alur verifikasi persetujuan tersebut belum
        tersedia dalam versi pengembangan. Jangan mendaftarkan data anak untuk
        penggunaan nyata sebelum mekanismenya disiapkan.
      </p>

      <h2>Kontak dan pembaruan</h2>
      <p>
        Kanal kontak privasi publik belum diterbitkan. Jika Anda mengikuti uji
        coba yang dikoordinasikan langsung, sampaikan pertanyaan melalui kontak
        pengelola yang memberikan akses. Jangan mengirim password, token, atau
        dokumen identitas melalui jawaban latihan maupun kanal publik. Identitas
        penanggung jawab dan kanal permintaan privasi yang dapat dihubungi harus
        dilengkapi sebelum peluncuran umum.
      </p>
      <p>
        Kebijakan ini akan diperbarui jika fitur, integrasi, atau praktik
        pemrosesan berubah. Periksa tanggal pembaruan di atas. Perubahan halaman
        tidak menggantikan persetujuan yang diperlukan untuk pemrosesan baru.
      </p>
    </article>
  );
}
