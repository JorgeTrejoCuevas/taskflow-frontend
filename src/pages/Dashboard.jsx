// ============================================================
//  TaskFlow — Dashboard.jsx
//  Tablero principal con cerrar sesión y rutas protegidas
// ============================================================

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


const API = `${import.meta.env.VITE_API_URL}/api/tareas`

const COLOR_ESTADO = {
  pendiente:  { dot: '#AFA9EC', badge: 'bg-[#EEEDFE] text-[#3C3489]', label: 'Pendiente'   },
  progreso:   { dot: '#1D9E75', badge: 'bg-[#E1F5EE] text-[#085041]', label: 'En progreso' },
  finalizado: { dot: '#B4B2A9', badge: 'bg-[#F1EFE8] text-[#5F5E5A]', label: 'Finalizado'  },
}

const COLOR_CAT = {
  Trabajo:  'bg-[#EEEDFE] text-[#3C3489]',
  Reunión:  'bg-[#E1F5EE] text-[#085041]',
  Admin:    'bg-[#FAEEDA] text-[#633806]',
  Personal: 'bg-[#EAF3DE] text-[#27500A]',
}

const COLOR_PRIO = { alta: '#E24B4A', media: '#EF9F27', baja: '#639922' }
const ESTADOS    = ['pendiente', 'progreso', 'finalizado']
const CATS       = ['Trabajo', 'Reunión', 'Admin', 'Personal']
const PRIOS      = ['alta', 'media', 'baja']

const TAREA_VACIA = {
  titulo: '', descripcion: '', categoria: 'Trabajo',
  estado: 'pendiente', prioridad: 'media',
  fecha: new Date().toISOString().split('T')[0],
  hora: '09:00',
}

