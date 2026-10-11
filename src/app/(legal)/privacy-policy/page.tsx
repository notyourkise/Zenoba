import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Zenoba",
  description:
    "Penjelasan data akun, Google login, sesi, progres belajar, hasil latihan, dan email pemulihan pada Zenoba.",
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <h1>Privacy Policy</h1>
      <p>
        Terakhir diperbarui: <time dateTime="2026-10-11">11 Oktober 2026</time>
      </p>
      <p>
        Kebijakan ini menjelaskan bagaimana Zenoba memproses data ketika Anda
        membuat akun dan menggunakan layanan pembelajaran. Penjelasan integrasi
        berlaku ketika integrasi tersebut dikonfigurasi dan digunakan;
        tersedianya kode tidak berarti layanan eksternal sudah aktif.
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
        Jika Anda memilih Google login, Zenoba menerima identitas akun Google,
        alamat email, informasi verifikasi email, nama, dan foto profil yang
        diberikan Google. Sistem dapat menyimpan token serta metadata OAuth yang
        diberikan penyedia untuk menghubungkan dan mengautentikasi akun. Izin
        login yang digunakan adalah openid, email, dan profile; aplikasi tidak
        meminta akses isi Gmail, Google Drive, kontak, atau kalender. Password
        Google tidak diterima oleh Zenoba.
      </p>

      <h2>Data aktivitas belajar</h2>
      <p>
        Zenoba menyimpan progres lesson, waktu penyelesaian, jawaban kuis,
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

      <h2>Pihak yang terlibat dan pemroses data</h2>
      <p>
        Pemrosesan data teknis dan operasional melibatkan infrastruktur pihak
        ketiga dengan batasan fungsi yang jelas:
      </p>
      <ul>
        <li>
          <strong>Google LLC:</strong> Memproses autentikasi saat Anda memilih
          opsi Google login (terbatas pada cakupan identitas dasar).
        </li>
        <li>
          <strong>Hostinger International Ltd.:</strong> Menyediakan layanan
          SMTP dan mailbox resmi (<code>noreply@haikalariadma.my.id</code>) untuk
          pengiriman tautan reset password dan komunikasi operasional.
        </li>
        <li>
          <strong>Cloudflare, Inc.:</strong> Mengelola DNS, mitigasi DDoS, dan
          keamanan koneksi HTTPS edge.
        </li>
        <li>
          <strong>PostgreSQL dan server aplikasi:</strong> Berjalan pada server
          privat (VPS Linux) untuk penyimpanan data dan perutean permintaan.
        </li>
      </ul>

      <h2>Penyimpanan, retensi, dan keamanan</h2>
      <p>
        Data akun dan histori progres pembelajaran disimpan selama akun Anda
        aktif untuk menjamin kelangsungan belajar. Data keamanan sementara
        memiliki batas waktu terukur: token reset password kedaluwarsa dalam 30
        menit dan dibersihkan berkala, sedangkan pencatatan pembatasan frekuensi
        (rate limit) direset otomatis setiap 15 menit.
      </p>
      <p>
        Aplikasi menerapkan validasi masukan, enkripsi searah (hash kriptografi)
        untuk password dan kunci pembatas laju, proteksi sesi terdistribusi,
        serta pencatatan audit keamanan (security events).
      </p>

      <h2>Hak Anda sebagai subjek data</h2>
      <p>
        Berdasarkan Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data
        Pribadi (UU PDP), Anda memiliki hak untuk:
      </p>
      <ul>
        <li>Mendapatkan informasi tentang kejelasan identitas dan tujuan pemrosesan data.</li>
        <li>Mengakses dan meminta salinan data pribadi Anda.</li>
        <li>Memperbaiki kesalahan atau memperbarui data pribadi Anda.</li>
        <li>Meminta penghentian pemrosesan atau penghapusan data pribadi Anda.</li>
        <li>Menarik persetujuan pemrosesan yang pernah Anda berikan.</li>
      </ul>
      <p>
        Permohonan pemenuhan hak subjek data dapat dikirimkan langsung melalui
        surat elektronik ke alamat kontak resmi pengelola. Permohonan akan
        ditindaklanjuti maksimal dalam 30 (tiga puluh) hari kalender.
      </p>

      <h2>Data anak</h2>
      <p>
        Platform ditujukan untuk pembelajaran siswa SMK TKJ dan pemula. Jika
        Anda berusia di bawah 18 tahun, pendaftaran dan aktivitas belajar
        dilakukan dengan sepengetahuan orang tua atau wali. Latihan bersifat
        simulasi deterministik; jangan pernah memasukkan data rahasia pribadi,
        data sekolah, atau kata sandi nyata ke dalam simulator.
      </p>

      <h2>Kontak pengelola</h2>
      <p>
        Pengendali data pribadi platform ini adalah Fikri Haikal sebagai
        pengelola perseorangan Zenoba.
      </p>
      <p>
        Segala pertanyaan, permohonan pemenuhan hak data pribadi, laporan
        kerentanan keamanan, atau masukan dapat disampaikan melalui surat
        elektronik ke alamat resmi:{" "}
        <a href="mailto:noreply@haikalariadma.my.id">
          noreply@haikalariadma.my.id
        </a>
        .
      </p>
    </article>
  );
}
