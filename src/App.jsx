import React, { useState, useEffect } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { 
  Search, LayoutGrid, Database, ChevronRight, 
  Wallet, AlertCircle, TrendingUp, ArrowDownRight, ArrowUpRight,
  RefreshCw
} from 'lucide-react';

// Configuración de Supabase utilizando variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function App() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!supabase) return;
    try {
      setLoading(true);
      setError(null);
      // Seleccionamos las columnas exactas que se ven en tu captura de Supabase
      const { data, error: dbError } = await supabase
        .from('presupuestos')
        .select('id, proyecto, presupuestado, ejecutado, desviacion, estado');
      
      if (dbError) throw dbError;
      setDatos(data || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("No se pudo conectar con la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { 
    style: 'currency', currency: 'ARS', maximumFractionDigits: 0 
  }).format(val || 0);

  // Pantalla de error de configuración si faltan las variables de entorno
  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white rounded-3xl shadow-xl p-10 border border-slate-200">
          <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900">Variables Faltantes</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Asegúrate de que en Vercel existan: <br/>
            <code className="bg-slate-100 px-1 rounded text-pink-600 font-mono text-xs">VITE_SUPABASE_URL</code><br/>
            <code className="bg-slate-100 px-1 rounded text-pink-600 font-mono text-xs">VITE_SUPABASE_ANON_KEY</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-10 text-indigo-600">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Wallet size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">Validador</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-semibold transition-all">
            <LayoutGrid size={20} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-all">
            <Database size={20} /> Proyectos
          </button>
        </nav>

        <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
          <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Conectado a Supabase
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 md:p-8 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Control Presupuestario</h2>
              <p className="text-slate-500 text-sm">Vista general de ejecución y desvíos</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={fetchData}
                disabled={loading}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-all disabled:opacity-50"
              >
                <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {error ? (
              <div className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center">
                <AlertCircle className="text-red-500 mx-auto mb-2" />
                <p className="text-red-700 font-medium">{error}</p>
                <button 
                  onClick={fetchData}
                  className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all text-sm font-bold"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 text-slate-500 text-[11px] font-bold uppercase tracking-widest border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Proyecto</th>
                        <th className="px-6 py-4">Presupuestado</th>
                        <th className="px-6 py-4">Ejecutado</th>
                        <th className="px-6 py-4">Desviación</th>
                        <th className="px-6 py-4 text-center">Estado</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        [...Array(5)].map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td colSpan="6" className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-3/4"></div></td>
                          </tr>
                        ))
                      ) : datos.filter(p => p.proyecto?.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => {
                        const esNegativo = item.desviacion < 0;
                        return (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-5">
                              <span className="font-semibold text-slate-900 block truncate max-w-[200px]">{item.proyecto}</span>
                              <span className="text-[10px] text-slate-400 font-mono">#{item.id}</span>
                            </td>
                            <td className="px-6 py-5 font-medium text-slate-600">{formatCurrency(item.presupuestado)}</td>
                            <td className="px-6 py-5 font-medium text-slate-600">{formatCurrency(item.ejecutado)}</td>
                            <td className={`px-6 py-5 font-bold ${esNegativo ? 'text-rose-500' : 'text-emerald-500'}`}>
                              <div className="flex items-center gap-1">
                                {esNegativo ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                                {formatCurrency(Math.abs(item.desviacion))}
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                item.estado === 'Crítico' ? 'bg-rose-100 text-rose-700' : 
                                item.estado === 'Alerta' ? 'bg-amber-100 text-amber-700' : 
                                'bg-emerald-100 text-emerald-700'
                              }`}>
                                {item.estado || 'Normal'}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 hover:shadow-sm transition-all group-hover:text-indigo-600 text-slate-300">
                                <ChevronRight size={20} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {!loading && datos.length === 0 && (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                            No hay datos disponibles en la tabla 'presupuestos'.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
