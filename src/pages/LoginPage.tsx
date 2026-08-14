import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

import { login } from "../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await login({
        email,
        password,
      });

      localStorage.setItem("token", data.accessToken);

      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);

      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* ================================= */}
        {/* LEFT - LOGIN FORM */}
        {/* ================================= */}

        <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-md">
            {/* LOGO */}
            <div className="mb-10">
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-[#F56600]">
                  WARUNGKU
                </h1>

                <p className="mt-1 text-sm text-[#806E60]">
                  Kitchen Order Management
                </p>
              </div>

              <h2 className="text-3xl font-bold text-[#231812]">
                Selamat datang kembali
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#806E60]">
                Masuk ke akun kamu untuk mengelola pesanan dan operasional
                restoran.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#231812]"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A49487]"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email"
                    autoComplete="email"
                    required
                    className="h-12 w-full rounded-xl border border-[#EAE4DC] bg-white pl-11 pr-4 text-sm text-[#231812] outline-none transition placeholder:text-[#B8AAA0] focus:border-[#F56600] focus:ring-4 focus:ring-[#F56600]/10"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-[#231812]"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A49487]"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    required
                    className="h-12 w-full rounded-xl border border-[#EAE4DC] bg-white pl-11 pr-12 text-sm text-[#231812] outline-none transition placeholder:text-[#B8AAA0] focus:border-[#F56600] focus:ring-4 focus:ring-[#F56600]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#806E60] transition hover:bg-[#FAF7F3] hover:text-[#F56600]"
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-600">{error}</p>
                </div>
              )}

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex h-12 w-full items-center justify-center rounded-xl bg-[#F56600] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#DD5A00] focus:outline-none focus:ring-4 focus:ring-[#F56600]/20 disabled:cursor-not-allowed disabled:bg-[#FDBA74]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  "Masuk"
                )}
              </button>
            </form>

            {/* FOOTER */}
            <p className="mt-8 text-center text-xs text-[#A49487]">
              © 2026 Warung Jingga. All rights reserved.
            </p>
          </div>
        </div>

        <div className="relative hidden min-h-screen overflow-hidden lg:block">

          {/* ORANGE OVERLAY */}
          <div className="absolute inset-0 bg-[#F56600]/70" />

          {/* GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#231812]/80 via-transparent to-[#231812]/20" />

          {/* CONTENT */}
          <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
            {/* TOP */}
            <div>
              <div className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm font-medium text-white">
                  Warungku POS System
                </span>
              </div>
            </div>

            {/* BOTTOM */}
            <div className="max-w-xl text-white">
              <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
                Kelola pesanan
                <br />
                lebih mudah.
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-white/85">
                Satu tempat untuk mengelola pesanan, meja, pembayaran, dan
                operasional restoran kamu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
