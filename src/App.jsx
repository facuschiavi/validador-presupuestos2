import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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
  RefreshCw
} from 'lucide-react';

// Variables globales proporcionadas por el entorno para la configuración de Firebase/Supabase
const supabaseUrl = typeof __supabase_url !== 'undefined' ? __supabase_url : '';
const supabaseAnonKey = typeof __supabase_anon_key !== 'undefined' ? __supabase_anon_key : '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

const App = () => {
  // Estados de Navegación y Datos
  const [view, setView] = useState('list');
  const [selectedItem, setSelectedItem] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de Filtros (Interfaz)
  const [selectedNombres, setSelectedNombres] = useState([]);
  const [selectedVeredictos, setSelectedVeredictos] = useState([]);
  const [isNombreOpen, setIsNombreOpen] = useState(false);
  const [isVeredictoOpen, setIsVeredictoOpen] = useState(false);

  // Función para obtener datos de la base de datos
  const fetchData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data: dbData, error: dbError } = await supabase
        .from('presupuestos')
        .select('*');
      
      if (dbError) throw dbError;
      setData(dbData || []);
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
      setError("No se pudo sincronizar con la base de datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Datos de desglose para la vista de detalle (Mock basado en Capturas)
  const budgetItems = [
    { item: 'Limpieza de cubiertas de techo (superficie neta)', maestro: 653.82, cotizado: 2152.19, dif: 1498.37, desvio: 229.17 },
    { item: 'Canaleta descarga pluvial de Chapa Gº n.º 25 - Desarrollo 0.33 m.', maestro: 57624.41, cotizado: 2110.40, dif: -55514.01, desvio: -96.34 },
    { item: 'Desobstrucción de cañerías de desagüe cloacal y/o pluvial', maestro: 1860.86, cotizado: 4596.90, dif: 2736.04, desvio: 147.03 },
    { item: 'Provisión y colocación de cámara de inspección 0.60x0.60', maestro: 280000.00, cotizado: 334140.00, dif: 54140.00, desvio: 19.33 },
    { item: 'Colocación de tapas de Piletas de patios - B.A - B.C', maestro: 25157.88, cotizado: 287231.00, dif: 262073.12, desvio: 1041.71 },
  ];

  const nombresUnicos = useMemo(() => [...new Set(data.map(item => item.proyecto))].sort(), [data]);
  const veredictosUnicos = ['Apto', 'Alerta', 'Crítico'];

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
      const matchNombre = selectedNombres.length === 0 || selectedNombres.includes(item.proyecto);
      const matchVeredicto = selectedVeredictos.length === 0 || selectedVeredictos.includes(item.estado);
      return matchNombre && matchVeredicto;
    });
  }, [data, selectedNombres, selectedVeredictos]);

  const getStatusStyles = (estado) => {
    const e = estado?.toLowerCase() || '';
    if (e.includes('apto')) return 'bg-[#c6efce] text-[#006100] border-[#92d050]';
    if (e.includes('alerta')) return 'bg-[#ffeb9c] text-[#9c6500] border-[#ffc000]';
    return 'bg-[#ffc7ce] text-[#9c0006] border-[#ff0000]';
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setView('detail');
  };

  // Renderizado de la Vista de Lista Principal
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans text-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado Institucional */}
          <div className="bg-[#1f4e3d] text-white p-6 rounded-t-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-lg border border-white/20">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight uppercase tracking-widest">Control_Aptitud_Presupuestaria</h1>
                <p className="text-green-200 text-xs font-medium uppercase tracking-widest opacity-80 italic">Ministerio de Infraestructura</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={fetchData} 
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-lg transition text-xs font-semibold border border-white/20"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualizar
              </button>
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-lg transition text-sm font-semibold shadow-md">
                <Download size={16} /> Descargar Reporte
              </button>
            </div>
          </div>

          {/* Filtros de Navegación */}
          <div className="bg-white border-x border-b border-gray-200 p-6 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-wider ml-1">Seleccionar Licitación / Obra</label>
              <button 
                onClick={() => { setIsNombreOpen(!isNombreOpen); setIsVeredictoOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg bg-white transition-all ${isNombreOpen ? 'ring-2 ring-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="text-xs truncate font-semibold text-gray-700">
                  {selectedNombres.length === 0 ? 'Todas las Obras' : `${selectedNombres.length} seleccionadas`}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isNombreOpen ? 'rotate-180' : ''}`} />
              </button>
              {isNombreOpen && (
                <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-2 max-h-80 overflow-y-auto">
                  <div className="sticky top-0 bg-white pb-2 mb-2 border-b border-gray-100 flex justify-between px-2">
                    <button onClick={() => setSelectedNombres([])} className="text-[10px] font-bold text-red-500 uppercase hover:underline">Limpiar</button>
                    <button onClick={() => setIsNombreOpen(false)} className="text-[10px] font-bold text-[#1f4e3d] uppercase hover:underline">Listo</button>
                  </div>
                  {nombresUnicos.map(n => (
                    <div key={n} onClick={() => handleToggle(selectedNombres, setSelectedNombres, n)} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${selectedNombres.includes(n) ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${selectedNombres.includes(n) ? 'bg-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-300'}`}>
                        {selectedNombres.includes(n) && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-[11px] ${selectedNombres.includes(n) ? 'font-bold text-[#1f4e3d]' : 'text-gray-600'}`}>{n}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full md:w-72">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-wider ml-1">Estado de Aptitud</label>
              <button 
                onClick={() => { setIsVeredictoOpen(!isVeredictoOpen); setIsNombreOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg bg-white transition-all ${isVeredictoOpen ? 'ring-2 ring-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <span className="text-xs font-semibold text-gray-700">
                  {selectedVeredictos.length === 0 ? 'Todos los Estados' : `${selectedVeredictos.length} seleccionados`}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isVeredictoOpen ? 'rotate-180' : ''}`} />
              </button>
              {isVeredictoOpen && (
                <div className="absolute z-30 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-2">
                  {veredictosUnicos.map(v => (
                    <div key={v} onClick={() => handleToggle(selectedVeredictos, setSelectedVeredictos, v)} className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${selectedVeredictos.includes(v) ? 'bg-green-50' : 'hover:bg-gray-50'}`}>
                      <div className={`w-4 h-4 border rounded flex items-center justify-center transition-all ${selectedVeredictos.includes(v) ? 'bg-[#1f4e3d] border-[#1f4e3d]' : 'border-gray-300'}`}>
                        {selectedVeredictos.includes(v) && <Check size={12} className="text-white" />}
                      </div>
                      <span className={`text-[11px] ${selectedVeredictos.includes(v) ? 'font-bold text-[#1f4e3d]' : 'text-gray-600'}`}>{v}</span>
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
                  <tr className="bg-gray-50 border-b border-gray-200 text-left">
                    <th className="p-4 text-[11px] font-bold text-[#1f4e3d] uppercase tracking-wider">Nombre del Archivo / Licitación</th>
                    <th className="p-4 text-right text-[11px] font-bold text-[#1f4e3d] uppercase tracking-wider">Presupuestado</th>
                    <th className="p-4 text-center text-[11px] font-bold text-[#1f4e3d] uppercase tracking-wider">Desvío (%)</th>
                    <th className="p-4 text-center text-[11px] font-bold text-[#1f4e3d] uppercase tracking-wider">Veredicto Final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="4" className="p-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest italic">Sincronizando con Base de Datos...</td></tr>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr 
                        key={item.id} 
                        onClick={() => handleRowClick(item)} 
                        className="hover:bg-blue-50/80 cursor-pointer transition-colors group"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-100 p-2 rounded text-gray-400 group-hover:text-blue-500 transition-colors">
                              <AlertCircle size={14} />
                            </div>
                            <span className="text-xs text-gray-700 font-medium truncate max-w-sm group-hover:text-blue-700 transition-colors">{item.proyecto}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-xs font-bold text-gray-800 tabular-nums">
                            {formatCurrency(item.presupuestado)}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-xs font-black tabular-nums ${item.desviacion <= 5 ? 'text-green-600' : 'text-rose-600'}`}>
                            {item.desviacion > 0 ? '+' : ''}{item.desviacion}%
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block w-full px-3 py-1.5 rounded text-[10px] font-black uppercase border shadow-sm ${getStatusStyles(item.estado)}`}>
                            {item.estado}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-24 text-center text-gray-400 font-bold uppercase tracking-widest opacity-40">
                        <Filter size={48} className="mx-auto mb-2" /> Sin Coincidencias
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Resumen de Datos */}
            <div className="bg-[#f8fafc] p-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Analizado</p>
                  <p className="text-xl font-black text-[#1f4e3d]">{filteredData.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Suma de Ofertas</p>
                  <p className="text-xl font-black text-[#1f4e3d]">
                    {formatCurrency(filteredData.reduce((acc, curr) => acc + (curr.presupuestado || 0), 0))}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="px-3 py-1 border-l-4 border-[#92d050] bg-white shadow-sm text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Aptos</p>
                  <p className="text-sm font-black text-green-700">{filteredData.filter(d => d.estado === 'Apto').length}</p>
                </div>
                <div className="px-3 py-1 border-l-4 border-[#ffc000] bg-white shadow-sm text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Alerta</p>
                  <p className="text-sm font-black text-amber-700">{filteredData.filter(d => d.estado === 'Alerta').length}</p>
                </div>
                <div className="px-3 py-1 border-l-4 border-[#ff0000] bg-white shadow-sm text-center">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Críticos</p>
                  <p className="text-sm font-black text-red-700">{filteredData.filter(d => d.estado === 'Crítico').length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista Detallada del Presupuesto Seleccionado
  return (
    <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => setView('list')} 
            className="flex items-center gap-2 text-[#1f4e3d] hover:bg-[#1f4e3d] hover:text-white px-4 py-2 rounded-lg transition font-bold text-sm"
          >
            <ArrowLeft size={18} /> Volver al Listado
          </button>
          <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase shadow-sm ${getStatusStyles(selectedItem.estado)}`}>
            {selectedItem.estado}
          </div>
        </div>

        {/* Sección de Datos Técnicos */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-200">
          <div className="bg-gray-50 px-6 py-3 border-b flex items-center gap-2">
            <Building2 size={18} className="text-[#1f4e3d]" />
            <h2 className="text-xs font-bold text-[#1f4e3d] uppercase tracking-wider">Datos Técnicos del Presupuesto</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Obra / Proyecto</span>
                <span className="text-xs font-bold text-gray-700 text-right">{selectedItem.proyecto}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Monto Presupuestado</span>
                <span className="text-sm font-black text-[#1f4e3d]">{formatCurrency(selectedItem.presupuestado)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase">ID Interno</span>
                <span className="text-xs font-black text-gray-800 text-right">#{selectedItem.id}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Total Ejecutado</span>
                <span className="text-sm font-black text-rose-700">{formatCurrency(selectedItem.ejecutado)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Desglose Comparativo */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-[#1f4e3d] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-green-400" />
              <h3 className="text-white text-xs font-bold uppercase tracking-widest">Desglose de Costos de Obra</h3>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded text-white text-xs font-bold">
              <TrendingUp size={14} className={selectedItem.desviacion > 5 ? "text-red-400" : "text-green-400"} />
              Desvío Total: {selectedItem.desviacion}%
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="p-4 text-[9px] font-black text-gray-500 uppercase">Ítem / Designación de Tareas</th>
                  <th className="p-4 text-right text-[9px] font-black text-gray-500 uppercase">Unit. Maestro</th>
                  <th className="p-4 text-right text-[9px] font-black text-gray-500 uppercase">Unit. Cotizado</th>
                  <th className="p-4 text-center text-[9px] font-black text-gray-500 uppercase">Desvío %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {budgetItems.map((bi, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 max-w-sm">
                      <p className="text-[10px] font-medium text-gray-700 leading-tight">{bi.item}</p>
                    </td>
                    <td className="p-4 text-right text-[10px] text-gray-400 font-medium">{formatCurrency(bi.maestro)}</td>
                    <td className="p-4 text-right text-[10px] font-bold text-gray-800">{formatCurrency(bi.cotizado)}</td>
                    <td className="p-4 text-center">
                      <div className={`inline-block px-2 py-0.5 rounded text-[9px] font-black border ${
                        bi.desvio > 20 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {bi.desvio > 0 ? '+' : ''}{bi.desvio.toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end gap-6 items-center">
            <div className="text-right">
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Veredicto Final</p>
              <p className={`text-xs font-black uppercase ${selectedItem.estado === 'Crítico' ? 'text-red-600' : 'text-green-700'}`}>
                {selectedItem.estado}
              </p>
            </div>
            <button className="bg-[#1f4e3d] text-white px-5 py-2 rounded font-bold text-[10px] uppercase hover:bg-black transition shadow-sm">
              Generar XML Presupuestario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
