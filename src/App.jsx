import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate, useLocation, useNavigate as useReactNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

const defaultModules = [
  {
    id: 1,
    title: "Unidad 1: Introducción a la Gerencia y Ventaja Competitiva",
    duration: "1.5 horas",
    description: "Explora qué es la gerencia, sus funciones clave y cómo las organizaciones logran una ventaja competitiva.",
    objectives: [
      "Definir gerencia y administración",
      "Describir las funciones del proceso gerencial",
      "Explicar qué es la ventaja competitiva",
    ],
    resources: [
      { id: "video-gerencia", type: "video", title: "¿Qué es gerencia?", duration: "5 minutos", deadline: "2025-06-24T12:00", timerActive: true },
      { id: "lectura-funciones", type: "reading", title: "Funciones del proceso gerencial", duration: "8 minutos", deadline: "2025-06-24T15:00", timerActive: true },
      { id: "quiz-diagnostico", type: "task", title: "Cuestionario diagnóstico", bloom: "Recordar", completed: true, deadline: "", timerActive: false },
      { id: "reflexion", type: "task", title: "Reflexión escrita", bloom: "Evaluar", completed: false, deadline: "", timerActive: false },
      { id: "caso-practico", type: "application", title: "Caso práctico", completed: false, deadline: "", timerActive: false },
      { id: "discusion", type: "discussion", title: "Discusión: Ejemplo de ventaja competitiva", completed: false, deadline: "", timerActive: false },
    ],
    progress: 40,
    score: 8,
  },
];

function RecursoVista({ modules }) {
  const { moduleId, resourceId } = useParams();
  const module = modules.find((m) => m.id.toString() === moduleId);
  const recurso = module?.resources.find((r) => r.id === resourceId);

  if (!recurso) return <div className="p-6 text-gray-500">Recurso no encontrado</div>;

  return (
    <div className="p-6 space-y-3">
      <h2 className="text-xl font-bold text-blue-700">{recurso.title}</h2>
      <p className="text-sm text-gray-600">Tipo: {recurso.type} | Duración: {recurso.duration || "N/A"}</p>
      {recurso.bloom && <p className="text-sm text-gray-500">Nivel Bloom: {recurso.bloom}</p>}
      {recurso.deadline && recurso.timerActive && (
        <p className="text-red-600 text-sm">Fecha límite: {new Date(recurso.deadline).toLocaleString()}</p>
      )}
      <div className="border p-4 rounded bg-blue-50 text-gray-800">
        <p>🧾 Aquí se presentaría el contenido del recurso o un enlace al material correspondiente.</p>
      </div>
    </div>
  );
}

function CursoApp() {
  const [modules, setModules] = useState(defaultModules);
  const [loading, setLoading] = useState(true);
  const [modoVista, setModoVista] = useState(true);
  const location = useLocation();
  const navigate = useReactNavigate();

  useEffect(() => {
    const lastViewed = localStorage.getItem("lastViewed");
    if (lastViewed) {
      const { moduleId, resourceId } = JSON.parse(lastViewed);
      setTimeout(() => {
        navigate(`/modulo/${moduleId}/${modoVista ? "vista" : "editar"}/${resourceId}`);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [modoVista]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <h2 className="text-xl font-semibold text-blue-800">Cargando tu última sesión</h2>
          <p className="text-sm text-blue-600">Por favor, espera un momento...</p>
        </div>
      </div>
    );
  }

  const currentPath = location.pathname;

  return (
    <div className="grid grid-cols-12 min-h-screen">
      <aside className="col-span-2 bg-gray-100 p-4 border-r space-y-4 overflow-y-auto">
        <h2 className="font-semibold">📚 Curso</h2>
        <label className="flex items-center space-x-2 text-sm text-blue-800">
          <input type="checkbox" checked={modoVista} onChange={() => setModoVista(!modoVista)} />
          <span>{modoVista ? "Modo Vista" : "Modo Edición"}</span>
        </label>
        {modules.map(mod => (
          <div key={mod.id}>
            <p className="font-medium text-sm text-gray-700">{mod.title}</p>
            <ul className="ml-2 text-sm text-blue-600 space-y-1">
              {mod.resources.map(res => {
                const isActive = currentPath.includes(`/modulo/${mod.id}/${modoVista ? "vista" : "editar"}/${res.id}`);
                return (
                  <li key={res.id}>
                    <Link to={`/modulo/${mod.id}/${modoVista ? "vista" : "editar"}/${res.id}`} className={`hover:underline ${isActive ? 'font-bold text-blue-900' : ''}`}>
                      {res.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      <main className="col-span-7 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<div className="text-gray-500">Selecciona un tema del menú izquierdo.</div>} />
          <Route path="/modulo/:moduleId/vista/:resourceId" element={<RecursoVista modules={modules} />} />
          <Route path="/modulo/:moduleId/editar/:resourceId" element={<div className="text-yellow-700">🛠 Editor de recurso en desarrollo</div>} />
        </Routes>
      </main>

      <aside className="col-span-3 bg-gray-50 p-4 border-l">
        <h2 className="font-semibold mb-2">🤖 Asistente Virtual</h2>
        <div className="text-sm text-gray-700">
          ¿Tienes dudas? Escribe tu pregunta aquí.
          <textarea className="mt-2 w-full border p-2 rounded" rows="4" placeholder="Ej: ¿Qué es ventaja competitiva?" />
          <button className="mt-2 bg-blue-500 text-white px-4 py-1 rounded">Enviar</button>
        </div>
      </aside>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <CursoApp />
    </Router>
  );
}
