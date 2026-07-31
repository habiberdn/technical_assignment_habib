import type { Pasien } from "../types/pasien.types.js";

/**
 * Utility untuk mengeksport data Pasien ke file Excel (.xls)
 * Menggunakan format HTML Table dengan mso-number-format agar NIK & No Telepon
 * tidak terpotong atau terkonversi ke notasi ilmiah oleh Microsoft Excel.
 */
export function exportPasienToExcel(pasienList: Pasien[], fileName = "Data_Pasien_MediKlinik.xls"): void {
  if (!pasienList || pasienList.length === 0) {
    alert("Tidak ada data pasien yang dapat dieksport.");
    return;
  }

  const rowsHtml = pasienList
    .map(
      (p) => `
    <tr>
      <td style="mso-number-format:'\\@'; font-weight: bold;">${p.noRekamMedis || "-"}</td>
      <td style="mso-number-format:'\\@'">${p.nik || "-"}</td>
      <td>${p.nama || "-"}</td>
      <td>${p.jenisKelamin === "LAKI_LAKI" ? "Laki-laki" : "Perempuan"}</td>
      <td>${p.tanggalLahir ? new Date(p.tanggalLahir).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-"}</td>
      <td style="mso-number-format:'\\@'">${p.noTelepon || "-"}</td>
      <td>${p.alamat || "-"}</td>
    </tr>`
    )
    .join("");

  const excelHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Data Pasien SIMRS</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #0d6d64; color: #ffffff; padding: 10px; border: 1px solid #0a544e; text-align: left; }
        td { padding: 8px; border: 1px solid #e2e8f0; vertical-align: top; }
      </style>
    </head>
    <body>
      <h2>Data Master Pasien - MediKlinik SIMRS</h2>
      <p>Tanggal Eksport: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
      <table>
        <thead>
          <tr>
            <th>No. Rekam Medis</th>
            <th>NIK</th>
            <th>Nama Pasien</th>
            <th>Jenis Kelamin</th>
            <th>Tanggal Lahir</th>
            <th>No. Telepon</th>
            <th>Alamat</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </body>
  </html>`;

  const blob = new Blob([excelHtml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
