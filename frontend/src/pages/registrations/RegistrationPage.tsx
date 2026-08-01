import React, { useReducer, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Printer, RefreshCw, AlertCircle, CheckCircle2, X, Volume2 } from "lucide-react";

import { registrasiService } from "@/services/registrasiService.js";
import { poliService } from "@/services/poliService.js";
import { pasienService } from "@/services/pasienService.js";
import type { RegistrasiItem, StatusKunjungan } from "@/types/registrasi.types.js";
import { createRegistrasiSchema } from "@/dtos/registrasi.dto.js";

import { getInitialRegistrationState, registrationReducer } from "./state/registrationReducer.js";
import type { FiltersState, FormModalState } from "./types/registrationPage.types.js";

import { RegistrationFilterToolbar } from "./components/RegistrationFilterToolbar.js";
import { RegistrationTable } from "./components/RegistrationTable.js";
import { RegistrationFormModal } from "./components/RegistrationFormModal.js";
import { TicketModal } from "./components/TicketModal.js";
import { ConfirmStatusModal } from "./components/ConfirmStatusModal.js";

export const RegistrationPage: React.FC = () => {
  const [state, dispatch] = useReducer(registrationReducer, undefined, getInitialRegistrationState);
  const location = useLocation();

  const {
    registrations,
    poliList,
    doctorList,
    pasienList,
    filters,
    ui,
    formModal,
    confirmModal,
    ticketModalData,
  } = state;
  const limit = 10;

  // Fetch Initial Reference Data (Poli, Dokter, Pasien)
  useEffect(() => {
    let isMounted = true;
    const fetchReferencesData = async () => {
      try {
        const [polis, doctors, pasiens] = await Promise.all([
          poliService.getAllPoli(),
          registrasiService.getDoctors(),
          pasienService.getPasienList({ limit: 500 }),
        ]);
        if (isMounted) {
          dispatch({
            type: "SET_REFERENCES",
            payload: { poliList: polis, doctorList: doctors, pasienList: pasiens.data || [] },
          });
        }
      } catch (err) {
        console.error("[Fetch references error]", err);
      }
    };

    fetchReferencesData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Registration List Data
  const fetchRegistrations = useCallback(async () => {
    dispatch({ type: "FETCH_REGISTRATIONS_START" });
    try {
      const params: any = {
        tanggalKunjungan: filters.dateRange,
      };

      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.selectedPoli !== "all") params.poliId = filters.selectedPoli;
      if (filters.selectedDoctor !== "all") params.dokterId = filters.selectedDoctor;
      if (filters.selectedStatus !== "all") params.status = filters.selectedStatus;

      const data = await registrasiService.getRegistrasiList(params);
      dispatch({ type: "FETCH_REGISTRATIONS_SUCCESS", payload: data });
    } catch (err: any) {
      console.error("[Fetch registrations error]", err);
      dispatch({
        type: "FETCH_REGISTRATIONS_ERROR",
        payload: "Tidak dapat memuat daftar pendaftaran & antrean. Sesi login Anda mungkin telah berakhir atau koneksi internet terganggu. Silakan muat ulang halaman.",
      });
    }
  }, [filters.dateRange, filters.search, filters.selectedPoli, filters.selectedDoctor, filters.selectedStatus]);

  useEffect(() => {
    let isMounted = true;
    const loadRegistrations = async () => {
      if (isMounted) {
        await fetchRegistrations();
      }
    };
    loadRegistrations();
    return () => {
      isMounted = false;
    };
  }, [fetchRegistrations]);

  // Open Modal from Navigation State (Sidebar "+ Pendaftaran Baru" Button)
  useEffect(() => {
    if (location.state && (location.state as any).openCreateModal) {
      const timer = setTimeout(() => {
        dispatch({ type: "OPEN_CREATE_MODAL" });
        window.history.replaceState({}, document.title);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Handlers for Filters & Form Updates
  const handleFilterChange = (field: keyof FiltersState, value: any) => {
    dispatch({ type: "SET_FILTER", payload: { field, value } });
  };

  const handleFormFieldChange = (field: keyof FormModalState, value: any) => {
    dispatch({ type: "UPDATE_FORM_FIELD", payload: { field, value } });
  };

  // Submit Handler for Pendaftaran Baru with Zod Validation
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      pasienId: formModal.pasienId,
      poliId: formModal.poliId,
      dokterId: formModal.dokterId,
      jenisPembayaran: formModal.jenisPembayaran,
      keluhanAwal: formModal.keluhanAwal.trim(),
      tanggalKunjungan: new Date(filters.dateRange),
    };

    const validationResult = createRegistrasiSchema.safeParse(payload);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      dispatch({ type: "SET_FORM_ERRORS", payload: fieldErrors });
      return;
    }

    try {
      dispatch({ type: "SUBMIT_START" });

      const created = await registrasiService.createRegistrasi({
        pasienId: formModal.pasienId,
        poliId: formModal.poliId,
        dokterId: formModal.dokterId,
        jenisPembayaran: formModal.jenisPembayaran,
        keluhanAwal: formModal.keluhanAwal.trim(),
        tanggalKunjungan: new Date(filters.dateRange),
      });

      dispatch({
        type: "CREATE_REGISTRATION_SUCCESS",
        payload: {
          created,
          message: `Pendaftaran berhasil! Nomor Antrean: ${created.nomorAntrean}`,
        },
      });

      await fetchRegistrations();
    } catch (err: any) {
      console.error("[Create registrasi error]", err);
      const msg = err.response?.data?.message || "Tidak dapat mendaftarkan pasien. Silakan periksa kembali isian formulir.";
      dispatch({ type: "ACTION_ERROR", payload: msg });
    }
  };

  // Action: Call Queue Item
  const handleCallQueue = async (reg: RegistrasiItem) => {
    try {
      dispatch({ type: "CALL_QUEUE_START", payload: reg.id });
      await registrasiService.panggilAntrean(reg.id);
      dispatch({
        type: "ACTION_SUCCESS",
        payload: `Nomor Antrean '${reg.nomorAntrean}' (${reg.pasien?.nama}) dipanggil!`,
      });
      await fetchRegistrations();
    } catch (err: any) {
      console.error("[Call queue error]", err);
      const msg = err.response?.data?.message || "Tidak dapat memanggil antrean saat ini. Silakan coba beberapa saat lagi.";
      dispatch({ type: "ACTION_ERROR", payload: msg });
    }
  };

  // Action: Call Next Queue
  const handleCallNextQueue = async () => {
    const poliId = filters.selectedPoli !== "all" ? filters.selectedPoli : poliList[0]?.id;
    if (!poliId) {
      dispatch({
        type: "ACTION_ERROR",
        payload: "Silakan pilih Poliklinik terlebih dahulu untuk memanggil antrean berikutnya.",
      });
      return;
    }

    try {
      dispatch({ type: "SUBMIT_START" });
      const called = await registrasiService.panggilNextAntrean(
        poliId,
        filters.selectedDoctor !== "all" ? filters.selectedDoctor : undefined
      );
      dispatch({
        type: "ACTION_SUCCESS",
        payload: `Antrean berikutnya '${called.nomorAntrean}' (${called.pasien?.nama}) berhasil dipanggil!`,
      });
      await fetchRegistrations();
    } catch (err: any) {
      console.error("[Call next queue error]", err);
      const msg = err.response?.data?.message || "Tidak ada antrean berstatus MENUNGGU pada poli ini.";
      dispatch({ type: "ACTION_ERROR", payload: msg });
    }
  };

  // Trigger Confirmation Modal for Status Updates
  const handleRequestStatusChange = (reg: RegistrasiItem, targetStatus: StatusKunjungan) => {
    // If targetStatus is SELESAI or CHECK_IN, trigger confirmation modal for safety
    dispatch({ type: "OPEN_CONFIRM_MODAL", payload: { reg, targetStatus } });
  };

  // Execute Confirmed Status Change
  const handleConfirmStatusChange = async () => {
    if (!confirmModal.reg || !confirmModal.targetStatus) return;

    const { reg, targetStatus } = confirmModal;

    try {
      dispatch({ type: "SUBMIT_START" });
      await registrasiService.updateStatus(reg.id, { status: targetStatus });
      dispatch({
        type: "ACTION_SUCCESS",
        payload: `Status kunjungan untuk '${reg.pasien?.nama}' (${reg.nomorAntrean}) berhasil diperbarui ke '${targetStatus}'`,
      });
      await fetchRegistrations();
    } catch (err: any) {
      console.error("[Update status error]", err);
      const msg = err.response?.data?.message || "Tidak dapat memperbarui status kunjungan pasien. Silakan coba kembali.";
      dispatch({ type: "ACTION_ERROR", payload: msg });
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(registrations.length / limit) || 1;
  const paginatedRegistrations = registrations.slice(
    (filters.page - 1) * limit,
    filters.page * limit
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Pendaftaran &amp; Antrean Poli</h1>
          <p className="text-xs text-gray-500 sm:text-sm">
            Kelola pendaftaran pasien, pencetakan tiket antrean, dan alur pelayanan medis real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchRegistrations}
            disabled={ui.isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={14} className={ui.isRefreshing ? "animate-spin text-emerald-600" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleCallNextQueue}
            disabled={ui.submitting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-xs hover:bg-emerald-100 disabled:opacity-50 transition-colors"
          >
            <Volume2 size={15} />
            Panggil Next
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors"
          >
            <Printer size={15} className="text-gray-500" />
            Cetak Jadwal
          </button>
        </div>
      </div>

      {/* Notifications */}
      {ui.error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{ui.error}</span>
          </div>
          <button
            onClick={() => dispatch({ type: "CLEAR_NOTIFICATIONS" })}
            className="rounded-md p-1 text-red-600 hover:bg-red-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {ui.successMessage && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-700 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
            <span>{ui.successMessage}</span>
          </div>
          <button
            onClick={() => dispatch({ type: "CLEAR_NOTIFICATIONS" })}
            className="rounded-md p-1 text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <RegistrationFilterToolbar
        filters={filters}
        poliList={poliList}
        doctorList={doctorList}
        onFilterChange={handleFilterChange}
      />

      {/* Main Table / Mobile Card List */}
      {ui.loading ? (
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-xs text-gray-400 shadow-xs">
          <div className="flex justify-center items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
            Memuat data pendaftaran &amp; antrean...
          </div>
        </div>
      ) : registrations.length === 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-xs text-gray-400 shadow-xs">
          Belum ada pendaftaran pasien untuk kriteria filter ini.
        </div>
      ) : (
        <RegistrationTable
          registrations={registrations}
          paginatedRegistrations={paginatedRegistrations}
          callingId={ui.callingId}
          page={filters.page}
          totalPages={totalPages}
          onCallQueue={handleCallQueue}
          onUpdateStatus={handleRequestStatusChange}
          onPageChange={(page) => handleFilterChange("page", page)}
        />
      )}

      {/* Modal Form Pendaftaran Baru */}
      <RegistrationFormModal
        formModal={formModal}
        poliList={poliList}
        doctorList={doctorList}
        pasienList={pasienList}
        submitting={ui.submitting}
        onClose={() => dispatch({ type: "CLOSE_CREATE_MODAL" })}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleCreateSubmit}
      />

      {/* Ticket Modal After Success Registration */}
      <TicketModal
        ticketModalData={ticketModalData}
        onClose={() => dispatch({ type: "CLOSE_TICKET_MODAL" })}
      />

      {/* Confirm Status Change Modal (Accidental Click Guard) */}
      <ConfirmStatusModal
        isOpen={confirmModal.isOpen}
        reg={confirmModal.reg}
        targetStatus={confirmModal.targetStatus}
        submitting={ui.submitting}
        onClose={() => dispatch({ type: "CLOSE_CONFIRM_MODAL" })}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
};

export default RegistrationPage;