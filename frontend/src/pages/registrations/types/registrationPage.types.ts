import type {
  RegistrasiItem,
  StatusKunjungan,
  JenisPembayaran,
  DokterItem,
} from "@/types/registrasi.types.js";
import type { Poli } from "@/types/poli.types.js";
import type { Pasien } from "@/types/pasien.types.js";

export const STATUS_STYLES: Record<StatusKunjungan, { label: string; className: string }> = {
  MENUNGGU: { label: "Menunggu", className: "bg-amber-100 text-amber-800 border-amber-200" },
  CHECK_IN: { label: "Check In", className: "bg-blue-100 text-blue-800 border-blue-200" },
  PEMERIKSAAN: { label: "Pemeriksaan", className: "bg-emerald-100 text-emerald-800 font-semibold border-emerald-200" },
  SELESAI: { label: "Selesai", className: "bg-gray-100 text-gray-700 border-gray-200" },
};

export interface FiltersState {
  search: string;
  dateRange: string;
  selectedPoli: string;
  selectedDoctor: string;
  selectedStatus: string;
  page: number;
}

export interface FormModalState {
  isOpen: boolean;
  pasienId: string;
  poliId: string;
  dokterId: string;
  jenisPembayaran: JenisPembayaran;
  keluhanAwal: string;
  errors: Record<string, string>;
}

export interface ConfirmModalState {
  isOpen: boolean;
  reg: RegistrasiItem | null;
  targetStatus: StatusKunjungan | null;
}

export interface UIState {
  loading: boolean;
  isRefreshing: boolean;
  submitting: boolean;
  callingId: string | null;
  error: string | null;
  successMessage: string | null;
}

export interface RegistrationState {
  registrations: RegistrasiItem[];
  poliList: Poli[];
  doctorList: DokterItem[];
  pasienList: Pasien[];
  filters: FiltersState;
  ui: UIState;
  formModal: FormModalState;
  confirmModal: ConfirmModalState;
  ticketModalData: RegistrasiItem | null;
}

export type RegistrationAction =
  | { type: "SET_REFERENCES"; payload: { poliList: Poli[]; doctorList: DokterItem[]; pasienList: Pasien[] } }
  | { type: "FETCH_REGISTRATIONS_START" }
  | { type: "FETCH_REGISTRATIONS_SUCCESS"; payload: RegistrasiItem[] }
  | { type: "FETCH_REGISTRATIONS_ERROR"; payload: string }
  | { type: "SET_FILTER"; payload: { field: keyof FiltersState; value: any } }
  | { type: "OPEN_CREATE_MODAL" }
  | { type: "CLOSE_CREATE_MODAL" }
  | { type: "OPEN_CONFIRM_MODAL"; payload: { reg: RegistrasiItem; targetStatus: StatusKunjungan } }
  | { type: "CLOSE_CONFIRM_MODAL" }
  | { type: "UPDATE_FORM_FIELD"; payload: { field: keyof FormModalState; value: any } }
  | { type: "SET_FORM_ERRORS"; payload: Record<string, string> }
  | { type: "SUBMIT_START" }
  | { type: "CREATE_REGISTRATION_SUCCESS"; payload: { created: RegistrasiItem; message: string } }
  | { type: "ACTION_SUCCESS"; payload: string }
  | { type: "ACTION_ERROR"; payload: string }
  | { type: "CALL_QUEUE_START"; payload: string }
  | { type: "CLOSE_TICKET_MODAL" }
  | { type: "CLEAR_NOTIFICATIONS" };
