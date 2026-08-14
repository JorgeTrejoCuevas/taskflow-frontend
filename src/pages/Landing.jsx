// ============================================================
//  TaskFlow — Landing.jsx
//  Versión final con iconos reales de Font Awesome
// ============================================================

import { useState } from 'react'
import { Link } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import Navbar from "../components/Navbar";

const FEATURES = [
  {
    icon: "fa-solid fa-list-check",
    img: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80",
    title: "Gestión de tareas",
    desc: "Crea, organiza y prioriza tus pendientes del día con fecha y hora exacta. Nunca más pierdas de vista lo que importa.",
  },
  {
    icon: "fa-solid fa-clock",
    img: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80",
    title: "Sincronía con tu reloj",
    desc: "Consulta tus tareas desde tu smartwatch en tiempo real. La información llega a tu muñeca al instante.",
  },
  {
    icon: "fa-solid fa-chart-line",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    title: "Dashboard visual",
    desc: "Visualiza tu productividad con estadísticas y métricas en tiempo real. Toma mejores decisiones con datos claros.",
  },
  {
    icon: "fa-solid fa-bell",
    img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
    title: "Notificaciones inteligentes",
    desc: "Recibe recordatorios en tu celular y smartwatch antes de cada tarea. Siempre a tiempo, siempre informado.",
  },
];

const STATS = [
  { valor: "500+", label: "Tareas completadas" },
  { valor: "98%", label: "Satisfacción de usuarios" },
  { valor: "3", label: "Dispositivos compatibles" },
  { valor: "24/7", label: "Sincronización activa" },
];

