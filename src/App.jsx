import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken
} from 'firebase/auth'; 
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
  Database,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

// --- CONFIGURACIÓN DE FIREBASE ---
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

  // --- ESTADOS DE FILTROS ---
  const [selectedNombres, setSelectedNombres] = useState([]);
  const [selectedVeredictos, setSelectedVeredictos] = useState([]);
  const [isNombreOpen, setIsNombreOpen] = useState(false);
  const [isVeredictoOpen, setIsVeredictoOpen] = useState(false);

  // --- LÓGICA DE AUTENTICACIÓN ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Error de acceso:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // --- SINCRONIZACIÓN DE DATOS ---
  useEffect(() => {
    if (!user) return;

    const publicDataRef = collection(db, 'artifacts', appId, 'public', 'data', 'presupuestos');
    
    const unsubscribe = onSnapshot(query(publicDataRef), 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(docs);
        setLoading(false);
      },
      (error) => {
        console.error("Error Firestore:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // --- UTILIDADES ---
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
        <Loader2 className="animate-spin text-[#1f4e3d] mb-4" size={48} />
        <p className="text-[#1f4e3d] font-black uppercase tracking-[0.2em] text-[10px]">Cargando Base de Datos...</p>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans text-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-[#1f4e3d] text-white p-6 rounded-t-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                <ShieldCheck className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-black uppercase tracking-tight">Validador de Aptitud</h1>
                <p className="text-green-300 text-[10px] font-bold uppercase tracking-widest opacity-80 italic">Gestión Presupuestaria Vercel</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl transition-all font-bold text-xs shadow-lg active:scale-95 group">
              <Download size={16} /> Exportar Auditoría
            </button>
          </div>

          {/* Filtros */}
          <div className="bg-white border-x border-b border-gray-200 p-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Obra / Licitación</label>
              <button 
                onClick={() => { setIsNombreOpen(!isNombreOpen); setIsVeredictoOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-white transition-all text-xs font-bold"
              >
                <span className="truncate">{selectedNombres.length === 0 ? 'Todas las Obras' : `${selectedNombres.length} seleccionadas`}</span>
                <ChevronDown size={14} className={`transition-transform ${isNombreOpen ? 'rotate-180' : ''}`} />
              </button>
              {isNombreOpen && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl p-2 max-h-60 overflow-y-auto">
                  {nombresUnicos.map(n => (
                    <div key={n} onClick={() => handleToggle(selectedNombres, setSelectedNombres, n)} className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-lg cursor-pointer">
                      <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedNombres.includes(n) ? 'bg-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-300'}`}>
                        {selectedNombres.includes(n) && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-[11px] font-medium text-gray-700">{n}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full md:w-80">
              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Estado de Aptitud</label>
              <button 
                onClick={() => { setIsVeredictoOpen(!isVeredictoOpen); setIsNombreOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-white transition-all text-xs font-bold"
              >
                <span>{selectedVeredictos.length === 0 ? 'Ver todos' : `${selectedVeredictos.length} seleccionados`}</span>
                <ChevronDown size={14} className={`transition-transform ${isVeredictoOpen ? 'rotate-180' : ''}`} />
              </button>
              {isVeredictoOpen && (
                <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl p-2">
                  {veredictosUnicos.map(v => (
                    <div key={v} onClick={() => handleToggle(selectedVeredictos, setSelectedVeredictos, v)} className="flex items-center gap-3 p-2 hover:bg-green-50 rounded-lg cursor-pointer">
                      <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedVeredictos.includes(v) ? 'bg-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-300'}`}>
                        {selectedVeredictos.includes(v) && <Check size={12} className="text-white" />}
                      </div>
                      <span className="text-[11px] font-medium text-gray-700">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-b-2xl shadow-xl overflow-hidden border-x border-b border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-5 text-left text-[11px] font-black text-[#1f4e3d] uppercase tracking-widest">Archivo / Licitación</th>
                    <th className="p-5 text-right text-[11px] font-black text-[#1f4e3d] uppercase tracking-widest">Monto</th>
                    <th className="p-5 text-center text-[11px] font-black text-[#1f4e3d] uppercase tracking-widest">Desvío</th>
                    <th className="p-5 text-center text-[11px] font-black text-[#1f4e3d] uppercase tracking-widest">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => { setSelectedItem(item); setView('detail'); }}
                      className="hover:bg-green-50/30 cursor-pointer transition-all group"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 p-2 rounded-lg text-gray-400 group-hover:bg-[#1f4e3d] group-hover:text-white transition-all">
                            <FileText size={16} />
                          </div>
                          <span className="text-xs font-bold text-gray-700">{item.nombre}</span>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <span className="text-xs font-black text-gray-800 tabular-nums">{formatCurrency(item.monto)}</span>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`text-[10px] font-black px-2 py-1 rounded ${item.desvio <= 10 ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                          {item.desvio > 0 ? '+' : ''}{item.desvio}%
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`block w-full text-center py-2 rounded-lg text-[9px] font-black uppercase border shadow-sm ${getStatusStyles(item.veredicto)}`}>
                          {item.veredicto}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Footer Estadístico */}
            <div className="p-6 bg-[#f8fafc] border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex gap-10">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Total Registros</p>
                    <p className="text-2xl font-black text-[#1f4e3d]">{filteredData.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Monto Acumulado</p>
                    <p className="text-2xl font-black text-[#1f4e3d]">{formatCurrency(filteredData.reduce((acc, c) => acc + (c.monto || 0), 0))}</p>
                  </div>
               </div>
               <div className="flex gap-2">
                  <div className="bg-white border-b-4 border-b-green-500 p-2 rounded-lg shadow-sm text-center min-w-[70px]">
                    <span className="text-[8px] font-bold text-gray-400 block">APTO</span>
                    <span className="text-sm font-black text-green-700">{filteredData.filter(d => d.veredicto?.includes('APTO')).length}</span>
                  </div>
                  <div className="bg-white border-b-4 border-b-amber-500 p-2 rounded-lg shadow-sm text-center min-w-[70px]">
                    <span className="text-[8px] font-bold text-gray-400 block">OBS.</span>
                    <span className="text-sm font-black text-amber-700">{filteredData.filter(d => d.veredicto?.includes('OBSERVACIÓN')).length}</span>
                  </div>
                  <div className="bg-white border-b-4 border-b-red-500 p-2 rounded-lg shadow-sm text-center min-w-[70px]">
                    <span className="text-[8px] font-bold text-gray-400 block">NO APTO</span>
                    <span className="text-sm font-black text-red-700">{filteredData.filter(d => d.veredicto?.includes('NO APTO')).length}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // DETALLE
  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => setView('list')}
          className="flex items-center gap-2 mb-8 text-[#1f4e3d] font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform"
        >
          <ArrowLeft size={16} /> Volver al Tablero
        </button>

        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-[#1f4e3d] p-8 text-white relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Building2 size={120} />
            </div>
            <p className="text-[10px] font-bold text-green-300 uppercase tracking-widest mb-2">Expediente de Auditoría</p>
            <h2 className="text-2xl font-black mb-4">{selectedItem.nombre}</h2>
            <div className="flex gap-4">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border-2 ${getStatusStyles(selectedItem.veredicto)}`}>
                {selectedItem.veredicto}
              </span>
            </div>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Información de la Obra</h4>
                <div className="space-y-4">
                   <div>
                      <span className="text-[8px] font-bold text-gray-400 block">EMPRESA OFERENTE</span>
                      <span className="text-sm font-black text-gray-800">{selectedItem.empresa || 'Empresa Local S.A.'}</span>
                   </div>
                   <div>
                      <span className="text-[8px] font-bold text-gray-400 block">COMITENTE</span>
                      <span className="text-sm font-black text-gray-800">{selectedItem.comitente || 'Secretaría de Obras Públicas'}</span>
                   </div>
                </div>
             </div>
             <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Análisis Económico</h4>
                <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                   <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black text-gray-500 uppercase">Monto Final</span>
                      <span className="text-lg font-black text-[#1f4e3d]">{formatCurrency(selectedItem.monto)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-[8px] font-black text-gray-500 uppercase">Variación %</span>
                      <span className={`text-sm font-black ${selectedItem.desvio > 0 ? 'text-red-600' : 'text-green-600'}`}>{selectedItem.desvio}%</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="p-8 bg-amber-50/50 border-t border-gray-100">
             <div className="flex gap-4">
                <AlertCircle className="text-amber-600 shrink-0" />
                <div>
                   <h5 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1">Dictamen del Sistema</h5>
                   <p className="text-xs text-amber-900 font-medium leading-relaxed">
                     El análisis automático indica que el presupuesto presenta un desvío del {selectedItem.desvio}%. 
                     {selectedItem.desvio > 15 ? ' Se recomienda encarecidamente revisar los precios unitarios de los ítems de mayor incidencia.' : ' El valor se considera aceptable bajo los parámetros actuales de inflación.'}
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
