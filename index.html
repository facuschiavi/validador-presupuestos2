import React, { useState, useEffect } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  Settings, 
  LogOut, 
  ChevronRight,
  Database,
  ExternalLink,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Target,
  AlertCircle,
  Briefcase,
  Calendar,
  DollarSign,
  Percent
} from 'lucide-react';

// Función robusta para acceder a variables de entorno con fallback para nombres erróneos
const getEnvVariable = (keys) => {
  for (const key of keys) {
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
        return import.meta.env[key];
      }
      if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
      }
    } catch (e) {}
  }
  return '';
};

// Buscamos la URL y la Key usando los nombres estándar y el que aparece en tu captura
const supabaseUrl = getEnvVariable(['VITE_SUPABASE_URL']);
const supabaseAnonKey = getEnvVariable(['VITE_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_URL']);

const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const App = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async () => {
    if (!supabase) return;
    try {
      setLoading(true);
      setError(null);
      
      // Consultamos la tabla 'presupuestos' basándonos en tu captura de Supabase
      const { data, error: fetchError } = await supabase
        .from('presupuestos') 
        .select('*'); // Traemos todas las columnas: id, created_at, proyecto, presupuestado, ejecutado, desviacion, estado

      if (fetchError) throw fetchError;
      setDatos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supabase) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const filteredData = datos.filter(p => 
    p.proyecto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fmt = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val || 0);

  // Pantalla de configuración si faltan las variables
  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-200">
          <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Database className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 text-center mb-4 italic">Casi listo</h1>
          <p className="text-slate-500 text-center mb-8 leading-relaxed font-medium">
            Para que la conexión funcione, asegúrate de que en Vercel los nombres sean exactamente estos:
          </p>
          
          <div className="space-y-3 mb-8 font-mono text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-400">URL:</span>
              <span className="text-blue-600 font-bold">VITE_SUPABASE_URL</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-400">KEY:</span>
              <span className="text-blue-600 font-bold">VITE_SUPABASE_ANON_KEY</span>
            </div>
          </div>

          <p className="text-[10px] text-red-500 text-center mb-4 font-bold uppercase tracking-wider">
            ⚠️ Nota: En tu captura pusiste "ANON_URL" en lugar de "ANON_KEY"
          </p>

          <a href="https://supabase.com/dashboard" target="_blank" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-black transition-all">
            Abrir Supabase <ExternalLink size={18} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden text-sm">
      <aside className="w-24 lg:w-72 bg-white border-r border-slate-200 flex flex-col items-center lg:items-stretch">
        <div className="p-8 lg:p-10 flex items-center gap-3 text-orange-600 font-black text-3xl italic">
          <div className="bg-orange-600 p-2.5 rounded-2xl text-white shadow-lg shadow-orange-200">
            <Target size={24} />
          </div>
          <span className="hidden lg:inline tracking-tighter">Validador.</span>
        </div>
        
        <nav className="flex-1 px-4 lg:px-6 space-y-2">
          <button className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 lg:px-6 py-4 text-orange-600 bg-orange-50 rounded-3xl font-black">
            <LayoutGrid size={22} /> <span className="hidden lg:inline">Proyectos</span>
          </button>
          <button className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 lg:px-6 py-4 text-slate-400 hover:text-slate-600 rounded-3xl font-bold">
            <Briefcase size={22} /> <span className="hidden lg:inline">Historial</span>
          </button>
          <button className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 lg:px-6 py-4 text-slate-400 hover:text-slate-600 rounded-3xl font-bold">
            <Settings size={22} /> <span className="hidden lg:inline">Ajustes</span>
          </button>
        </nav>

        <div className="p-6 lg:p-8">
          <button className="w-full flex items-center justify-center lg:justify-start gap-4 px-4 lg:px-6 py-4 text-slate-400 hover:text-red-500 rounded-3xl font-black">
            <LogOut size={22} /> <span className="hidden lg:inline">Salir</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-28 bg-white/80 backdrop-blur-xl border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text"
              placeholder="Buscar proyecto..."
              className="w-full pl-16 pr-8 py-4 bg-slate-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-orange-100 outline-none transition-all text-slate-700 font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-6 ml-8">
             <button onClick={fetchData} className="p-4 text-slate-300 hover:text-orange-600 transition-all rounded-2xl hover:bg-orange-50">
               <RefreshCw size={22} className={loading ? "animate-spin" : ""} />
             </button>
             <button className="flex items-center gap-3 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-200 active:scale-95 whitespace-nowrap">
                <Plus size={20} /> <span className="hidden sm:inline">Nuevo Proyecto</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-400 font-black italic uppercase text-[10px] tracking-widest">Conectando con Supabase...</p>
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto bg-white border border-red-100 p-10 rounded-[3rem] shadow-2xl shadow-red-50 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <AlertCircle size={32} />
              </div>
              <h3 className="font-black text-slate-800 text-2xl italic mb-4">Error de conexión</h3>
              <p className="text-slate-500 font-medium mb-8 text-xs font-mono bg-slate-50 p-4 rounded-xl">{error}</p>
              <button onClick={fetchData} className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-200">Reintentar</button>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <div className="mb-12">
                <h2 className="text-6xl font-black text-slate-900 tracking-tighter mb-4 italic">Hola Facundo.</h2>
                <p className="text-slate-400 font-bold flex items-center gap-3">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  Visualizando <span className="text-orange-600 font-black">{datos.length} proyectos</span> desde tu DB
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                {filteredData.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-10">
                      <div className="bg-slate-50 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase">
                        ID: {item.id}
                      </div>
                      <div className={`p-3 rounded-2xl ${parseFloat(item.desviacion) >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {parseFloat(item.desviacion) >= 0 ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                      </div>
                    </div>

                    <h3 className="text-3xl font-black text-slate-900 line-clamp-1 italic mb-8 group-hover:text-orange-600">{item.proyecto}</h3>
                    
                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="bg-slate-50 p-6 rounded-[2rem]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Presupuestado</p>
                        <p className="text-xl font-black text-slate-800">{fmt(item.presupuestado)}</p>
                      </div>
                      <div className="bg-slate-50 p-6 rounded-[2rem]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ejecutado</p>
                        <p className="text-xl font-black text-slate-800">{fmt(item.ejecutado)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-slate-400 text-[11px] font-black uppercase pt-8 border-t border-slate-50">
                      <Calendar size={14} className="text-orange-600" /> {new Date(item.created_at).toLocaleDateString()}
                      <div className="ml-auto flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                        Detalles <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-[4rem] max-w-3xl w-full p-16 shadow-2xl relative overflow-hidden">
            <button onClick={() => setSelectedItem(null)} className="absolute top-12 right-12 w-14 h-14 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400">✕</button>
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter italic mb-12">{selectedItem.proyecto}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 text-center">
               <div className="p-8 bg-slate-50 rounded-[2.5rem]">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Presupuestado</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tighter">{fmt(selectedItem.presupuestado)}</p>
               </div>
               <div className="p-8 bg-slate-50 rounded-[2.5rem]">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ejecutado</p>
                  <p className="text-2xl font-black text-slate-800 tracking-tighter">{fmt(selectedItem.ejecutado)}</p>
               </div>
               <div className={`p-8 rounded-[2.5rem] ${parseFloat(selectedItem.desviacion) >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${parseFloat(selectedItem.desviacion) >= 0 ? 'text-green-600' : 'text-red-600'}`}>Desviación</p>
                  <p className={`text-2xl font-black ${parseFloat(selectedItem.desviacion) >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {parseFloat(selectedItem.desviacion) >= 0 ? '+' : ''}{selectedItem.desviacion}%
                  </p>
               </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setSelectedItem(null)} className="flex-1 py-6 bg-slate-100 rounded-3xl font-black">Cerrar</button>
              <button className="flex-[2] py-6 bg-slate-900 text-white rounded-3xl font-black shadow-2xl flex items-center justify-center gap-3">
                Exportar Reporte <ExternalLink size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
