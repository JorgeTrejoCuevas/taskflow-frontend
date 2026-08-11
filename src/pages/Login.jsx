// ============================================================
//  TaskFlow — Login.jsx
//  Registro e inicio de sesión con validaciones completas
// ============================================================

import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
const validarPassword = (pass) =>
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/.test(pass);

function IconoOjo({ visible }) {
  return visible ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

export default function Login() {
  const { usuario, login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");

  // Si ya hay sesión activa, manda directo al dashboard
  if (usuario) return <Navigate to="/dashboard" replace />;

  // ── Estado registro ──────────────────────────────────────
  const [reg, setReg] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    confirmar: "",
  });
  const [verPassReg, setVerPassReg] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);
  const [erroresReg, setErroresReg] = useState({});

  // ── Estado login ─────────────────────────────────────────
  const [log, setLog] = useState({ correo: "", password: "" });
  const [verPassLog, setVerPassLog] = useState(false);
  const [erroresLog, setErroresLog] = useState({});

  // ── Validar registro ─────────────────────────────────────
  const handleRegistro = async (e) => {
    e.preventDefault();
    const errs = {
      nombre: reg.nombre.trim().length < 2 ? "Mínimo 2 caracteres" : "",
      apellido: reg.apellido.trim().length < 2 ? "Mínimo 2 caracteres" : "",
      correo: !validarCorreo(reg.correo) ? "Correo inválido" : "",
      password: !validarPassword(reg.password)
        ? "Mínimo 8 caracteres, letra, número y símbolo (@#$!%*?&)"
        : "",
      confirmar:
        reg.password !== reg.confirmar ? "Las contraseñas no coinciden" : "",
    };
    setErroresReg(errs);
    if (Object.values(errs).some((e) => e)) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/registro`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: reg.nombre,
            apellido: reg.apellido,
            correo: reg.correo,
            password: reg.password,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setErroresReg({ correo: data.error || "Error al registrar" });
        return;
      }
      login({
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        token: data.token,
      });
      navigate("/dashboard", { replace: true });
    } catch {
      setErroresReg({ correo: "No se pudo conectar al servidor" });
    }
  };

  // ── Validar login ────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = {
      correo: !validarCorreo(log.correo) ? "El correo debe contener @" : "",
      password: !log.password ? "Ingresa tu contraseña" : "",
    };
    setErroresLog(errs);
    if (Object.values(errs).some((e) => e)) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo: log.correo, password: log.password }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setErroresLog({
          password: data.error || "Correo o contraseña incorrectos",
        });
        return;
      }
      login({
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        token: data.token,
      });
      navigate("/dashboard", { replace: true });
    } catch {
      setErroresLog({ correo: "No se pudo conectar al servidor" });
    }
  };

  const CampoPassword = ({
    label,
    value,
    onChange,
    verPass,
    setVerPass,
    error,
    placeholder,
  }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={verPass ? "text" : "password"}
          required
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full border rounded-xl px-3 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-[#EEEDFE] ${
            error
              ? "border-[#E24B4A]"
              : "border-gray-200 focus:border-[#534AB7]"
          }`}
        />
        <button
          type="button"
          onClick={() => setVerPass(!verPass)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <IconoOjo visible={verPass} />
        </button>
      </div>
      {error && <p className="text-xs text-[#E24B4A] mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F7FF] flex flex-col">
      <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1 shadow-md border border-gray-100">
            <img
              src="/taskflow-logo.png"
              alt="TaskFlow Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-[#1C1A3A] text-lg">TaskFlow</span>
        </Link>
        <Link
          to="/"
          className="text-sm text-gray-500 hover:text-[#534AB7] transition-colors"
        >
          Volver
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm w-full max-w-md overflow-hidden">
          <div className="text-center pt-8 pb-4 px-8">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden p-1.5 shadow-md border border-gray-100 mx-auto mb-3">
              <img
                src="/taskflow-logo.png"
                alt="TaskFlow Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-[#1C1A3A]">
              Accede a TaskFlow
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Crea tu cuenta o inicia sesión
            </p>
          </div>

          <div className="flex border-b border-gray-100">
            {["registro", "login"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setErroresReg({});
                  setErroresLog({});
                }}
                className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                  tab === t
                    ? "border-[#534AB7] text-[#534AB7]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "registro" ? "Registrarse" : "Iniciar sesión"}
              </button>
            ))}
          </div>

          <div className="px-8 py-6">
            {/* ── Formulario Registro ── */}
            {tab === "registro" && (
              <form onSubmit={handleRegistro} className="space-y-4" noValidate>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="TuNombre"
                      value={reg.nombre}
                      onChange={(e) =>
                        setReg({ ...reg, nombre: e.target.value })
                      }
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EEEDFE] ${erroresReg.nombre ? "border-[#E24B4A]" : "border-gray-200 focus:border-[#534AB7]"}`}
                    />
                    {erroresReg.nombre && (
                      <p className="text-xs text-[#E24B4A] mt-1">
                        {erroresReg.nombre}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Apellido"
                      value={reg.apellido}
                      onChange={(e) =>
                        setReg({ ...reg, apellido: e.target.value })
                      }
                      className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EEEDFE] ${erroresReg.apellido ? "border-[#E24B4A]" : "border-gray-200 focus:border-[#534AB7]"}`}
                    />
                    {erroresReg.apellido && (
                      <p className="text-xs text-[#E24B4A] mt-1">
                        {erroresReg.apellido}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Tucorreocon@"
                    value={reg.correo}
                    onChange={(e) => setReg({ ...reg, correo: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EEEDFE] ${erroresReg.correo ? "border-[#E24B4A]" : "border-gray-200 focus:border-[#534AB7]"}`}
                  />
                  {erroresReg.correo && (
                    <p className="text-xs text-[#E24B4A] mt-1">
                      {erroresReg.correo}
                    </p>
                  )}
                </div>

                <CampoPassword
                  label="Contraseña"
                  value={reg.password}
                  onChange={(v) => setReg({ ...reg, password: v })}
                  verPass={verPassReg}
                  setVerPass={setVerPassReg}
                  error={erroresReg.password}
                  placeholder="Mín. 8 chars, letra, número y símbolo"
                />

                <CampoPassword
                  label="Confirmar contraseña"
                  value={reg.confirmar}
                  onChange={(v) => setReg({ ...reg, confirmar: v })}
                  verPass={verConfirmar}
                  setVerPass={setVerConfirmar}
                  error={erroresReg.confirmar}
                  placeholder="Repite tu contraseña"
                />

                {reg.password && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Fortaleza:</p>
                    <div className="flex gap-1">
                      {[
                        reg.password.length >= 8,
                        /[A-Za-z]/.test(reg.password),
                        /\d/.test(reg.password),
                        /[@#$!%*?&]/.test(reg.password),
                      ].map((ok, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1.5 rounded-full ${ok ? "bg-[#1D9E75]" : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1 text-xs text-gray-400">
                      <span
                        className={
                          reg.password.length >= 8 ? "text-[#1D9E75]" : ""
                        }
                      >
                        8+ chars
                      </span>
                      <span>·</span>
                      <span
                        className={
                          /[A-Za-z]/.test(reg.password) ? "text-[#1D9E75]" : ""
                        }
                      >
                        letra
                      </span>
                      <span>·</span>
                      <span
                        className={
                          /\d/.test(reg.password) ? "text-[#1D9E75]" : ""
                        }
                      >
                        número
                      </span>
                      <span>·</span>
                      <span
                        className={
                          /[@#$!%*?&]/.test(reg.password)
                            ? "text-[#1D9E75]"
                            : ""
                        }
                      >
                        símbolo
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    required
                    id="terminos"
                    className="accent-[#534AB7]"
                  />
                  <label htmlFor="terminos" className="text-xs text-gray-500">
                    Acepto los{" "}
                    <span className="text-[#534AB7]">
                      términos y condiciones
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#534AB7] text-white font-semibold py-3 rounded-xl hover:bg-[#3C3489] transition-colors text-sm"
                >
                  Crear cuenta
                </button>
              </form>
            )}

            {/* ── Formulario Login ── */}
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Tucorreocon@"
                    value={log.correo}
                    onChange={(e) => setLog({ ...log, correo: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EEEDFE] ${erroresLog.correo ? "border-[#E24B4A]" : "border-gray-200 focus:border-[#534AB7]"}`}
                  />
                  {erroresLog.correo && (
                    <p className="text-xs text-[#E24B4A] mt-1">
                      {erroresLog.correo}
                    </p>
                  )}
                </div>

                <CampoPassword
                  label="Contraseña"
                  value={log.password}
                  onChange={(v) => setLog({ ...log, password: v })}
                  verPass={verPassLog}
                  setVerPass={setVerPassLog}
                  error={erroresLog.password}
                  placeholder="Tu contraseña"
                />

                <button
                  type="submit"
                  className="w-full bg-[#534AB7] text-white font-semibold py-3 rounded-xl hover:bg-[#3C3489] transition-colors text-sm"
                >
                  Iniciar sesión
                </button>

                <p className="text-center text-xs text-gray-500 mt-2">
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("registro")}
                    className="text-[#534AB7] font-medium hover:underline"
                  >
                    Regístrate gratis
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
