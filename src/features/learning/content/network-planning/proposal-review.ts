import { CurriculumModule } from "../schema";

/**
 * Public Curriculum Definition for Dokumentasi Teknis Proposal & Review Desain (P6-M4)
 *
 * Covers assembling comprehensive industry-standard IT proposals (Executive Summary,
 * Topology Diagrams, IP/VLAN Tables, BoQ, Implementation Schedules),
 * design review rubrics across 5 dimensions, and correcting flawed proposals.
 */
export const proposalReviewModuleData: CurriculumModule = {
  id: "module-proposal-review",
  slug: "proposal-review",
  title: "Dokumentasi Teknis Proposal & Review Desain",
  description:
    "Pelajari penyusunan dokumen proposal proyek jaringan komprehensif: menyusun Executive Summary meyakinkan, diagram topologi standar, BoQ, rencana implementasi, serta audit kritis mandiri menggunakan rubrik evaluasi 5 dimensi.",
  orderIndex: 4,
  prerequisites: ["topology-ip-vlan-design"],
  outcomes: [
    {
      id: "PLAN-M4-O1",
      text: "Siswa dapat menyusun dokumen proposal teknis jaringan lengkap yang terstruktur rapi untuk presentasi kepada stakeholder non-teknis maupun teknis.",
    },
    {
      id: "PLAN-M4-O2",
      text: "Siswa dapat mengaudit dan merevisi draf proposal menggunakan rubrik 5 dimensi (Technical Correctness, Requirement Fulfillment, Cost Efficiency, Scalability, Security).",
    },
  ],
  lessons: [
    // =========================================================================
    // Lesson 7: dokumentasi-teknis-jaringan (P6-L07)
    // =========================================================================
    {
      id: "lesson-dokumentasi-teknis-jaringan",
      slug: "dokumentasi-teknis-jaringan",
      title: "Penyusunan Dokumen Proposal Teknis Jaringan Profesional",
      description:
        "Menyusun struktur dokumen proposal: Executive Summary, Latar Belakang & Scope of Work, Diagram Topologi Fisik/Logis, Tabel IP/VLAN, BoQ, dan Milestone Timeline.",
      orderIndex: 0,
      estimatedMinutes: 16,
      xpReward: 60,
      prerequisites: ["perencanaan-ip-dan-vlan"],
      outcomes: [
        {
          id: "PLAN-L7-A",
          text: "Siswa dapat menyusun Executive Summary yang ringkas dan persuasif, menerjemahkan nilai investasi teknologi ke dalam keuntungan bisnis klien.",
        },
        {
          id: "PLAN-L7-B",
          text: "Siswa dapat mengintegrasikan seluruh artefak teknis (topologi, IP/VLAN, BoQ, jadwal instalasi) ke dalam satu proposal kohesif.",
        },
      ],
      evidence: [
        {
          outcomeId: "PLAN-L7-A",
          teachingBlockIds: ["plan-l7-h1", "plan-l7-txt1", "plan-l7-callout1"],
          activityIds: ["plan-l7-code1"],
          assessmentItemIds: ["quiz-plan-l7-q1", "quiz-plan-l7-q2"],
        },
        {
          outcomeId: "PLAN-L7-B",
          teachingBlockIds: ["plan-l7-h2", "plan-l7-txt2", "plan-l7-callout2"],
          activityIds: ["plan-l7-code1"],
          assessmentItemIds: ["quiz-plan-l7-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "plan-l7-h1",
            type: "heading",
            level: 2,
            text: "Anatomi Dokumen Proposal Teknis Berstandar Industri",
          },
          {
            id: "plan-l7-txt1",
            type: "text",
            format: "markdown",
            content:
              "Proposal jaringan bukan sekadar lampiran harga perangkat. Proposal adalah **dokumen komitmen profesional** yang menjembatani bahasa bisnis klien dengan eksekusi teknis lapangan.\n\nStruktur Proposal Jaringan Profesional:\n\n1. **Ringkasan Eksekutif (Executive Summary):** 1 halaman ringkas untuk pengambil keputusan (Direktur/Owner). Berisi tantangan saat ini, solusi yang ditawarkan, total nilai investasi, dan jaminan hasil operasional.\n2. **Latar Belakang & Batasan Pekerjaan (Scope of Work - SOW):** Rincian batasan apa yang dikerjakan dan apa yang TIDAK termasuk dalam tanggung jawab (Out of Scope).\n3. **Arsitektur Teknis:** Diagram topologi fisik (penempatan kabel & rak) dan diagram topologi logis (rute Layer 3, VLAN, dan subnet).\n4. **Rencana Pengalamatan IP & VLAN:** Tabel matriks subnet, gateway, rentang DHCP, dan kebijakan hak akses firewall.\n5. **Bill of Quantities (BoQ) & Garansi:** Daftar perangkat, spesifikasi detail, garansi resmi vendor, dan estimasi waktu penggantian (RMA).\n6. **Jadwal Pelaksanaan Proyek (Project Timeline):** Milestone tahapan pengadaan, penarikan kabel, instalasi rak, konfigurasi, UAT, dan pelatihan staf operasional.",
          },
          {
            id: "plan-l7-callout1",
            type: "callout",
            variant: "info",
            title: "Kiat Menulis Executive Summary",
            content:
              "Hindari istilah teknis yang terlalu rumit di Executive Summary. Alih-alih menulis *'Penerapan 802.1Q trunking dengan encapsulation dot1q'*, tulislah *'Penerapan pemisahan jaringan aman yang melindungi data keuangan perusahaan dari akses tamu publik tanpa biaya perangkat tambahan'*. Klien membayar nilai bisnis, bukan akronim!",
          },
          {
            id: "plan-l7-code1",
            type: "code",
            language: "markdown",
            filename: "struktur-proposal-standar.txt",
            code:
              "PROPOSAL TEKNIS PERANCANGAN INFRASTRUKTUR JARINGAN\nKlien: Kantor Notaris & PPAT H. Suryadi, S.H.\n\nDAFTAR ISI:\n1. EXECUTIVE SUMMARY\n   1.1 Ringkasan Kebutuhan Bisnis\n   1.2 Solusi Nilai Tambah & Rekomendasi\n   1.3 Ringkasan Investasi & Estimasi Waktu\n2. RUANG LINGKUP PEKERJAAN (SCOPE OF WORK)\n   2.1 In-Scope Deliverables\n   2.2 Out-of-Scope Exclusions\n3. DESAIN ARSITEKTUR JARINGAN\n   3.1 Topologi Fisik & Penempatan Rak Server\n   3.2 Topologi Logis & Diagram Inter-VLAN Routing\n4. RENCANA PENGALAMATAN IP & SEGMENTASI KEAMANAN\n5. BILL OF QUANTITIES (BoQ) & SPESIFIKASI PERANGKAT\n6. RENCANA UJI TERIMA (USER ACCEPTANCE TEST - UAT)\n7. JADWAL IMPLEMENTASI (MILESTONE TIMELINE)",
          },
          {
            id: "plan-l7-h2",
            type: "heading",
            level: 2,
            text: "Mendefinisikan Ruang Lingkup: In-Scope vs Out-of-Scope",
          },
          {
            id: "plan-l7-txt2",
            type: "text",
            format: "markdown",
            content:
              "Sengketa proyek sering muncul ketika klien berasumsi konsultan jaringan juga bertanggung jawab memperbaiki printer yang rusak, menginstal ulang Windows, atau memperbaiki genset gedung yang mati.\n\nKonsultan wajib menegaskan batasan:\n* **In-Scope (Dikerjakan):** Pengadaan switch, penarikan kabel data Cat6 hingga faceplate meja, crimping, terminasi patch panel, konfigurasi router/VLAN, uji throughput iperf3, dan serah terima dokumen jaringan.\n* **Out-of-Scope (Tidak Termasuk):** Perbaikan printer rusak, lisensi sistem operasi Windows/Office, perbaikan jalur kelistrikan utama gedung PLN, dan instalasi software aplikasi akuntansi pihak ketiga.",
          },
          {
            id: "plan-l7-callout2",
            type: "callout",
            variant: "tip",
            title: "Protokol Serah Terima & Dokumentasi As-Built",
            content:
              "Setelah implementasi selesai, proposal disempurnakan menjadi dokumen **As-Built Drawing & Network Documentation** yang diserahkan ke klien bersama username/password admin router, label kabel patch panel, dan backup konfigurasi terenkripsi.",
          },
          {
            id: "quiz-plan-l7-q1",
            type: "quiz",
            quizId: "quiz-plan-l7-q1",
            question:
              "Siapakah target pembaca utama dari bagian Ringkasan Eksekutif (Executive Summary) dalam dokumen proposal jaringan?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Teknisi instalasi kabel junior di lapangan.",
              },
              {
                id: "opt-2",
                text: "Pengambil keputusan strategis atau pemilik bisnis (Direktur, Notaris, Finance) yang membutuhkan gambaran nilai bisnis, mitigasi risiko, dan estimasi total investasi.",
              },
              {
                id: "opt-3",
                text: "Customer service dari pihak penyedia layanan internet (ISP).",
              },
              {
                id: "opt-4",
                text: "Pihak produsen pabrik perangkat keras di luar negeri.",
              },
            ],
          },
          {
            id: "quiz-plan-l7-q2",
            type: "quiz",
            quizId: "quiz-plan-l7-q2",
            question:
              "Mengapa klausul Out-of-Scope (Hal yang Tidak Termasuk) wajib dicantumkan secara eksplisit dalam dokumen proposal?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Untuk membatasi ekspektasi klien dan mencegah pembengkakan cakupan kerja sepihak (*scope creep*) tanpa tambahan biaya yang wajar.",
              },
              {
                id: "opt-2",
                text: "Agar konsultan tidak perlu melakukan konfigurasi router.",
              },
              {
                id: "opt-3",
                text: "Hanya untuk memenuhi jumlah minimal halaman dokumen agar terlihat tebal.",
              },
              {
                id: "opt-4",
                text: "Supaya konsultan bisa pulang lebih awal dari jadwal yang ditentukan.",
              },
            ],
          },
          {
            id: "quiz-plan-l7-q3",
            type: "quiz",
            quizId: "quiz-plan-l7-q3",
            question:
              "Manakah pasangan artefak teknis berikut yang wajib sinkron dan tidak boleh saling bertentangan dalam satu dokumen proposal?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Tabel BoQ mencantumkan switch 24-port PoE, namun diagram topologi dan teks narasi menggambarkan switch 8-port unmanaged.",
              },
              {
                id: "opt-2",
                text: "Diagram topologi, tabel IP/VLAN, dan BoQ perangkat yang konsisten dalam jumlah interface, nomor VLAN ID, dan kuantitas perangkat yang dibeli.",
              },
              {
                id: "opt-3",
                text: "Nama klien di halaman depan berbeda dengan nama klien di halaman kesimpulan.",
              },
              {
                id: "opt-4",
                text: "Kabel UTP tercatat 1 meter namun topologi menghubungkan 2 gedung terpisah sejauh 1 kilometer.",
              },
            ],
          },
          {
            id: "plan-l7-summary",
            type: "summary",
            title: "Rangkuman Pelajaran",
            keyPoints: [
              "Proposal jaringan profesional mengintegrasikan Executive Summary yang berorientasi bisnis dengan detail arsitektur teknis yang presisi.",
              "Penegasan Scope of Work (In-Scope vs Out-of-Scope) adalah pelindung legal dan operasional terhadap pembengkakan pekerjaan tak terduga (*scope creep*).",
              "Seluruh elemen teknis (Topologi, Tabel IP/VLAN, BoQ, dan Timeline) wajib saling sinkron dan dapat diverifikasi.",
            ],
          },
          {
            id: "plan-l7-reward",
            type: "reward",
            xp: 60,
            badgeTitle: "Proposal Documentation Specialist",
            message:
              "Hebat! Anda telah menguasai struktur dan teknik penyusunan dokumen proposal proyek jaringan profesional.",
          },
        ],
      },
    },

    // =========================================================================
    // Lesson 8: review-desain-dan-revisi (P6-L08)
    // =========================================================================
    {
      id: "lesson-review-desain-dan-revisi",
      slug: "review-desain-dan-revisi",
      title: "Review Kritis Desain Jaringan & Mitigasi Defisiensi",
      description:
        "Melakukan audit mandiri terhadap proposal menggunakan rubrik evaluasi 5 dimensi (Technical Correctness, Requirements, Cost, Scalability, Security) dan merevisi kegagalan arsitektur kritis.",
      orderIndex: 1,
      estimatedMinutes: 16,
      xpReward: 60,
      prerequisites: ["dokumentasi-teknis-jaringan"],
      outcomes: [
        {
          id: "PLAN-L8-A",
          text: "Siswa dapat melakukan audit kritis terhadap draf proposal jaringan berdasarkan 5 pilar evaluasi independen.",
        },
        {
          id: "PLAN-L8-B",
          text: "Siswa dapat mendeteksi dan merevisi defisiensi kritis seperti ketiadaan gateway, defisit port switch, inkompatibilitas PoE, dan over-budget.",
        },
      ],
      evidence: [
        {
          outcomeId: "PLAN-L8-A",
          teachingBlockIds: ["plan-l8-h1", "plan-l8-txt1", "plan-l8-callout1"],
          activityIds: ["plan-l8-code1"],
          assessmentItemIds: ["quiz-plan-l8-q1", "quiz-plan-l8-q2"],
        },
        {
          outcomeId: "PLAN-L8-B",
          teachingBlockIds: ["plan-l8-h2", "plan-l8-txt2", "plan-l8-callout2"],
          activityIds: ["plan-l8-code1"],
          assessmentItemIds: ["quiz-plan-l8-q3"],
        },
      ],
      content: {
        version: "1.0",
        blocks: [
          {
            id: "plan-l8-h1",
            type: "heading",
            level: 2,
            text: "Rubrik Evaluasi 5 Dimensi Netloka IT Consultant",
          },
          {
            id: "plan-l8-txt1",
            type: "text",
            format: "markdown",
            content:
              "Sebelum mengajukan proposal akhir ke meja klien, seorang konsultan senior selalu melakukan **Quality Assurance & Design Review**.\n\nDi Netloka IT Consultant, proposal dinilai secara deterministik pada 5 pilar dimensi (skor maksimal 20 poin per dimensi, total 100 poin):\n\n1. **Kebenaran Teknis (Technical Correctness - 20 Poin):** Apakah hardware yang dipilih memiliki fungsi gateway router? Apakah port switch cukup untuk semua klien kabel? Apakah daya PoE switch mencukupi kebutuhan seluruh AP?\n2. **Pemenuhan Kebutuhan Klien (Requirement Fulfillment - 20 Poin):** Apakah jumlah Access Point sesuai target cakupan? Apakah kebutuhan khusus (Dual-WAN, Port Gigabit) terpenuhi 100%?\n3. **Efisiensi Anggaran (Cost Efficiency - 20 Poin):** Apakah total BoQ berada di dalam batas pagu anggaran (Within Budget)? Desain terbaik adalah yang memanfaatkan 40% - 95% pagu secara proporsional tanpa over-budget.\n4. **Skalabilitas & Cadangan Kapasitas (Scalability - 20 Poin):** Apakah switch memiliki minimal 20% spare port cadangan untuk ekspansi staf di masa depan?\n5. **Keamanan & Segmentasi (Security & Segmentation - 20 Poin):** Jika klien membutuhkan isolasi departemen, apakah switch yang dipilih berjenis Managed Switch dan dilengkapi tabel alokasi VLAN 802.1Q?",
          },
          {
            id: "plan-l8-callout1",
            type: "callout",
            variant: "warning",
            title: "Aturan Penolakan Fatal (Critical Blocker)",
            content:
              "Ingat aturan emas Netloka: **Budget success cannot conceal missing critical connectivity**. Jika proposal Anda tidak menyertakan Router Gateway atau port switch kurang dari jumlah PC, proposal otomatis DINYATAKAN GAGAL (Passed = False), berapapun skor total yang Anda peroleh!",
          },
          {
            id: "plan-l8-code1",
            type: "code",
            language: "markdown",
            filename: "checklist-audit-proposal.txt",
            code:
              "+-------------------------------------------------------------+-------+\n| Parameter Audit Desain Jaringan                             | Lulus?|\n+-------------------------------------------------------------+-------+\n| 1. Ada Router Gateway dengan port WAN & throughput memadai  |  [V]  |\n| 2. Total port switch >= jumlah PC + AP + Printer + Router   |  [V]  |\n| 3. Switch PoE memiliki power budget (Watt) >= konsumsi AP   |  [V]  |\n| 4. Total biaya BoQ <= Pagu Anggaran Klien (Tidak Over-Budget|  [V]  |\n| 5. Cadangan port switch (spare capacity) >= 20%             |  [V]  |\n| 6. Kebutuhan segmentasi menggunakan Switch Managed 802.1Q   |  [V]  |\n| 7. Tabel alokasi subnet IP dan VLAN bebas overlap           |  [V]  |\n+-------------------------------------------------------------+-------+",
          },
          {
            id: "plan-l8-h2",
            type: "heading",
            level: 2,
            text: "Studi Kasus Revisi: Memperbaiki Proposal yang Cacat",
          },
          {
            id: "plan-l8-txt2",
            type: "text",
            format: "markdown",
            content:
              "Mari pelajari draf proposal yang cacat berikut ini:\n\n* **Kasus:** Klien Kantor Logistik (Pagu Rp 50.000.000, 30 PC staf, 3 AP Wi-Fi, butuh 2 VLAN: Staff dan Guest).\n* **Draf Usulan Awal yang Gagal:**\n  - Item 1: Router SBR 5G (Rp 1.250.000)\n  - Item 2: Switch Unmanaged 16-Port non-PoE x 2 unit (Rp 1.600.000) -> Total 32 Port\n  - Item 3: Access Point Wi-Fi 6 x 3 unit (Rp 4.050.000)\n  - Total Biaya: Rp 6.900.000 (Sangat hemat, hanya 14% dari anggaran).\n* **Hasil Audit:**\n  - **Fatal Defect:** Klien membutuhkan 2 VLAN, namun konsultan memilih Switch Unmanaged! Akibatnya, isolasi VLAN gagal total (Security Score = 0).\n  - **Operational Defect:** AP Wi-Fi 6 tidak mendapatkan pasokan PoE karena switch yang dipilih non-PoE dan tidak ada PoE injector.\n* **Solusi Revisi:**\n  - Ganti kedua switch unmanaged dengan **1 unit Switch Smart Managed 48-Port PoE+ 370W** (Rp 8.500.000). Hasil: Mendukung VLAN 802.1Q sempurna, menyuplai daya ke 3 AP tanpa adaptor tambahan, menyediakan 48 port (spare capacity 35%), dan total biaya Rp 13.800.000 tetap jauh di bawah pagu Rp 50.000.000 (Skor 95+ Lulus Memuaskan!).",
          },
          {
            id: "plan-l8-callout2",
            type: "callout",
            variant: "tip",
            title: "Persiapan Menuju Consultant Workspace",
            content:
              "Dengan menuntaskan seluruh 8 materi di Path 6 ini, Anda kini siap melangkah ke Consultant Workspace untuk menyelesaikan proyek studi kasus nyata (Small Office, Warnet Gaming, Logistik, Sekolah SMK TKJ, dan Gedung Korporat Multi-Lantai).",
          },
          {
            id: "quiz-plan-l8-q1",
            type: "quiz",
            quizId: "quiz-plan-l8-q1",
            question:
              "Sebuah proposal jaringan kantor meraih skor efisiensi biaya maksimal (20/20) dan skalabilitas tinggi (20/20), namun perancang tidak memasukkan Router Gateway ke dalam BoQ. Menurut standar scoring Netloka Consultant, apakah status kelulusan proposal tersebut?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Lulus dengan predikat cumlaude karena anggarannya sangat hemat.",
              },
              {
                id: "opt-2",
                text: "Tidak Lulus (GAGAL), karena ketiadaan Router Gateway merupakan pelanggaran konektivitas esensial kritis yang tidak dapat ditoleransi.",
              },
              {
                id: "opt-3",
                text: "Lulus bersyarat dengan potongan nilai 5 poin saja.",
              },
              {
                id: "opt-4",
                text: "Tergantung apakah klien menyadari ketiadaan router tersebut atau tidak.",
              },
            ],
          },
          {
            id: "quiz-plan-l8-q2",
            type: "quiz",
            quizId: "quiz-plan-l8-q2",
            question:
              "Klien sekolah membutuhkan jaringan untuk 35 komputer laboratorium. Perancang mengusulkan 1 unit switch 24-port dan 1 unit switch 8-port (total 32 port). Apa temuan audit teknis Anda terhadap proposal ini?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Proposal sempurna dan siap dipasang.",
              },
              {
                id: "opt-2",
                text: "Proposal mengalami defisit port fatal: total port (32) lebih sedikit daripada komputer klien (35), belum termasuk port uplink router, sehingga 3+ komputer tidak akan bisa terkoneksi.",
              },
              {
                id: "opt-3",
                text: "Switch 24-port terlalu cepat untuk lingkungan sekolah.",
              },
              {
                id: "opt-4",
                text: "Kabel jaringan sekolah seharusnya menggunakan kabel telepon.",
              },
            ],
          },
          {
            id: "quiz-plan-l8-q3",
            type: "quiz",
            quizId: "quiz-plan-l8-q3",
            question:
              "Jika klien kantor logistik mensyaratkan segmentasi data antara jaringan staf gudang dan jaringan tamu, perbaikan desain manakah yang wajib dilakukan pada pengadaan switch?",
            quizType: "single_choice",
            xpReward: 10,
            options: [
              {
                id: "opt-1",
                text: "Menggunakan Switch Managed yang mendukung tagging IEEE 802.1Q dan mendefinisikan tabel alokasi VLAN ID.",
              },
              {
                id: "opt-2",
                text: "Membeli switch unmanaged berharga murah sebanyak mungkin.",
              },
              {
                id: "opt-3",
                text: "Mematikan fitur Wi-Fi kantor selamanya.",
              },
              {
                id: "opt-4",
                text: "Menyambungkan semua komputer ke satu hub broadcast yang sama.",
              },
            ],
          },
          {
            id: "plan-l8-summary",
            type: "summary",
            title: "Rangkuman Pelajaran",
            keyPoints: [
              "Audit desain jaringan mengevaluasi 5 dimensi: Technical Correctness, Requirements, Cost Efficiency, Scalability, dan Security.",
              "Kegagalan konektivitas kritis (tidak ada router, port kurang dari kebutuhan) otomatis menggugurkan kelulusan proposal tanpa kompromi.",
              "Konsultan handal mampu mengidentifikasi cacat desain, melakukan mitigasi penggantian komponen yang tepat, dan menyajikan proposal yang solid.",
            ],
          },
          {
            id: "plan-l8-reward",
            type: "reward",
            xp: 60,
            badgeTitle: "Master Design Auditor",
            message:
              "Selamat! Anda telah menuntaskan seluruh 8 materi inti persiapan IT Consultant dan siap mendesain proyek jaringan profesional!",
          },
        ],
      },
    },
  ],
};
