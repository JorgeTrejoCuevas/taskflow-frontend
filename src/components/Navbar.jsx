// ============================================================
//  TaskFlow — Navbar.jsx
//  Con logo real de TaskFlow
// ============================================================

import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const links = [
    { href: "/#caracteristicas", label: "Características" },
    { href: "/#contacto", label: "Contacto" },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
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

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-gray-500 hover:text-[#534AB7] transition-colors font-medium"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Botones */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-[#534AB7] hover:underline"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/login"
            className="bg-[#534AB7] text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#3C3489] transition-colors"
          >
            Registrarse
          </Link>
        </div>

        {/* Hamburguesa móvil */}
        <button
          className="md:hidden text-gray-500"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú"
        >
          {menuAbierto ? "✕" : "☰"}
        </button>
      </div>

      {/* Menú móvil */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="block text-sm text-gray-600 hover:text-[#534AB7]"
              onClick={() => setMenuAbierto(false)}
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/login"
            className="block text-sm font-semibold text-[#534AB7]"
            onClick={() => setMenuAbierto(false)}
          >
            Iniciar sesión / Registrarse
          </Link>
        </div>
      )}
    </nav>
  );
}
