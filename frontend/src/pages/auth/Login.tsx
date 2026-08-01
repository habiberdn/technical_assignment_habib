import { isAxiosError } from "axios";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, LogIn, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext.js";
import api from "@/services/api.js";

export function LoginPage() {
  const navigate = useNavigate();
  const { checkAuth, login: setAuthUser } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage("Username atau Email wajib diisi.");
      return;
    }
    if (!password.trim()) {
      setErrorMessage("Password wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post("/auth/login", {
        username: identifier.trim(),
        password,
      });

      if (res.data && res.data.data) {
        setAuthUser(res.data.data.user || res.data.data);
      } else {
        await checkAuth();
      }

      navigate("/", { replace: true });
    } catch (err: unknown) {
      if (!isAxiosError(err) || !err.response) {
        // Server Mati / Tidak Ada Internet
        setErrorMessage("Tidak dapat terhubung ke server. Pastikan koneksi internet Anda stabil dan coba lagi.");
      } else if (err.response.data?.errors && Array.isArray(err.response.data.errors)) {
        // Validation Error dari Backend (Zod)
        const validationMsg = err.response.data.errors
          .map((e: { message: string }) => e.message)
          .join(", ");
        setErrorMessage(validationMsg);
      } else {
        // Error pesan umum dari Backend (misal: 401 Credential Invalid, 429 Rate Limit)
        setErrorMessage(err.response.data?.message || "Username atau password yang Anda masukkan tidak sesuai. Silakan periksa kembali.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-y-auto bg-linear-to-br from-[#f2f4f3] via-[#eef4f2] to-[#d9ece6] px-4 py-8 sm:p-6">
      <div className="relative w-full max-w-sm rounded-2xl bg-white/90 p-6 shadow-xl shadow-black/5 backdrop-blur sm:p-8">
        {/* Brand lockup */}
        <div className="mb-5 flex items-center justify-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0d6d64]">
            <Plus className="h-4 w-4 text-white" strokeWidth={3} />
          </span>
          <span className="text-sm font-semibold text-[#0d6d64]">MediKlinik</span>
        </div>

        <h1 className="text-center text-xl font-bold text-[#0d6d64]">MediKlinik SIMRS</h1>
        <p className="mt-1 text-center text-xs font-medium tracking-wide text-[#0d6d64]/70">
          Sistem Presisi Klinis
        </p>

        {errorMessage && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="identifier" className="mb-1 block text-xs font-semibold text-[#8a4a43]">
              Username atau Email
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Masukkan username atau email"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-base text-gray-800 placeholder:text-gray-400 focus:border-[#0d6d64] focus:outline-none focus:ring-2 focus:ring-[#0d6d64]/20 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="block text-xs font-semibold text-[#8a4a43]">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-10 text-base text-gray-800 placeholder:text-gray-400 focus:border-[#0d6d64] focus:outline-none focus:ring-2 focus:ring-[#0d6d64]/20 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0d6d64] py-3 text-sm font-semibold text-white transition hover:bg-[#0a544e] disabled:cursor-not-allowed disabled:opacity-60 sm:py-2.5"
          >
            <LogIn className="h-4 w-4" />
            {isSubmitting ? "Memproses..." : "Masuk ke Sistem"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default LoginPage;