export default function Dashboard() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const [tareas, setTareas]             = useState([])
  const [cargando, setCargando]         = useState(true)
  const [error, setError]               = useState('')
  const [mostrarForm, setMostrarForm]   = useState(false)
  const [nuevaTarea, setNuevaTarea]     = useState(TAREA_VACIA)
  const [guardando, setGuardando]       = useState(false)
  const [filtroEstado, setFiltroEstado] = useState('todos')

  useEffect(() => { cargarTareas() }, [])

  const cargarTareas = async () => {
  try {
    setCargando(true)
    const res = await fetch(API, {
      headers: {
        'Authorization': `Bearer ${usuario?.token}`
      }
    })
    if (!res.ok) throw new Error()
    setTareas(await res.json())
  } catch {
    setError('No se pudo conectar al backend. Verifica que Spring Boot esté corriendo en el puerto 8082.')
  } finally {
    setCargando(false)
  }
}
  const crearTarea = async (e) => {
  e.preventDefault()
  try {
    setGuardando(true)
    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usuario?.token}`
      },
      body: JSON.stringify(nuevaTarea),
    })
    if (!res.ok) throw new Error()
    await cargarTareas()
    setNuevaTarea(TAREA_VACIA)
    setMostrarForm(false)
  } catch {
    setError('No se pudo crear la tarea.')
  } finally {
    setGuardando(false)
  }
}

  const cambiarEstado = async (tarea) => {
  const siguiente = tarea.estado === 'pendiente' ? 'progreso'
                  : tarea.estado === 'progreso'  ? 'finalizado'
                  : 'pendiente'
  try {
    const res = await fetch(`${API}/${tarea.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usuario?.token}`
      },
      body: JSON.stringify({ ...tarea, estado: siguiente }),
    })
    if (!res.ok) throw new Error()
    await cargarTareas()
  } catch {
    setError('No se pudo actualizar la tarea.')
  }
}

  // ── Cerrar sesión — replace:true evita regresar con botón atrás ──
  const cerrarSesion = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const tareasFiltradas = filtroEstado === 'todos'
    ? tareas
    : tareas.filter(t => t.estado === filtroEstado)

  const pendientes  = tareas.filter(t => t.estado === 'pendiente').length
  const progreso    = tareas.filter(t => t.estado === 'progreso').length
  const finalizadas = tareas.filter(t => t.estado === 'finalizado').length

  return (
    <div className="min-h-screen bg-[#F8F7FF]">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1 shadow-md border border-gray-100">
  <img
    src="/taskflow-logo.png"
    alt="TaskFlow Logo"
    className="w-full h-full object-contain"
  />
</div>
<span className="font-bold text-[#1C1A3A] text-lg">TaskFlow</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:block">
            {new Date().toLocaleDateString('es-MX', { weekday:'long', day:'numeric', month:'long' })}
          </span>
          <button
            onClick={() => setMostrarForm(true)}
            className="bg-[#534AB7] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#3C3489] transition-colors"
          >
            + Nueva tarea
          </button>

          {/* Info usuario + cerrar sesión */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#EEEDFE] rounded-full flex items-center justify-center text-[#534AB7] font-bold text-sm">
              {usuario?.nombre ? usuario.nombre[0].toUpperCase() : usuario?.correo?.[0]?.toUpperCase() || '?'}
            </div>
           <Link to="/perfil" className="text-sm text-gray-600 hidden md:block hover:text-[#534AB7] transition-colors cursor-pointer">
  {usuario?.nombre || usuario?.correo}
</Link>
            <button
              onClick={cerrarSesion}
              className="text-sm text-[#E24B4A] hover:text-[#A32D2D] font-medium transition-colors border border-[#F09595] hover:border-[#E24B4A] px-3 py-1.5 rounded-lg"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {error && (
          <div className="bg-[#FCEBEB] border border-[#F09595] text-[#A32D2D] text-sm rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="font-bold ml-4">✕</button>
          </div>
        )}

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label:'Total tareas', valor: tareas.length,  color:'#EF9F27', pct: 100 },
            { label:'Pendientes',   valor: pendientes,     color:'#534AB7', pct: tareas.length ? pendientes/tareas.length*100 : 0 },
            { label:'En progreso',  valor: progreso,       color:'#1D9E75', pct: tareas.length ? progreso/tareas.length*100 : 0 },
            { label:'Finalizadas',  valor: finalizadas,    color:'#888780', pct: tareas.length ? finalizadas/tareas.length*100 : 0 },
          ].map((m, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
              <p className="text-2xl font-bold" style={{color: m.color}}>{m.valor}</p>
              <p className="text-xs text-gray-500 mt-0.5">{m.label}</p>
              <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{width: m.pct+'%', background: m.color}}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['todos', ...ESTADOS].map(e => (
            <button key={e} onClick={() => setFiltroEstado(e)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                filtroEstado === e
                  ? 'bg-[#534AB7] text-white border-[#534AB7]'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#534AB7] hover:text-[#534AB7]'
              }`}
            >
              {e === 'todos' ? 'Todas' : COLOR_ESTADO[e].label}
              {e !== 'todos' && <span className="ml-1.5 text-xs opacity-70">{tareas.filter(t => t.estado === e).length}</span>}
            </button>
          ))}
        </div>

        {/* Lista de tareas */}
        {cargando ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">Cargando tareas...</p>
            <p className="text-sm mt-1">Conectando con el backend en puerto 8082</p>
          </div>
        ) : tareasFiltradas.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-lg font-medium">Sin tareas</p>
            <p className="text-sm mt-1">{filtroEstado === 'todos' ? 'Crea tu primera tarea' : `No hay tareas con estado "${COLOR_ESTADO[filtroEstado]?.label}"`}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tareasFiltradas.map(t => {
              const est = COLOR_ESTADO[t.estado] || COLOR_ESTADO.pendiente
              const catClass = COLOR_CAT[t.categoria] || 'bg-gray-100 text-gray-600'
              return (
                <div key={t.id} className="bg-white border border-gray-100 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-[#534AB7] transition-colors shadow-sm group">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background: est.dot}}></div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${t.estado === 'finalizado' ? 'line-through text-gray-400' : 'text-gray-800'}`}>{t.titulo}</p>
                    {t.descripcion && <p className="text-xs text-gray-400 mt-0.5 truncate">{t.descripcion}</p>}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${catClass}`}>{t.categoria}</span>
                      <span className="text-xs text-gray-400">📅 {t.fecha}</span>
                      <span className="text-xs text-gray-400">🕐 {t.hora}</span>
                      {t.visibleEnWearable && <span className="text-xs text-[#534AB7]">⌚ en reloj</span>}
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background: COLOR_PRIO[t.prioridad]}} title={`Prioridad ${t.prioridad}`}></div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${est.badge}`}>{est.label}</span>
                    <button onClick={() => cambiarEstado(t)}
                      className="text-xs text-gray-400 hover:text-[#534AB7] transition-colors opacity-0 group-hover:opacity-100 border border-gray-200 hover:border-[#534AB7] rounded-lg px-2 py-1"
                    >→</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal nueva tarea */}
      {mostrarForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Nueva tarea</h2>
              <button onClick={() => setMostrarForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={crearTarea} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Título *</label>
                <input required type="text" placeholder="¿Qué tienes que hacer?"
                  value={nuevaTarea.titulo}
                  onChange={e => setNuevaTarea({...nuevaTarea, titulo: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#EEEDFE]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Descripción</label>
                <textarea rows={2} placeholder="Detalles opcionales..."
                  value={nuevaTarea.descripcion}
                  onChange={e => setNuevaTarea({...nuevaTarea, descripcion: e.target.value})}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#EEEDFE] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Fecha *</label>
                  <input required type="date" value={nuevaTarea.fecha}
                    onChange={e => setNuevaTarea({...nuevaTarea, fecha: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#534AB7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Hora *</label>
                  <input required type="time" value={nuevaTarea.hora}
                    onChange={e => setNuevaTarea({...nuevaTarea, hora: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#534AB7]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label:'Categoría', campo:'categoria', opciones: CATS },
                  { label:'Estado',    campo:'estado',    opciones: ESTADOS },
                  { label:'Prioridad', campo:'prioridad', opciones: PRIOS },
                ].map(({ label, campo, opciones }) => (
                  <div key={campo}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                    <select value={nuevaTarea[campo]}
                      onChange={e => setNuevaTarea({...nuevaTarea, [campo]: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#534AB7]"
                    >
                      {opciones.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setMostrarForm(false)}
                  className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 text-sm"
                >Cancelar</button>
                <button type="submit" disabled={guardando}
                  className="flex-1 bg-[#534AB7] text-white font-semibold py-2.5 rounded-xl hover:bg-[#3C3489] text-sm disabled:opacity-60"
                >{guardando ? 'Guardando...' : 'Guardar tarea'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}