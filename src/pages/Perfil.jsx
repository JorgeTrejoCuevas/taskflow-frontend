// ============================================================
//  TaskFlow — Perfil.jsx
//  Página de perfil del usuario:
//  - Ver nombre, apellido y correo
//  - Editar nombre y apellido
//  - Cambiar contraseña
// ============================================================

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = `${import.meta.env.VITE_API_URL}/api/auth`;

export default function Perfil() {
  const { usuario, login, logout } = useAuth();
  const navigate = useNavigate();

  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState("");
  const [error, setError] = useState("");

  const [datos, setDatos] = useState({
    nombre: usuario?.nombre || "",
    apellido: usuario?.apellido || "",
  });

  const [pass, setPass] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });
  const [verPass, setVerPass] = useState(false);
  const [cambiandoPass, setCambiandoPass] = useState(false);

  const cerrarSesion = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const guardarDatos = async (e) => {
    e.preventDefault();
    if (!datos.nombre.trim() || !datos.apellido.trim()) {
      setError("Nombre y apellido son obligatorios");
      return;
    }
    try {
      setGuardando(true);
      const res = await fetch(`${API}/perfil`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario?.token}`,
        },
        body: JSON.stringify(datos),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      login({ ...usuario, nombre: data.nombre, apellido: data.apellido });
      setExito("Datos actualizados correctamente");
      setEditando(false);
      setTimeout(() => setExito(""), 3000);
    } catch {
      setError("No se pudieron guardar los cambios");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    if (pass.nueva !== pass.confirmar) {
      setError("Las contraseñas nuevas no coinciden");
      return;
    }
    if (pass.nueva.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres");
      return;
    }
    try {
      setCambiandoPass(true);
      const res = await fetch(`${API}/cambiar-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usuario?.token}`,
        },
        body: JSON.stringify({
          passwordActual: pass.actual,
          passwordNueva: pass.nueva,
        }),
      });
      if (res.status === 401) {
        setError("La contraseña actual es incorrecta");
        return;
      }
      if (!res.ok) throw new Error();
      setExito(
        "Contraseña actualizada. Por seguridad inicia sesión nuevamente.",
      );
      setPass({ actual: "", nueva: "", confirmar: "" });
      setTimeout(() => {
        logout();
        navigate("/login", { replace: true });
      }, 2500);
    } catch {
      setError("No se pudo cambiar la contraseña");
    } finally {
      setCambiandoPass(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1 shadow-md border border-gray-100">
            <img
              src="/taskflow-logo.png"
              alt="TaskFlow"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-[#1C1A3A] text-lg">TaskFlow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="text-sm text-[#534AB7] hover:underline font-medium"
          >
            Volver al dashboard
          </Link>
          <button
            onClick={cerrarSesion}
            className="text-sm text-[#E24B4A] border border-[#F09595] hover:border-[#E24B4A] px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Mi perfil</h1>

        {/* Mensajes */}
        {exito && (
          <div className="bg-[#E1F5EE] border border-[#1D9E75] text-[#085041] rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
            <i className="fa-solid fa-circle-check"></i> {exito}
          </div>
        )}
        {error && (
          <div className="bg-[#FCEBEB] border border-[#F09595] text-[#A32D2D] rounded-xl px-4 py-3 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")} className="font-bold">
              ✕
            </button>
          </div>
        )}

        {/* ── Datos personales ── */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <i className="fa-solid fa-user text-[#534AB7]"></i> Datos
              personales
            </h2>
            {!editando && (
              <button
                onClick={() => setEditando(true)}
                className="text-sm text-[#534AB7] hover:underline font-medium"
              >
                <i className="fa-solid fa-pen-to-square mr-1"></i> Editar
              </button>
            )}
          </div>

          <div className="px-6 py-5">
            {!editando ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#EEEDFE] rounded-2xl flex items-center justify-center text-[#534AB7] font-bold text-2xl">
                    {usuario?.nombre?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">
                      {usuario?.nombre} {usuario?.apellido}
                    </p>
                    <p className="text-gray-500 text-sm">{usuario?.correo}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={guardarDatos} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      value={datos.nombre}
                      onChange={(e) =>
                        setDatos({ ...datos, nombre: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#EEEDFE]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      required
                      value={datos.apellido}
                      onChange={(e) =>
                        setDatos({ ...datos, apellido: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#EEEDFE]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Correo
                  </label>
                  <input
                    type="email"
                    disabled
                    value={usuario?.correo}
                    className="w-full border border-gray-100 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    El correo no se puede modificar
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditando(false)}
                    className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={guardando}
                    className="flex-1 bg-[#534AB7] text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-[#3C3489] disabled:opacity-60"
                  >
                    {guardando ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ── Zona de peligro ── */}
        <div className="bg-white border border-[#F09595] rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F09595]">
            <h2 className="font-semibold text-[#E24B4A] flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation"></i> Cerrar sesión
            </h2>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-gray-500 mb-4">
              Al cerrar sesión necesitarás iniciar sesión nuevamente para
              acceder al dashboard.
            </p>
            <button
              onClick={cerrarSesion}
              className="bg-[#FCEBEB] text-[#E24B4A] border border-[#F09595] font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-[#E24B4A] hover:text-white transition-colors"
            >
              <i className="fa-solid fa-right-from-bracket mr-2"></i>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
