import type {
  RegistrationState,
  RegistrationAction,
} from "../types/registrationPage.types.js";

export const getInitialRegistrationState = (): RegistrationState => {
  const today = new Date().toISOString().split("T")[0];
  return {
    registrations: [],
    poliList: [],
    doctorList: [],
    pasienList: [],
    filters: {
      search: "",
      dateRange: today,
      selectedPoli: "all",
      selectedDoctor: "all",
      selectedStatus: "all",
      page: 1,
    },
    ui: {
      loading: true,
      isRefreshing: false,
      submitting: false,
      callingId: null,
      error: null,
      successMessage: null,
    },
    formModal: {
      isOpen: false,
      pasienId: "",
      poliId: "",
      dokterId: "",
      jenisPembayaran: "UMUM",
      keluhanAwal: "",
      errors: {},
    },
    ticketModalData: null,
  };
};

export function registrationReducer(
  state: RegistrationState,
  action: RegistrationAction
): RegistrationState {
  switch (action.type) {
    case "SET_REFERENCES":
      return {
        ...state,
        poliList: action.payload.poliList,
        doctorList: action.payload.doctorList,
        pasienList: action.payload.pasienList,
      };

    case "FETCH_REGISTRATIONS_START":
      return {
        ...state,
        ui: { ...state.ui, isRefreshing: true, error: null },
      };

    case "FETCH_REGISTRATIONS_SUCCESS":
      return {
        ...state,
        registrations: action.payload,
        ui: { ...state.ui, loading: false, isRefreshing: false },
      };

    case "FETCH_REGISTRATIONS_ERROR":
      return {
        ...state,
        ui: { ...state.ui, loading: false, isRefreshing: false, error: action.payload },
      };

    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.field]: action.payload.value,
          ...(action.payload.field !== "page" ? { page: 1 } : {}),
        },
      };

    case "OPEN_CREATE_MODAL":
      return {
        ...state,
        formModal: {
          isOpen: true,
          pasienId: "",
          poliId: state.poliList.length > 0 ? state.poliList[0].id : "",
          dokterId: "",
          jenisPembayaran: "UMUM",
          keluhanAwal: "",
          errors: {},
        },
      };

    case "CLOSE_CREATE_MODAL":
      return {
        ...state,
        formModal: { ...state.formModal, isOpen: false, errors: {} },
      };

    case "UPDATE_FORM_FIELD":
      return {
        ...state,
        formModal: {
          ...state.formModal,
          [action.payload.field]: action.payload.value,
          errors: { ...state.formModal.errors, [action.payload.field]: "" },
        },
      };

    case "SET_FORM_ERRORS":
      return {
        ...state,
        formModal: { ...state.formModal, errors: action.payload },
      };

    case "SUBMIT_START":
      return {
        ...state,
        ui: { ...state.ui, submitting: true, error: null },
      };

    case "CREATE_REGISTRATION_SUCCESS":
      return {
        ...state,
        formModal: { ...state.formModal, isOpen: false, errors: {} },
        ticketModalData: action.payload.created,
        ui: { ...state.ui, submitting: false, successMessage: action.payload.message },
      };

    case "ACTION_SUCCESS":
      return {
        ...state,
        ui: { ...state.ui, submitting: false, callingId: null, successMessage: action.payload },
      };

    case "ACTION_ERROR":
      return {
        ...state,
        ui: { ...state.ui, submitting: false, callingId: null, error: action.payload },
      };

    case "CALL_QUEUE_START":
      return {
        ...state,
        ui: { ...state.ui, callingId: action.payload, error: null },
      };

    case "CLOSE_TICKET_MODAL":
      return {
        ...state,
        ticketModalData: null,
      };

    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        ui: { ...state.ui, error: null, successMessage: null },
      };

    default:
      return state;
  }
}
