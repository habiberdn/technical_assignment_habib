import { useReducer, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.js";
import api from "@/services/api.js";
import { layoutReducer, initialLayoutState } from "../state/layoutReducer.js";

export function useLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(layoutReducer, initialLayoutState);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        dispatch({ type: "CLOSE_USER_MENU" });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    dispatch({ type: "CLOSE_USER_MENU" });
    dispatch({ type: "CLOSE_MOBILE_SIDEBAR" });
    await logout();
    navigate("/login");
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.oldPassword || !state.newPassword) {
      dispatch({ type: "SUBMIT_PASSWORD_ERROR", error: "Kata sandi lama dan kata sandi baru harus diisi" });
      return;
    }

    if (state.newPassword.length < 6) {
      dispatch({ type: "SUBMIT_PASSWORD_ERROR", error: "Kata sandi baru minimal 6 karakter" });
      return;
    }

    dispatch({ type: "SUBMIT_PASSWORD_START" });
    try {
      await api.patch("/auth/change-password", { oldPassword: state.oldPassword, newPassword: state.newPassword });
      dispatch({ type: "SUBMIT_PASSWORD_SUCCESS" });
      setTimeout(() => {
        dispatch({ type: "CLOSE_CHANGE_PASSWORD" });
      }, 1500);
    } catch (err: any) {
      dispatch({
        type: "SUBMIT_PASSWORD_ERROR",
        error: err.response?.data?.message || "Gagal memperbarui kata sandi",
      });
    }
  };

  return {
    state,
    dispatch,
    user,
    navigate,
    userMenuRef,
    handleLogout,
    handleChangePasswordSubmit
  };
}
