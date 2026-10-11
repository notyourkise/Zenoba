import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Zenoba",
  description: "Informasi tentang penggunaan data pribadi, privasi, dan kontak pengelola Zenoba.",
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <h1>Privacy Policy</h1>
      <p>Terakhir diperbarui: <time dateTime="2026-10-11">11 Oktober 2026</time></p>
      <p>
        Kebijakan ini menjelaskan data yang digunakan Zenoba, tujuan penggunaannya,
        dan pilihan Anda saat menggunakan layanan pembelajaran.
      </p>

      <h2>Data yang kami gunakan</h2>
      <p>
        Saat membuat akun, Anda memberikan nama, alamat email, dan password.
        Password disimpan dalam bentuk yang tidak dapat dibaca langsung.
        Jika Anda memilih masuk dengan Google, kami menerima informasi akun
        yang diperlukan untuk login, seperti nama, alamat email, dan foto profil.
        Zenoba tidak menerima password Google atau meminta akses ke isi Gmail,
        Google Drive, kontak, maupun kalender Anda.
      </p>
      <p>
        Kami juga menyimpan progres belajar, jawaban latihan, skor, XP, dan hasil
        proyek agar Anda dapat melanjutkan pembelajaran dan melihat hasilnya.
        Informasi teknis tentang penggunaan layanan dan gangguan dapat tercatat
        untuk pemeliharaan dan keamanan.
      </p>
      <p>
        Gunakan data contoh dalam latihan. Jangan memasukkan dokumen identitas,
        informasi keuangan pribadi, password asli, atau data rahasia milik
        sekolah, perusahaan, dan pelanggan.
      </p>

      <h2>Tujuan penggunaan data</h2>
      <p>
        Data digunakan untuk mengelola akun, memulihkan akses, menyimpan progres,
        menilai latihan, menampilkan hasil belajar, dan menjaga layanan tetap
        berjalan. Data yang Anda kirim saat menghubungi pengelola digunakan
        untuk menanggapi pertanyaan atau laporan Anda.
      </p>
      <p>
        Zenoba tidak menjual data pribadi atau menggunakannya untuk iklan
        bertarget. Penggunaan data untuk tujuan baru akan dijelaskan terlebih
        dahulu dan memerlukan dasar pemrosesan yang sesuai.
      </p>

      <h2>Cookie dan penyimpanan browser</h2>
      <p>
        Zenoba menggunakan cookie untuk mendukung login dan keamanan akun.
        Preferensi tampilan dapat disimpan di browser Anda. Menghapus atau
        memblokir cookie dapat membuat Anda keluar dari akun atau mengganggu
        proses login. Menghapus data browser tidak menghapus akun dan progres
        yang tersimpan pada layanan.
      </p>

      <h2>Layanan pihak ketiga</h2>
      <p>
        Zenoba menggunakan penyedia layanan untuk mendukung fitur yang Anda
        gunakan. Penyedia terkait dapat memproses data sesuai fungsi layanannya:
      </p>
      <ul>
        <li>Google, untuk login menggunakan akun Google jika Anda memilihnya.</li>
        <li>Hostinger, untuk pengiriman email pemulihan akun dan komunikasi layanan.</li>
        <li>Cloudflare, untuk mendukung koneksi dan keamanan akses website.</li>
      </ul>
      <p>
        Kebijakan privasi penyedia tersebut juga berlaku pada layanan mereka.
        Tautan pemulihan akun bersifat pribadi; jangan membagikannya kepada orang lain.
      </p>

      <h2>Penyimpanan dan keamanan</h2>
      <p>
        Data akun dan progres belajar disimpan selama akun Anda aktif.
        Permintaan penghapusan dapat disampaikan kepada pengelola. Dalam
        pemenuhannya, kami memperhatikan kewajiban hukum dan kebutuhan keamanan
        yang berlaku, serta menjelaskan apabila ada data yang perlu dipertahankan.
      </p>
      <p>
        Zenoba menerapkan langkah keamanan untuk melindungi data dan membatasi
        akses yang tidak berwenang. Tidak ada layanan online yang dapat menjamin
        keamanan mutlak. Jaga kerahasiaan akun dan segera laporkan dugaan penyalahgunaan.
      </p>

      <h2>Hak dan pilihan Anda</h2>
      <p>
        Sesuai ketentuan pelindungan data pribadi yang berlaku, Anda dapat
        meminta informasi tentang penggunaan data, akses atau salinan data,
        perbaikan data, serta penghapusan atau penghentian pemrosesan.
        Jika pemrosesan didasarkan pada persetujuan, Anda dapat menarik
        persetujuan tersebut.
      </p>
      <p>
        Hubungi pengelola untuk mengajukan permintaan. Kami dapat meminta
        informasi yang diperlukan untuk memastikan permintaan berasal dari
        pemilik akun. Permintaan ditangani sesuai ketentuan dan batas waktu
        hukum yang berlaku. Jangan mengirim password atau data rahasia melalui email.
      </p>

      <h2>Privasi anak</h2>
      <p>
        Pemrosesan data pribadi anak memerlukan persetujuan orang tua atau wali
        sesuai ketentuan yang berlaku. Zenoba belum menyediakan mekanisme
        persetujuan tersebut. Jangan mendaftarkan data pribadi anak sebelum
        mekanisme yang sesuai tersedia. Orang tua atau wali dapat menghubungi
        pengelola untuk pertanyaan atau permintaan terkait data anak.
      </p>

      <h2>Perubahan kebijakan</h2>
      <p>
        Kebijakan ini dapat diperbarui mengikuti perubahan layanan. Tanggal
        di atas menunjukkan pembaruan terakhir. Pembaruan halaman ini tidak
        dengan sendirinya menjadi persetujuan Anda untuk tujuan penggunaan data yang baru.
      </p>

      <h2>Pengelola dan kontak</h2>
      <p>
        Zenoba dikelola secara independen oleh Fikri Haikal sebagai pengelola
        perseorangan dan pengendali data pribadi layanan ini.
      </p>
      <p>
        Pertanyaan privasi, permintaan terkait data pribadi, laporan operasional
        atau keamanan, dan kendala akses akun dapat disampaikan melalui email ke{" "}
        <a href="mailto:founder@zenoba.tech">founder@zenoba.tech</a>.
      </p>
    </article>
  );
}
