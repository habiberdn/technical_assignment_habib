import { useState, useEffect, type FormEvent } from "react";
import type { RegistrasiItem } from "@/types/registrasi.types.js";
import {
  createPemeriksaanSchema,
  type CreatePemeriksaanDTO,
} from "@/dtos/pemeriksaan.dto.js";

export interface FormSOAPData {
  keluhanSubjective: string;
  tekananSistolik: string;
  tekananDiastolik: string;
  suhuTubuh: string;
  beratBadan: string;
  tinggiBadan: string;
  diagnosa: string;
  rencanaTerapi: string;
  tindakan: { namaTindakan: string; catatan?: string }[];
  resep: {
    namaObat: string;
    dosis: string;
    jumlah: string;
    aturanPakai: string;
  }[];
}

export const initialSOAPData: FormSOAPData = {
  keluhanSubjective: "",
  tekananSistolik: "120",
  tekananDiastolik: "80",
  suhuTubuh: "36.5",
  beratBadan: "60",
  tinggiBadan: "165",
  diagnosa: "",
  rencanaTerapi: "",
  tindakan: [],
  resep: [],
};

const buildSOAPData = (queue: RegistrasiItem): FormSOAPData => {
  if (queue.pemeriksaan) {
    const p = queue.pemeriksaan;
    return {
      keluhanSubjective: p.keluhanSubjective || queue.keluhanAwal || "",
      tekananSistolik: String(p.tekananSistolik ?? 120),
      tekananDiastolik: String(p.tekananDiastolik ?? 80),
      suhuTubuh: String(p.suhuTubuh ?? 36.5),
      beratBadan: String(p.beratBadan ?? 60),
      tinggiBadan: String(p.tinggiBadan ?? 165),
      diagnosa: p.diagnosa || "",
      rencanaTerapi: p.rencanaTerapi || "",
      tindakan: (p.tindakan || []).map((t: { namaTindakan: string; catatan?: string | null }) => ({
        namaTindakan: t.namaTindakan,
        catatan: t.catatan || "",
      })),
      resep: (p.resep || []).map((r: { namaObat: string; dosis: string; jumlah: number; aturanPakai: string }) => ({
        namaObat: r.namaObat,
        dosis: r.dosis,
        jumlah: String(r.jumlah),
        aturanPakai: r.aturanPakai,
      })),
    };
  }
  return {
    ...initialSOAPData,
    keluhanSubjective: queue.keluhanAwal || "",
  };
};

interface UseSOAPFormProps {
  queue: RegistrasiItem;
  submitting: boolean;
  isReadOnly?: boolean;
  onCallQueue?: (queue: RegistrasiItem) => void;
  onSubmit: (payload: CreatePemeriksaanDTO) => void;
}

export const useSOAPForm = ({
  queue,
  submitting,
  isReadOnly = false,
  onCallQueue,
  onSubmit,
}: UseSOAPFormProps) => {
  const [formData, setFormData] = useState<FormSOAPData>(() => buildSOAPData(queue));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(buildSOAPData(queue));
    setErrors({});
  }, [queue]);

  const isWaitingToCall = queue.status === "MENUNGGU" && queue.statusAntrean === "MENUNGGU";

  const handleChange = (field: keyof FormSOAPData, value: unknown) => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddTindakan = () => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => ({
      ...prev,
      tindakan: [...prev.tindakan, { namaTindakan: "", catatan: "" }],
    }));
  };

  const handleRemoveTindakan = (index: number) => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => ({
      ...prev,
      tindakan: prev.tindakan.filter((_, idx) => idx !== index),
    }));
  };

  const handleTindakanChange = (
    index: number,
    field: "namaTindakan" | "catatan",
    val: string,
  ) => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => {
      const updated = [...prev.tindakan];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, tindakan: updated };
    });
  };

  const handleAddResep = () => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => ({
      ...prev,
      resep: [
        ...prev.resep,
        {
          namaObat: "",
          dosis: "3x1",
          jumlah: "10",
          aturanPakai: "Sesudah makan",
        },
      ],
    }));
  };

  const handleRemoveResep = (index: number) => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => ({
      ...prev,
      resep: prev.resep.filter((_, idx) => idx !== index),
    }));
  };

  const handleResepChange = (
    index: number,
    field: "namaObat" | "dosis" | "jumlah" | "aturanPakai",
    val: string,
  ) => {
    if (isReadOnly || isWaitingToCall) return;
    setFormData((prev) => {
      const updated = [...prev.resep];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, resep: updated };
    });
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    if (isReadOnly || isWaitingToCall) return;
    setErrors({});

    const payloadRaw = {
      registrasiId: queue.id,
      keluhanSubjective: formData.keluhanSubjective.trim(),
      tekananSistolik: Number(formData.tekananSistolik),
      tekananDiastolik: Number(formData.tekananDiastolik),
      suhuTubuh: Number(formData.suhuTubuh),
      beratBadan: Number(formData.beratBadan),
      tinggiBadan: Number(formData.tinggiBadan),
      diagnosa: formData.diagnosa.trim(),
      rencanaTerapi: formData.rencanaTerapi.trim(),
      tindakan: formData.tindakan
        .filter((t) => t.namaTindakan.trim().length > 0)
        .map((t) => ({
          namaTindakan: t.namaTindakan.trim(),
          catatan: t.catatan?.trim() || undefined,
        })),
      resep: formData.resep
        .filter((r) => r.namaObat.trim().length > 0)
        .map((r) => ({
          namaObat: r.namaObat.trim(),
          dosis: r.dosis.trim(),
          jumlah: Number(r.jumlah) || 1,
          aturanPakai: r.aturanPakai.trim(),
        })),
    };

    const result = createPemeriksaanSchema.safeParse(payloadRaw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data);
  };

  return {
    formData,
    errors,
    isWaitingToCall,
    handleChange,
    handleAddTindakan,
    handleRemoveTindakan,
    handleTindakanChange,
    handleAddResep,
    handleRemoveResep,
    handleResepChange,
    handleSubmitForm,
  };
};