export default function Landing() {
  const [form, setForm] = useState({ nombre: "", correo: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleContacto = async (e) => {
  e.preventDefault()
  if (!form.nombre || !form.correo || !form.mensaje) return

  try {
    await emailjs.send(
      'service_k1f3d8x',
      'template_zqetxy6',
      {
        from_name:   form.nombre,
        from_email:  form.correo,
        message:     form.mensaje,
      },
      '5KLJgZICseX_M5Fzs'
    )
    setEnviado(true)
    setForm({ nombre: '', correo: '', mensaje: '' })
    setTimeout(() => setEnviado(false), 4000)
  } catch (error) {
    console.error('Error al enviar:', error)
  }
}

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ══════════ HERO ══════════ */}
      <section className="bg-gradient-to-br from-[#534AB7] to-[#3C3489] text-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center overflow-hidden p-1.5 shadow-lg">
                <img
                  src="/taskflow-logo.png"
                  alt="TaskFlow Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                TaskFlow
              </span>
            </div>

            {/* Dominio destacado */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm font-mono text-white/90">
                taskflow.app — disponible pronto
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Tu agenda.
              <br />
              <span className="text-[#AFA9EC]">En todos tus dispositivos.</span>
            </h1>
            <p className="text-lg text-[#CECBF6] mb-8 leading-relaxed">
              TaskFlow conecta tu computadora con tu smartwatch. Crea tareas
              desde la web, consulta tus pendientes desde el reloj.{" "}
              <strong className="text-white">
                Sin complicaciones, sin olvidar nada.
              </strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/login"
                className="bg-white text-[#534AB7] font-semibold px-8 py-3 rounded-xl hover:bg-[#EEEDFE] transition-colors shadow-lg"
              >
                Comenzar gratis →
              </Link>
              <a
                href="#caracteristicas"
                className="border border-white/40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>

          {/* Imagen hero */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=80"
                  alt="Persona usando smartwatch con TaskFlow"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2">
                <i className="fa-solid fa-watch text-[#534AB7] text-xl"></i>
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    Sincronizado
                  </p>
                  <p className="text-xs text-gray-500">Web + Wearable</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-[#1D9E75] text-white rounded-2xl shadow-xl px-4 py-3">
                <p className="text-xs font-bold">
                  <i className="fa-solid fa-check mr-1"></i>3 tareas hoy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ ESTADÍSTICAS ══════════ */}
      <section className="bg-[#F8F7FF] py-12 px-6 border-y border-[#EEEDFE]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-[#534AB7]">{s.valor}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ CÓMO FUNCIONA ══════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80"
              alt="Smartwatch mostrando tareas de TaskFlow"
              className="rounded-3xl shadow-xl w-full object-cover max-h-80"
            />
          </div>
          <div className="flex-1">
            <span className="text-[#534AB7] text-sm font-semibold uppercase tracking-wider">
              ¿Cómo funciona?
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
              Crea en la web.
              <br />
              Consulta en el reloj.
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Agendas tus tareas desde la computadora con todos los detalles. Al
              instante, tu smartwatch las recibe y muestra cuando más las
              necesitas.
            </p>
            <div className="space-y-3">
              {[
                {
                  icono: "fa-solid fa-laptop",
                  texto: "Crea tareas desde la web con fecha y hora",
                },
                {
                  icono: "fa-solid fa-watch",
                  texto: "El reloj las muestra automáticamente",
                },
                {
                  icono: "fa-solid fa-circle-check",
                  texto: "Marca como completada desde cualquier dispositivo",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#EEEDFE] rounded-full flex items-center justify-center flex-shrink-0">
                    <i className={`${item.icono} text-[#534AB7] text-sm`}></i>
                  </div>
                  <span className="text-gray-600 text-sm">{item.texto}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CARACTERÍSTICAS ══════════ */}
      <section id="caracteristicas" className="py-20 px-6 bg-[#F8F7FF]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Todo lo que necesitas
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Diseñado para funcionar en web, móvil y smartwatch sin
            complicaciones.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white border border-[#EEEDFE] rounded-2xl overflow-hidden hover:border-[#534AB7] transition-colors shadow-sm group"
              >
                <div className="h-40 overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="w-10 h-10 bg-[#EEEDFE] rounded-xl flex items-center justify-center mb-3">
                    <i className={`${f.icon} text-[#534AB7]`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA ══════════ */}
      <section className="bg-[#534AB7] py-16 px-6 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          ¿Listo para organizarte mejor?
        </h2>
        <p className="text-[#CECBF6] mb-3 max-w-xl mx-auto">
          Únete a TaskFlow y empieza a gestionar tus tareas desde cualquier
          dispositivo hoy mismo.
        </p>
        <p className="text-white/60 text-sm mb-8 font-mono">
          <i className="fa-solid fa-globe mr-1"></i>
          Próximamente en taskflow.app
        </p>
        <Link
          to="/login"
          className="bg-white text-[#534AB7] font-semibold px-10 py-3 rounded-xl hover:bg-[#EEEDFE] transition-colors inline-block shadow-lg"
        >
          Crear cuenta gratis
        </Link>
      </section>

      {/* ══════════ CONTACTO ══════════ */}
      <section id="contacto" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">
          {/* Lado izquierdo — imagen + datos */}
          <div className="flex-1 hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80"
              alt="Equipo TaskFlow"
              className="rounded-3xl shadow-xl w-full object-cover max-h-72 mb-6"
            />
            <div className="space-y-3">
              <a
                href="mailto:taskflow724@gmail.com"
                className="flex items-center gap-3 text-gray-600 hover:text-[#534AB7] transition-colors group"
              >
                <span className="w-10 h-10 bg-[#EEEDFE] rounded-xl flex items-center justify-center group-hover:bg-[#534AB7] transition-colors">
                  <i className="fa-solid fa-envelope text-[#534AB7] group-hover:text-white"></i>
                </span>
                <span className="text-sm font-medium">
                  taskflow724@gmail.com
                </span>
              </a>
              <a
                href="https://instagram.com/Task_flow444"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-600 hover:text-[#E1306C] transition-colors group"
              >
                <span className="w-10 h-10 bg-[#EEEDFE] rounded-xl flex items-center justify-center group-hover:bg-[#E1306C] transition-colors">
                  <i className="fa-brands fa-instagram text-[#534AB7] group-hover:text-white"></i>
                </span>
                <span className="text-sm font-medium">@Task_flow444</span>
              </a>
              <div className="flex items-center gap-3 text-gray-600">
                <span className="w-10 h-10 bg-[#EEEDFE] rounded-xl flex items-center justify-center">
                  <i className="fa-solid fa-location-dot text-[#534AB7]"></i>
                </span>
                <span className="text-sm">
                  Av. Pie de la Cuesta 2501, Querétaro, Qro.
                </span>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="flex-1 w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Contáctanos
            </h2>
            <p className="text-gray-500 mb-8">
              ¿Tienes dudas o sugerencias? Escríbenos y te respondemos pronto.
            </p>

            {enviado && (
              <div className="bg-[#E1F5EE] border border-[#1D9E75] text-[#085041] rounded-xl px-4 py-3 mb-6 text-sm font-medium flex items-center gap-2">
                <i className="fa-solid fa-circle-check"></i>
                ¡Mensaje listo! Se abrió tu cliente de correo para enviarlo.
              </div>
            )}

            <form className="space-y-4" onSubmit={handleContacto}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#EEEDFE]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={form.correo}
                    onChange={(e) =>
                      setForm({ ...form, correo: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#EEEDFE]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Mensaje *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tu mensaje..."
                  value={form.mensaje}
                  onChange={(e) =>
                    setForm({ ...form, mensaje: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#EEEDFE] resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#534AB7] text-white font-semibold py-3 rounded-xl hover:bg-[#3C3489] transition-colors flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-paper-plane"></i>
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="bg-[#1C1A3A] text-white py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Datos de contacto */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1 shadow-md border border-gray-100">
                <img
                  src="/taskflow-logo.png"
                  alt="TaskFlow Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-lg">TaskFlow</span>
            </div>
            <p className="text-[#AFA9EC] text-sm leading-relaxed mb-4">
              Agenda inteligente web + wearable para gestionar tus tareas desde
              cualquier dispositivo.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:taskflow724@gmail.com"
                className="flex items-center gap-2 text-[#AFA9EC] text-sm hover:text-white transition-colors"
              >
                <i className="fa-solid fa-envelope w-4 text-center"></i>{" "}
                taskflow724@gmail.com
              </a>
              <a
                href="https://instagram.com/Task_flow444"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#AFA9EC] text-sm hover:text-white transition-colors"
              >
                <i className="fa-brands fa-instagram w-4 text-center"></i>{" "}
                @Task_flow444
              </a>
              <p className="flex items-center gap-2 text-[#AFA9EC] text-sm">
                <i className="fa-solid fa-location-dot w-4 text-center"></i>{" "}
                Querétaro, México
              </p>
              <p className="flex items-center gap-2 text-[#AFA9EC] text-sm">
                <i className="fa-solid fa-globe w-4 text-center"></i>{" "}
                taskflow.app
              </p>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[#AFA9EC]">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm text-[#CECBF6]">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-house w-4 text-center"></i> Inicio
                </Link>
              </li>
              <li>
                <a
                  href="#caracteristicas"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-star w-4 text-center"></i>{" "}
                  Características
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-right-to-bracket w-4 text-center"></i>{" "}
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-user-plus w-4 text-center"></i>{" "}
                  Registrarse
                </Link>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-envelope w-4 text-center"></i>{" "}
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Redes + Mapa */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-[#AFA9EC]">
              Síguenos
            </h4>
            <div className="flex gap-3 mb-6">
              <a
                href="mailto:taskflow724@gmail.com"
                className="w-10 h-10 bg-[#534AB7] rounded-lg flex items-center justify-center hover:bg-[#EA4335] transition-colors"
                title="Gmail"
                aria-label="Gmail"
              >
                <i className="fa-solid fa-envelope text-white"></i>
              </a>
              <a
                href="https://instagram.com/Task_flow444"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#534AB7] rounded-lg flex items-center justify-center hover:bg-[#E1306C] transition-colors"
                title="Instagram"
                aria-label="Instagram"
              >
                <i className="fa-brands fa-instagram text-white"></i>
              </a>
            </div>

            {/* Mapa real UTEQ */}
            <div
              className="rounded-xl overflow-hidden border border-[#534AB7]"
              style={{ height: "150px" }}
            >
              <iframe
                title="Ubicación TaskFlow — UTEQ"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3734.2!2d-100.4198!3d20.6347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d35b99a5c8e3f3%3A0xd9590ed9ded0e218!2sUniversidad%20Tecnol%C3%B3gica%20de%20Quer%C3%A9taro!5e0!3m2!1ses!2smx!4v1700000000000!5m2!1ses!2smx"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-[#AFA9EC] text-xs mt-2 flex items-center gap-1">
              <i className="fa-solid fa-location-dot"></i>
              Av. Pie de la Cuesta 2501, Querétaro, Qro.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto border-t border-[#26215C] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#AFA9EC] text-xs">
            © 2025 TaskFlow · Todos los derechos reservados
          </p>
          <p className="text-[#AFA9EC] text-xs">El 360 IDGS14 UTEQ</p>
        </div>
      </footer>
    </div>
  );
}
