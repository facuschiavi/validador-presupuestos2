import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken
} from 'firebase/auth'; // Corregido: Importación desde firebase/auth
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query 
} from 'firebase/firestore';
import { 
  ChevronDown, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Filter,
  Check,
  ArrowLeft,
  Building2,
  FileText,
  TrendingUp,
  Loader2,
  Database
} from 'lucide-react';

// --- CONFIGURACIÓN DE NUBE (Vercel / Environment) ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'validador-presupuestos-v2';

const App = () => {
  const [view, setView] = useState('list');
  const [selectedItem, setSelectedItem] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // --- FILTROS ESTADO ---
  const [selectedNombres, setSelectedNombres] = useState([]);
  const [selectedVeredictos, setSelectedVeredictos] = useState([]);
  const [isNombreOpen, setIsNombreOpen] = useState(false);
  const [isVeredictoOpen, setIsVeredictoOpen] = useState(false);

  // --- AUTENTICACIÓN (REGLA 3) ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Error en el acceso cloud:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // --- CARGA DE DATOS (REGLA 1 y 2) ---
  useEffect(() => {
    if (!user) return;

    // Ruta estricta para datos públicos según REGLA 1
    const publicDataRef = collection(db, 'artifacts', appId, 'public', 'data', 'presupuestos');
    
    // Escucha en tiempo real (Live Updates)
    const unsubscribe = onSnapshot(query(publicDataRef), 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Error de lectura en base de datos:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const nombresUnicos = useMemo(() => [...new Set(data.map(item => item.nombre))].sort(), [data]);
  const veredictosUnicos = [
    'APTO (En Rango)',
    'EN OBSERVACIÓN (Requiere Justificación)',
    'NO APTO (Fuera de Rango / Sobrevaluado)'
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(val || 0);
  };

  const handleToggle = (list, setList, value) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setView('detail');
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchNombre = selectedNombres.length === 0 || selectedNombres.includes(item.nombre);
      const matchVeredicto = selectedVeredictos.length === 0 || (item.veredicto && selectedVeredictos.includes(item.veredicto));
      return matchNombre && matchVeredicto;
    });
  }, [data, selectedNombres, selectedVeredictos]);

  const getStatusStyles = (veredicto) => {
    if (!veredicto) return 'bg-gray-100 text-gray-500 border-gray-200';
    if (veredicto.includes('APTO')) return 'bg-[#c6efce] text-[#006100] border-[#92d050]';
    if (veredicto.includes('OBSERVACIÓN')) return 'bg-[#ffeb9c] text-[#9c6500] border-[#ffc000]';
    return 'bg-[#ffc7ce] text-[#9c0006] border-[#ff0000]';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f3f4f6]">
        <div className="relative">
           <Loader2 className="animate-spin text-[#1f4e3d]" size={64} />
           <Database className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1f4e3d]/40" size={24} />
        </div>
        <p className="mt-6 text-[#1f4e3d] font-black uppercase tracking-[0.2em] text-xs animate-pulse">Sincronizando Base de Datos...</p>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans text-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Header Superior */}
          <div className="bg-[#1f4e3d] text-white p-6 rounded-t-xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-white/10 p-3 rounded-xl border border-white/20 backdrop-blur-sm">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Control de Aptitud</h1>
                <p className="text-green-300 text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 mt-1 italic">Ministerio de Infraestructura</p>
              </div>
            </div>
            <div className="flex items-center gap-3 relative z-10">
               <div className="hidden lg:block text-right mr-4">
                  <p className="text-[9px] font-bold text-green-300/50 uppercase tracking-widest">Sincronización Cloud</p>
                  <p className="text-[10px] font-black text-white uppercase tabular-nums">ID: {user?.uid.substring(0,10)}</p>
               </div>
               <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl transition-all font-bold text-xs shadow-lg active:scale-95 group">
                 <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> Exportar Reporte
               </button>
            </div>
          </div>

          {/* Panel de Filtros */}
          <div className="bg-white border-x border-b border-gray-200 p-6 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest ml-1">Licitación / Obra</label>
              <button 
                onClick={() => { setIsNombreOpen(!isNombreOpen); setIsVeredictoOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl bg-white transition-all ${isNombreOpen ? 'ring-2 ring-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="text-xs truncate font-bold text-gray-700">
                  {selectedNombres.length === 0 ? 'Todas las Obras Registradas' : `${selectedNombres.length} seleccionadas`}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isNombreOpen ? 'rotate-180' : ''}`} />
              </button>
              {isNombreOpen && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl p-2 max-h-80 overflow-y-auto backdrop-blur-md">
                  <div className="sticky top-0 bg-white/90 pb-2 mb-2 border-b border-gray-100 flex justify-between px-2 items-center">
                    <button onClick={() => setSelectedNombres([])} className="text-[10px] font-black text-red-500 uppercase hover:underline">Limpiar</button>
                    <span className="text-[9px] font-bold text-gray-300 uppercase">Filtro de Obra</span>
                    <button onClick={() => setIsNombreOpen(false)} className="text-[10px] font-black text-[#1f4e3d] uppercase hover:underline">Listo</button>
                  </div>
                  {nombresUnicos.length > 0 ? nombresUnicos.map(n => (
                    <div key={n} onClick={() => handleToggle(selectedNombres, setSelectedNombres, n)} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${selectedNombres.includes(n) ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                      <div className={`w-5 h-5 border rounded-md flex items-center justify-center transition-all ${selectedNombres.includes(n) ? 'bg-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-300'}`}>
                        {selectedNombres.includes(n) && <Check size={14} className="text-white" />}
                      </div>
                      <span className={`text-[11px] ${selectedNombres.includes(n) ? 'font-black text-[#1f4e3d]' : 'text-gray-600 font-medium'}`}>{n}</span>
                    </div>
                  )) : <p className="p-4 text-center text-xs text-gray-400 italic">No hay registros en la base</p>}
                </div>
              )}
            </div>

            <div className="relative w-full md:w-80">
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest ml-1">Estado del Veredicto</label>
              <button 
                onClick={() => { setIsVeredictoOpen(!isVeredictoOpen); setIsNombreOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl bg-white transition-all ${isVeredictoOpen ? 'ring-2 ring-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="text-xs font-bold text-gray-700">
                  {selectedVeredictos.length === 0 ? 'Ver todos los estados' : `${selectedVeredictos.length} seleccionados`}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isVeredictoOpen ? 'rotate-180' : ''}`} />
              </button>
              {isVeredictoOpen && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl p-2">
                  {veredictosUnicos.map(v => (
                    <div key={v} onClick={() => handleToggle(selectedVeredictos, setSelectedVeredictos, v)} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${selectedVeredictos.includes(v) ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                      <div className={`w-5 h-5 border rounded-md flex items-center justify-center transition-all ${selectedVeredictos.includes(v) ? 'bg-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-300'}`}>
                        {selectedVeredictos.includes(v) && <Check size={14} className="text-white" />}
                      </div>
                      <span className={`text-[11px] ${selectedVeredictos.includes(v) ? 'font-black text-[#1f4e3d]' : 'text-gray-600 font-medium'}`}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabla de Resultados */}
          <div className="bg-white rounded-b-xl shadow-xl overflow-hidden border-x border-b border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-5 text-left text-[11px] font-black text-[#1f4e3d] uppercase tracking-[0.1em]">Licitación / Archivo Fuente</th>
                    <th className="p-5 text-right text-[11px] font-black text-[#1f4e3d] uppercase tracking-[0.1em] w-48">Monto Ofertado</th>
                    <th className="p-5 text-center text-[11px] font-black text-[#1f4e3d] uppercase tracking-[0.1em] w-36">Desvío</th>
                    <th className="p-5 text-center text-[11px] font-black text-[#1f4e3d] uppercase tracking-[0.1em] w-64">Situación Final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => handleRowClick(item)}
                        className="hover:bg-green-50/40 cursor-pointer transition-all group border-l-4 border-l-transparent hover:border-l-[#1f4e3d]"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="bg-gray-100 p-2.5 rounded-lg text-gray-400 group-hover:bg-[#1f4e3d] group-hover:text-white transition-all shadow-inner">
                              <FileText size={16} />
                            </div>
                            <span className="text-xs text-gray-700 font-bold truncate max-w-sm group-hover:text-[#1f4e3d] transition-colors">{item.nombre}</span>
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <span className="text-xs font-black text-gray-800 tabular-nums">
                            {formatCurrency(item.monto)}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`text-[11px] font-black tabular-nums px-2 py-1 rounded ${item.desvio <= 5 ? 'text-green-700 bg-green-50' : item.desvio <= 20 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'}`}>
                            {item.desvio > 0 ? '+' : ''}{item.desvio?.toFixed(2)}%
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`inline-block w-full px-4 py-2 rounded-lg text-[9px] font-black uppercase border shadow-sm tracking-wider ${getStatusStyles(item.veredicto)}`}>
                            {item.veredicto}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-32 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                           <Filter size={64} className="text-gray-400" />
                           <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Sin Datos Disponibles</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Informativo */}
            <div className="bg-[#f8fafc] p-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex gap-12">
                <div className="text-center group">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#1f4e3d] transition-colors">Total Analizado</p>
                  <p className="text-2xl font-black text-[#1f4e3d] tabular-nums leading-none">{filteredData.length}</p>
                </div>
                <div className="text-center group">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-[#1f4e3d] transition-colors">Volumen Total</p>
                  <p className="text-2xl font-black text-[#1f4e3d] tabular-nums leading-none">
                    {formatCurrency(filteredData.reduce((acc, curr) => acc + (curr.monto || 0), 0))}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="px-5 py-2 border-b-4 border-b-[#92d050] bg-white rounded-t-xl shadow-sm text-center min-w-[80px]">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Aptos</p>
                  <p className="text-lg font-black text-green-700">{filteredData.filter(d => d.veredicto?.includes('APTO')).length}</p>
                </div>
                <div className="px-5 py-2 border-b-4 border-b-[#ffc000] bg-white rounded-t-xl shadow-sm text-center min-w-[80px]">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Obs.</p>
                  <p className="text-lg font-black text-amber-700">{filteredData.filter(d => d.veredicto?.includes('OBSERVACIÓN')).length}</p>
                </div>
                <div className="px-5 py-2 border-b-4 border-b-[#ff0000] bg-white rounded-t-xl shadow-sm text-center min-w-[80px]">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">No Aptos</p>
                  <p className="text-lg font-black text-red-700">{filteredData.filter(d => d.veredicto?.includes('NO APTO')).length}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-6 text-[10px] text-gray-400 text-center uppercase font-bold tracking-[0.4em] opacity-60">
            Cómputo y Presupuesto • Sistema de Validación Cloud v2.1
          </p>
        </div>
      </div>
    );
  }

  // VISTA DE DETALLE
  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => setView('list')}
            className="group flex items-center gap-3 text-[#1f4e3d] bg-white hover:bg-[#1f4e3d] hover:text-white px-5 py-3 rounded-2xl transition-all font-black text-xs uppercase shadow-md active:scale-95 border border-gray-100"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Volver al Tablero
          </button>
          <div className={`px-6 py-3 rounded-2xl border text-[11px] font-black uppercase shadow-lg tracking-widest ${getStatusStyles(selectedItem.veredicto)}`}>
            {selectedItem.veredicto}
          </div>
        </div>

        {/* Ficha Técnica */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100 relative">
          <div className="bg-gray-50 px-8 py-5 border-b border-gray-100 flex items-center gap-3">
            <Building2 size={20} className="text-[#1f4e3d]" />
            <h2 className="text-[11px] font-black text-[#1f4e3d] uppercase tracking-[0.2em]">Ficha Técnica del Presupuesto</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="group">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Comitente Responsable</span>
                <span className="text-xs font-bold text-gray-700 block border-b border-gray-50 pb-2 group-hover:border-[#1f4e3d] transition-colors">{selectedItem.comitente || 'No especificado'}</span>
              </div>
              <div className="group">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Nombre de la Obra</span>
                <span className="text-sm font-black text-[#1f4e3d] block border-b border-gray-50 pb-2 group-hover:border-[#1f4e3d] transition-colors">{selectedItem.nombre.replace('.xlsx', '')}</span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="group">
                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest block mb-1">Contratista / Empresa</span>
                <span className="text-xs font-black text-gray-800 block border-b border-gray-50 pb-2 group-hover:border-[#1f4e3d] transition-colors">{selectedItem.empresa || 'Empresa No Registrada'}</span>
              </div>
              <div className="bg-[#1f4e3d] p-4 rounded-2xl shadow-xl">
                <span className="text-[8px] font-black text-green-300 uppercase tracking-widest block mb-1">Presupuesto Ofertado</span>
                <span className="text-xl font-black text-white tabular-nums">{formatCurrency(selectedItem.monto)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Ítems */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-[#1f4e3d] px-8 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-green-400" />
              <h3 className="text-white text-[11px] font-black uppercase tracking-[0.2em]">Análisis de Ítems Críticos</h3>
            </div>
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-[10px] font-black tracking-wider ${selectedItem.desvio > 0 ? 'bg-red-500' : 'bg-green-600'}`}>
               <TrendingUp size={14} />
               Diferencia Global: {selectedItem.desvio}%
            </div>
          </div>
          
          <div className="p-4">
             <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex items-center gap-4 text-amber-800">
                <AlertCircle className="shrink-0" size={24} />
                <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight">
                  Se ha detectado una fluctuación del {selectedItem.desvio}% respecto al presupuesto oficial. 
                  {selectedItem.desvio > 20 ? " Se requiere auditoría de los ítems de mayor peso porcentual." : " El valor se encuentra dentro de los parámetros aceptables."}
                </p>
             </div>
          </div>
          
          <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end items-center gap-4">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">Archivo validado digitalmente por el Sistema de Aptitud</p>
              <button className="bg-gray-800 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-black transition-all shadow-lg active:scale-95">
                Generar PDF de Auditoría
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
