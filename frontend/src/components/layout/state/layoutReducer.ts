export interface LayoutState {
  isUserMenuOpen: boolean;
  isMobileSidebarOpen: boolean;
  isChangePasswordOpen: boolean;
  oldPassword: string;
  newPassword: string;
  passwordError: string;
  passwordSuccess: string;
  isSubmittingPassword: boolean;
}

export type LayoutAction =
  | { type: "TOGGLE_USER_MENU" }
  | { type: "CLOSE_USER_MENU" }
  | { type: "TOGGLE_MOBILE_SIDEBAR" }
  | { type: "CLOSE_MOBILE_SIDEBAR" }
  | { type: "OPEN_CHANGE_PASSWORD" }
  | { type: "CLOSE_CHANGE_PASSWORD" }
  | { type: "SET_FIELD"; field: "oldPassword" | "newPassword"; value: string }
  | { type: "SUBMIT_PASSWORD_START" }
  | { type: "SUBMIT_PASSWORD_SUCCESS" }
  | { type: "SUBMIT_PASSWORD_ERROR"; error: string };

export const initialLayoutState: LayoutState = {
  isUserMenuOpen: false,
  isMobileSidebarOpen: false,
  isChangePasswordOpen: false,
  oldPassword: "",
  newPassword: "",
  passwordError: "",
  passwordSuccess: "",
  isSubmittingPassword: false,
};

export function layoutReducer(state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case "TOGGLE_USER_MENU":
      return { ...state, isUserMenuOpen: !state.isUserMenuOpen };
    case "CLOSE_USER_MENU":
      return { ...state, isUserMenuOpen: false };
    case "TOGGLE_MOBILE_SIDEBAR":
      return { ...state, isMobileSidebarOpen: !state.isMobileSidebarOpen };
    case "CLOSE_MOBILE_SIDEBAR":
      return { ...state, isMobileSidebarOpen: false };
    case "OPEN_CHANGE_PASSWORD":
      return {
        ...state,
        isUserMenuOpen: false,
        isChangePasswordOpen: true,
        passwordError: "",
        passwordSuccess: "",
        oldPassword: "",
        newPassword: "",
      };
    case "CLOSE_CHANGE_PASSWORD":
      return { ...state, isChangePasswordOpen: false, passwordError: "", passwordSuccess: "" };
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SUBMIT_PASSWORD_START":
      return { ...state, isSubmittingPassword: true, passwordError: "", passwordSuccess: "" };
    case "SUBMIT_PASSWORD_SUCCESS":
      return {
        ...state,
        isSubmittingPassword: false,
        passwordSuccess: "Kata sandi berhasil diperbarui!",
        oldPassword: "",
        newPassword: "",
      };
    case "SUBMIT_PASSWORD_ERROR":
      return { ...state, isSubmittingPassword: false, passwordError: action.error };
    default:
      return state;
  }
}
