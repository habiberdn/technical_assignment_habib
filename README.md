# 🏥 Sistem Informasi Manajemen Rumah Sakit / Klinik (SIMRS)

Aplikasi SIMRS terpadu berarsitektur decoupled (Monorepo) yang memisahkan **Backend REST API** (Express.js + Prisma ORM + PostgreSQL) dan **Frontend Web Application** (Vite + React + TypeScript + Tailwind CSS).

Aplikasi ini mendukung alur operasional klinik lengkap, meliputi:
- **Autentikasi & Otorisasi Berbasis Role (RBAC)**: Admin, Petugas Pendaftaran, dan Dokter (DPJP).
- **Manajemen Data Pasien**: Pendaftaran pasien baru, pencarian rekam medis, dan update profil.
- **Registrasi & Antrean Poli**: Pendaftaran antrean pasien, pemanggilan antrean loket & poli, serta kontrol status kunjungan.
- **Pemeriksaan Medis (SOAP)**: Penginputan rekam medis (Subjektif, Objektif, Asesmen, Plan/Resep) oleh Dokter DPJP.
- **Manajemen Akun Staff**: Pengelolaan akun staff klinik oleh Administrator.

---

## 📂 Struktur Project

```text
technical_maganghub/
├── backend/                # Server REST API Express.js + Prisma ORM + PostgreSQL
│   ├── controllers/        # Express Route Controllers (Handler Request/Response)
│   ├── dtos/               # Validasi Skema Data Zod (Data Transfer Objects)
│   ├── lib/                # Inisialisasi Prisma Client & Database Connection
│   ├── middlewares/        # Express Middlewares (Auth JWT, Error Handler, Rate Limiter, XSS)
│   ├── prisma/             # Skema Database, File Migrasi, & Seeder
│   │   ├── migrations/     # Riwayat Migrasi Tabel Database PostgreSQL
│   │   ├── schema.prisma   # Definisi Model Data Prisma
│   │   └── seed.ts         # Script Seeder Data Awal (Default Users & Poli)
│   ├── routes/             # Definisi Endpoint API (Auth, Pasien, Registrasi, Pemeriksaan, dsb)
│   ├── services/           # Logika Bisnis Utama (Business Logic Layer)
│   ├── utils/              # Helper utilities (JWT Token, Password Hash)
│   ├── .env                # File Environment Backend (Lokal)
│   ├── .env.example        # Template File Environment Backend
│   ├── app.ts              # Express App setup & Middleware Registration
│   └── server.ts           # Entry point penjalankan HTTP Server
│
├── frontend/               # Single Page Application Client (Vite + React + TypeScript)
│   ├── src/
│   │   ├── assets/         # Asset Statis (SVG, Gambar)
│   │   ├── components/     # Komponen Reusable UI & Layout Utama
│   │   ├── constants/      # Konstanta Navigasi & Style Role Badges
│   │   ├── context/        # React Context (Auth Context State)
│   │   ├── dtos/           # Skema Validasi Client (Zod)
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── pages/          # Halaman Aplikasi (Auth, Dashboard, Pasien, Registrasi, Periksa, Staff)
│   │   ├── services/       # Service Client API Axios
│   │   └── types/          # Definisi Tipe TypeScript
│   ├── index.html          # HTML Entry point
│   └── vite.config.ts      # Konfigurasi Build Vite
│
└── README.md               # Dokumentasi Lengkap Instalasi & Penggunaan
```

---

## 🛠️ Prasyarat Sistem & Instalasi `pnpm`

Aplikasi ini menggunakan **PNPM** sebagai package manager resmi.

### 1. Prasyarat Sistem
- **Node.js**: v18.0.0 atau yang lebih baru.
- **PostgreSQL**: v14.0 atau yang lebih baru (pastikan service PostgreSQL sudah berjalan di lokal/server).

