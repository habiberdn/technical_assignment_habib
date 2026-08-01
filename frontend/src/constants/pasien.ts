import type { JenisKelamin } from "@/types/pasien.types.js";

export interface PasienFormData {
  nik: string;
  nama: string;
  jenisKelamin: JenisKelamin;
  tanggalLahir: string;
  noTelepon: string;
  alamat: string;
}

export const INITIAL_PASIEN_FORM_DATA: PasienFormData = {
  nik: "",
  nama: "",
  jenisKelamin: "LAKI_LAKI",
  tanggalLahir: "",
  noTelepon: "",
  alamat: "",
};

export const JENIS_KELAMIN_OPTIONS: { value: JenisKelamin; label: string }[] = [
  { value: "LAKI_LAKI", label: "Laki-laki" },
  { value: "PEREMPUAN", label: "Perempuan" },
];

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

export const PASIEN_CSV_TEMPLATE = {
  fileName: "Template_Import_Pasien.csv",
  content:
    "\uFEFF" +
    "NIK;Nama Pasien;Jenis Kelamin;Tanggal Lahir;No. Telepon;Alamat\n" +
    "3201234567890001;Budi Santoso;Laki-laki;1992-05-14;081234567890;Jl. Merdeka No. 10 Jakarta\n" +
    "3201234567890002;Siti Aminah;Perempuan;1995-08-20;081987654321;Jl. Mawar No. 5 Bandung\n",
};
