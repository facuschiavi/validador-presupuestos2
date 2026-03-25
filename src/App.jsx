import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronDown, 
  Download, 
  AlertCircle, 
  Check,
  ArrowLeft,
  Building2,
  FileText,
  Loader2,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';

/**
 * Nota: Dado que el entorno tiene dificultades para resolver @supabase/supabase-js,
 * implementamos un cargador dinámico desde CDN para garantizar la disponibilidad.
 */

const App = () => {
  const [supabase, setSupabase] = useState(null);
  const [view, setView] = useState('list');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // --- ESTADOS DE FILTROS ---
  const [selectedNombres, setSelectedNombres] = useState([]);
  const [selectedVeredictos, setSelectedVeredictos] = useState([]);
  const [isNombreOpen, setIsNombreOpen] = useState(false);
  const [isVeredictoOpen, setIsVeredictoOpen] = useState(false);

  // 1. CARGA DE LIBRERÍA SUPABASE VÍA SCRIPT TAG
  useEffect(() => {
    const loadSupabase = async () => {
      try {
        if (!window.supabase) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
          script.async = true;
          script.onload = () => {
            const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
            const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
            const client = window.supabase.createClient(url, key);
            setSupabase(client);
          };
          document.head.appendChild(script);
        } else {
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
          const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
          const client = window.supabase.createClient(url, key);
          setSupabase(client);
        }
      } catch (err) {
        setError("Error al cargar el motor de base de datos.");
      }
    };
    loadSupabase();
  }, []);

  // 2. CARGA DE DATOS DESDE SUPABASE
  useEffect(() => {
    if (!supabase) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: presupuestos, error } = await supabase
          .from('presupuestos')
          .select('*');

        if (error) throw error;
        setData(presupuestos || []);
      } catch (err) {
        console.error("Error Supabase:", err);
        setError("No se pudieron obtener los datos de Supabase.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Tiempo real
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'presupuestos' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // --- LÓGICA DE FILTRADO ---
  const nombresUnicos = useMemo(() => [...new Set(data.map(item => item.nombre))].sort(), [data]);
  const veredictosUnicos = [
    'APTO (En Rango)',
    'EN OBSERVACIÓN (Requiere Justificación)',
    'NO APTO (Fuera de Rango / Sobrevaluado)'
  ];

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchNombre = selectedNombres.length === 0 || selectedNombres.includes(item.nombre);
      const matchVeredicto = selectedVeredictos.length === 0 || (item.veredicto && selectedVeredictos.includes(item.veredicto));
      return matchNombre && matchVeredicto;
    });
  }, [data, selectedNombres, selectedVeredictos]);

  // --- FORMATO Y ESTILOS ---
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const getStatusStyles = (veredicto) => {
    if (!veredicto) return 'bg-gray-100 text-gray-500 border-gray-200';
    if (veredicto.includes('APTO')) return 'bg-[#c6efce] text-[#006100] border-[#92d050]';
    if (veredicto.includes('OBSERVACIÓN')) return 'bg-[#ffeb9c] text-[#9c6500] border-[#ffc000]';
    return 'bg-[#ffc7ce] text-[#9c0006] border-[#ff0000]';
  };

  if (loading || !supabase) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6]">
        <Loader2 className="animate-spin text-[#1f4e3d] mb-4" size={48} />
        <p className="text-[#1f4e3d] font-black uppercase tracking-widest text-[10px]">Iniciando conexión segura...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6] p-4 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="font-black text-gray-800 uppercase mb-2">Fallo en la conexión</h3>
        <p className="text-xs text-gray-500 max-w-xs">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 text-xs font-bold text-[#1f4e3d] underline">Reintentar</button>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-[#1f4e3d] text-white p-8 rounded-t-3xl shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
                  <ShieldCheck className="w-10 h-10 text-green-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight leading-none mb-1">Validador Técnico</h1>
                  <p className="text-green-300 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 italic">Database Status: Supabase Online</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2">
                  <Download size={14} /> Descargar Auditoría
                </button>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white border-x border-b border-gray-200 p-6 flex flex-col md:flex-row gap-4 items-end">
            <div className="relative flex-1">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest ml-1">Proyecto Seleccionado</label>
              <button 
                onClick={() => { setIsNombreOpen(!isNombreOpen); setIsVeredictoOpen(false); }}
                className="w-full flex items-center justify-between px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-white transition-all text-xs font-bold"
              >
                <span className="truncate">{selectedNombres.length === 0 ? 'Todos los Proyectos' : `${selectedNombres.length} seleccionados`}</span>
                <ChevronDown size={14} className={`transition-transform ${isNombreOpen ? 'rotate-180' : ''}`} />
              </button>
              {isNombreOpen && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-2xl p-2 max-h-72 overflow-y-auto">
                  {nombresUnicos.map(n => (
                    <div 
                      key={n} 
                      onClick={() => {
                        if (selectedNombres.includes(n)) setSelectedNombres(selectedNombres.filter(i => i !== n));
                        else setSelectedNombres([...selectedNombres, n]);
                      }} 
                      className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${selectedNombres.includes(n) ? 'bg-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-200'}`}>
                        {selectedNombres.includes(n) && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-[11px] font-bold text-gray-700">{n}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full md:w-80">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest ml-1">Veredicto de Aptitud</label>
              <button 
                onClick={() => { setIsVeredictoOpen(!isVeredictoOpen); setIsNombreOpen(false); }}
                className="w-full flex items-center justify-between px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 hover:bg-white transition-all text-xs font-bold"
              >
                <span>{selectedVeredictos.length === 0 ? 'Ver todos' : `${selectedVeredictos.length} Estados`}</span>
                <ChevronDown size={14} className={`transition-transform ${isVeredictoOpen ? 'rotate-180' : ''}`} />
              </button>
              {isVeredictoOpen && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-2xl p-2">
                  {veredictosUnicos.map(v => (
                    <div 
                      key={v} 
                      onClick={() => {
                        if (selectedVeredictos.includes(v)) setSelectedVeredictos(selectedVeredictos.filter(i => i !== v));
                        else setSelectedVeredictos([...selectedVeredictos, v]);
                      }} 
                      className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-xl cursor-pointer transition-colors"
                    >
                      <div className={`w-5 h-5 border-2 rounded-md flex items-center justify-center transition-all ${selectedVeredictos.includes(v) ? 'bg-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-200'}`}>
                        {selectedVeredictos.includes(v) && <Check size={14} className="text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-[11px] font-bold text-gray-700">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-b-3xl shadow-xl overflow-hidden border-x border-b border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200">
                    <th className="p-6 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">Proyecto / Expediente</th>
                    <th className="p-6 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">Monto Oferta</th>
                    <th className="p-6 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">Desvío %</th>
                    <th className="p-6 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">Resolución</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => { setSelectedItem(item); setView('detail'); }}
                      className="hover:bg-green-50/40 cursor-pointer transition-all group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-gray-100 p-3 rounded-xl text-gray-400 group-hover:bg-[#1f4e3d] group-hover:text-white transition-all shadow-sm">
                            <FileText size={18} />
                          </div>
                          <div>
                            <span className="text-sm font-black text-gray-800 block mb-0.5">{item.nombre}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Auditado vía Supabase</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <span className="text-sm font-black text-[#1f4e3d] tabular-nums">{formatCurrency(item.monto)}</span>
                      </td>
                      <td className="p-6 text-center">
                        <span className={`text-[11px] font-black px-3 py-1 rounded-full ${Math.abs(item.desvio) <= 10 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                          {item.desvio > 0 ? '+' : ''}{item.desvio}%
                        </span>
                      </td>
                      <td className="p-6">
                        <div className={`text-center py-2.5 rounded-xl text-[10px] font-black uppercase border-2 shadow-sm ${getStatusStyles(item.veredicto)}`}>
                          {item.veredicto}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DETALLE
  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => setView('list')}
          className="flex items-center gap-2 mb-8 text-[#1f4e3d] font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform bg-white px-4 py-2 rounded-lg shadow-sm"
        >
          <ArrowLeft size={16} /> Volver al Listado
        </button>

        <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-[#1f4e3d] p-10 text-white relative">
            <div className="absolute top-0 right-0 p-10 opacity-5">
               <Building2 size={160} />
            </div>
            <div className="relative z-10">
              <p className="text-[11px] font-bold text-green-300 uppercase tracking-widest mb-3">Expediente de Auditoría</p>
              <h2 className="text-3xl font-black mb-6 leading-tight max-w-2xl">{selectedItem.nombre}</h2>
              <div className="flex gap-4">
                <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase border-2 shadow-lg ${getStatusStyles(selectedItem.veredicto)}`}>
                  {selectedItem.veredicto}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-8">
                <div>
                   <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Datos del Origen</h4>
                   <div className="space-y-5">
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                         <span className="text-[9px] font-bold text-gray-400 block mb-1">EMPRESA OFERENTE</span>
                         <span className="text-sm font-black text-gray-800">{selectedItem.empresa || 'Empresa de Servicios S.A.'}</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                         <span className="text-[9px] font-bold text-gray-400 block mb-1">CÓDIGO INTERNO</span>
                         <span className="text-sm font-black text-gray-800">REF-{selectedItem.id?.substring(0,6).toUpperCase()}</span>
                      </div>
                   </div>
                </div>
             </div>

             <div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Evaluación Económica</h4>
                <div className="bg-[#1f4e3d]/5 p-8 rounded-[2rem] space-y-6 border border-[#1f4e3d]/10">
                   <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                      <span className="text-[10px] font-black text-gray-500 uppercase">Monto Total</span>
                      <span className="text-2xl font-black text-[#1f4e3d]">{formatCurrency(selectedItem.monto)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase">Variación %</span>
                      <span className={`text-xl font-black ${selectedItem.desvio > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedItem.desvio}%
                      </span>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-10 bg-gray-50 border-t border-gray-100">
             <div className="flex gap-6 bg-white p-6 rounded-2xl border border-gray-200">
                <div className={`p-4 rounded-xl shrink-0 ${selectedItem.desvio > 15 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  <AlertCircle size={28} />
                </div>
                <div>
                   <h5 className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-2">Conclusión de Supabase</h5>
                   <p className="text-sm text-gray-600 font-medium leading-relaxed">
                     Análisis de datos finalizado. Con un desvío registrado del {selectedItem.desvio}%, los parámetros 
                     {selectedItem.desvio > 15 ? ' sugieren una revisión obligatoria de las planillas de cotización.' : ' se encuentran dentro del umbral de tolerancia para el presente ejercicio fiscal.'}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