### 2. Instalasi `pnpm` (Jika Belum Ada)
Jika sistem Anda belum memiliki `pnpm`, Anda dapat menginstalnya melalui salah satu cara berikut:

* **Menggunakan `npm`**:
  ```bash
  npm install -g pnpm
  ```

* **Menggunakan Corepack (Bawaan Node.js)**:
  ```bash
  corepack enable
  corepack prepare pnpm@latest --activate
  ```

* **Memverifikasi Instalasi `pnpm`**:
  ```bash
  pnpm --version
  ```

---

## ⚙️ Konfigurasi File `.env`

Aplikasi ini mengikuti prinsip keamanan di mana **variabel sensitif (URL Database, Secret Key JWT, Port)** **TIDAK DI-HARDCODE** ke dalam source code maupun repository.

Di dalam folder `backend/` tersedia file `.env.example` sebagai referensi.

### Langkah Konfigurasi Environment Backend:
1. Masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Buat file `.env` dengan menyalin `backend/.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Sesuaikan isi file `.env` di folder `backend`:
   ```env
   # SERVER CONFIGURATION
   PORT=3000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173

   # DATABASE CONFIGURATION (PostgreSQL Connection String)
   DATABASE_URL="postgresql://postgres:password_db_anda@localhost:5432/mini_clinic"

   # JWT AUTHENTICATION CONFIGURATION
   JWT_SECRET="ganti_dengan_jwt_secret_unik_anda_2026"
   JWT_EXPIRES_IN="1d"
   ```

---

## 📦 Cara Instalasi Aplikasi

Jalankan perintah penginstalan dependensi pada masing-masing direktori (`backend` dan `frontend`):

### 1. Install Dependensi Backend
```bash
cd backend
pnpm install
```

### 2. Install Dependensi Frontend
```bash
cd ../frontend
pnpm install
```

---

## 🗄️ Cara Melakukan Migrasi & Seeding Database

Pastikan service database PostgreSQL Anda sudah aktif dan database (misal: `mini_clinic`) sudah dibuat di PostgreSQL.

### 1. Jalankan Migrasi Database (Prisma)
Buka terminal pada folder `backend`, lalu jalankan migrasi untuk membuat tabel-tabel database secara otomatis:
```bash
cd backend
pnpm exec prisma migrate dev
```
*(Atau gunakan `pnpm exec prisma migrate deploy` jika dijalankan pada lingkungan produksi).*

### 2. Jalankan Data Seeder Awal
Untuk mengisi data awal yang diperlukan (seperti Poli Umum dan akun pengguna default), jalankan perintah:
```bash
pnpm run db:seed
```

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi dijalankan dalam 2 proses terpisah (Backend Server & Frontend Client).

### 1. Menjalankan Backend Server
Buka terminal pertama:
```bash
cd backend
pnpm run dev
```
Backend REST API akan berjalan pada: **`http://localhost:3000`**

### 2. Menjalankan Frontend Web Client
Buka terminal kedua:
```bash
cd frontend
pnpm run dev
```
Frontend Web Client akan berjalan pada: **`http://localhost:5173`**

---

## 🔐 Akun Login (Default Seeder Data)

Setelah menjalankan `pnpm run db:seed`, Anda dapat menggunakan akun default berikut untuk masuk ke dalam aplikasi:

| Role Akses | Username | Password Default | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `password123` | Akses penuh sistem, Manajemen Akun Staff, Poliklinik, & Monitoring Rekam Medis |
| **Petugas Pendaftaran** | `petugas` | `password123` | Registrasi Pasien Baru, Pendaftaran Antrean Poli, & Panggil Antrean Loket |
| **Dokter (DPJP)** | `dokter` | `password123` | Pemanggilan Pasien Poli, Penginputan Rekam Medis (SOAP), & Penulisan Resep Obat |

---

> 🔒 **Catatan Keamanan**: Selalu ubah `JWT_SECRET` dan password akun default sebelum mendeploy aplikasi ke lingkungan produksi.
