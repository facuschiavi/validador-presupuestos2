import React, { useState, useMemo } from 'react';
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
  TrendingUp
} from 'lucide-react';

const App = () => {
  // Estado para la navegación entre vistas
  const [view, setView] = useState('list'); // 'list' o 'detail'
  const [selectedItem, setSelectedItem] = useState(null);

  // Datos originales restaurados
  const [data] = useState([
    { id: 1, nombre: 'ESC. LUIS VERNET Presupuesto-REVISADO.xlsx', monto: 12450800.50, desvio: -13.29, veredicto: 'APTO (En Rango)', empresa: 'SCHIAVI ANGEL EDUARDO', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
    { id: 2, nombre: 'Planilla SIGOP Obras Menores - Esc. José Manuel Estrada', monto: 8900450.00, desvio: 0.00, veredicto: 'APTO (En Rango)', empresa: 'CONSTRUCCIONES S.A.', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
    { id: 3, nombre: 'Planilla SIGOP Obras Menores - Esc. Jorge Luis Borges', monto: 7500000.00, desvio: 0.00, veredicto: 'APTO (En Rango)', empresa: 'OBRAS CIVILES SRL', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
    { id: 4, nombre: 'PME 2026 - ESCUELA MARTIN YANZON - PLAN A SAS', monto: 15600780.20, desvio: 3.23, veredicto: 'APTO (En Rango)', empresa: 'PLAN A SAS', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
    { id: 5, nombre: 'ESC JOSE DE CALAZANZ-REVISADO.xlsx', monto: 18900200.00, desvio: 7.36, veredicto: 'EN OBSERVACIÓN (Requiere Justificación)', empresa: 'SUR CONSTRUCCIONES', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
    { id: 6, nombre: 'Planilla SIGOP PME 2026 - ESC. PROV DE BS. AS.', monto: 11200000.00, desvio: 8.26, veredicto: 'EN OBSERVACIÓN (Requiere Justificación)', empresa: 'ESTRUCTURAS SRL', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
    { id: 7, nombre: 'ENI 24 Alfonsina Storni.xlsx', monto: 9450600.00, desvio: 16.03, veredicto: 'EN OBSERVACIÓN (Requiere Justificación)', empresa: 'ALFA CONSTRUCTORA', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
    { id: 8, nombre: 'Planilla SIGOP PME 2026 - ENI N°4 MARTHA SALOTTI', monto: 22300150.75, desvio: 24.45, veredicto: 'NO APTO (Fuera de Rango / Sobrevaluado)', empresa: 'NORTE OBRAS SRL', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
    { id: 9, nombre: 'ESC ALFONSINA STORNI PERIODO ESTIVAL 2026-1.xlsx', monto: 31000500.00, desvio: 37.65, veredicto: 'NO APTO (Fuera de Rango / Sobrevaluado)', empresa: 'ZONA OESTE CONSTRUCCIONES', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
    { id: 10, nombre: 'ESCUELA ALBERT EINSTEIN 2026.xlsx', monto: 14750000.00, desvio: 46.02, veredicto: 'NO APTO (Fuera de Rango / Sobrevaluado)', empresa: 'GENESIS OBRAS', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
    { id: 11, nombre: 'Planilla SIGOP PME 2026 - PAEZ REVISADO.xlsx', monto: 19800400.00, desvio: 71.75, veredicto: 'NO APTO (Fuera de Rango / Sobrevaluado)', empresa: 'GARCIA HNOS', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
    { id: 12, nombre: 'ZOM FELIPA ROJAS ESTIVAL 2026.xlsx', monto: 28400000.00, desvio: 81.52, veredicto: 'NO APTO (Fuera de Rango / Sobrevaluado)', empresa: 'ROJAS CONSTRUCCIONES', comitente: 'DIRECCIÓN DE MANTENIMIENTO Y OBRAS MENORES' },
  ]);

  // Mock de ítems para el detalle (Captura 3)
  const budgetItems = [
    { item: 'Limpieza de cubiertas de techo (superficie neta)', maestro: 653.82, cotizado: 2152.19, dif: 1498.37, desvio: 229.17 },
    { item: 'Canaleta descarga pluvial de Chapa Gº n.º 25 - Desarrollo 0.33 m.', maestro: 57624.41, cotizado: 2110.40, dif: -55514.01, desvio: -96.34 },
    { item: 'Desobstrucción de cañerías de desagüe cloacal y/o pluvial', maestro: 1860.86, cotizado: 4596.90, dif: 2736.04, desvio: 147.03 },
    { item: 'Provisión y colocación de cámara de inspección 0.60x0.60', maestro: 280000.00, cotizado: 334140.00, dif: 54140.00, desvio: 19.33 },
    { item: 'Colocación de tapas de Piletas de patios - B.A - B.C', maestro: 25157.88, cotizado: 287231.00, dif: 262073.12, desvio: 1041.71 },
    { item: 'Lavado y desinfección de Tanques de Reserva 1100 lts', maestro: 60173.60, cotizado: 53307.00, dif: -6866.60, desvio: -11.41 },
    { item: 'Reemplazo de Tapa de tanque de reserva de P.R.F.V de 1100 lts', maestro: 21254.93, cotizado: 31949.40, dif: 10694.47, desvio: 50.32 },
    { item: 'Provisión y colocación de flexible para inodoro (entramado metalico)', maestro: 9013.50, cotizado: 86928.00, dif: 77914.50, desvio: 864.42 },
    { item: 'Provisión y colocación de O ring de goma + Tornillo de fijación', maestro: 19916.63, cotizado: 518942.55, dif: 499025.92, desvio: 2505.57 },
  ];

  const [selectedNombres, setSelectedNombres] = useState([]);
  const [selectedVeredictos, setSelectedVeredictos] = useState([]);
  const [isNombreOpen, setIsNombreOpen] = useState(false);
  const [isVeredictoOpen, setIsVeredictoOpen] = useState(false);

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
    }).format(val);
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
      const matchVeredicto = selectedVeredictos.length === 0 || selectedVeredictos.includes(item.veredicto);
      return matchNombre && matchVeredicto;
    });
  }, [data, selectedNombres, selectedVeredictos]);

  const getStatusStyles = (veredicto) => {
    if (veredicto.includes('APTO (En Rango)')) return 'bg-[#c6efce] text-[#006100] border-[#92d050]';
    if (veredicto.includes('EN OBSERVACIÓN')) return 'bg-[#ffeb9c] text-[#9c6500] border-[#ffc000]';
    return 'bg-[#ffc7ce] text-[#9c0006] border-[#ff0000]';
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
    setView('detail');
  };

  // VISTA DE LISTA (TU CÓDIGO ORIGINAL CON ACCIÓN DE CLIC)
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans text-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Header Superior Original */}
          <div className="bg-[#1f4e3d] text-white p-6 rounded-t-xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-lg border border-white/20">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">CONTROL_APTITUD_PRESUPUESTARIA</h1>
                <p className="text-green-200 text-xs font-medium uppercase tracking-widest opacity-80 italic">Ministerio de Infraestructura</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-5 py-2.5 rounded-lg transition text-sm font-semibold shadow-md active:scale-95">
              <Download size={16} /> Descargar Reporte Completo
            </button>
          </div>

          {/* Panel de Filtros Original */}
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

          {/* Tabla principal Original */}
          <div className="bg-white rounded-b-xl shadow-xl overflow-hidden border-x border-b border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-left text-[11px] font-bold text-[#1f4e3d] uppercase tracking-wider">Nombre del Archivo / Licitación</th>
                    <th className="p-4 text-right text-[11px] font-bold text-[#1f4e3d] uppercase tracking-wider w-44">Monto de la Oferta</th>
                    <th className="p-4 text-center text-[11px] font-bold text-[#1f4e3d] uppercase tracking-wider w-36">Desvío (%)</th>
                    <th className="p-4 text-center text-[11px] font-bold text-[#1f4e3d] uppercase tracking-wider w-64">Veredicto Final</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredData.length > 0 ? (
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
                            <span className="text-xs text-gray-700 font-medium truncate max-w-sm group-hover:text-blue-700 transition-colors">{item.nombre}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-xs font-bold text-gray-800 tabular-nums">
                            {formatCurrency(item.monto)}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-xs font-black tabular-nums ${item.desvio <= 5 ? 'text-green-600' : item.desvio <= 20 ? 'text-amber-600' : 'text-red-600'}`}>
                            {item.desvio > 0 ? '+' : ''}{item.desvio.toFixed(2)}%
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-block w-full px-3 py-1.5 rounded text-[10px] font-black uppercase border shadow-sm ${getStatusStyles(item.veredicto)}`}>
                            {item.veredicto}
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

            {/* Footer de Resumen Original */}
            <div className="bg-[#f8fafc] p-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Analizado</p>
                  <p className="text-xl font-black text-[#1f4e3d]">{filteredData.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Suma de Ofertas</p>
                  <p className="text-xl font-black text-[#1f4e3d]">
                    {formatCurrency(filteredData.reduce((acc, curr) => acc + curr.monto, 0))}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="px-3 py-1 border-l-4 border-[#92d050] bg-white shadow-sm">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Aptos</p>
                  <p className="text-sm font-black text-green-700">{filteredData.filter(d => d.veredicto.includes('APTO')).length}</p>
                </div>
                <div className="px-3 py-1 border-l-4 border-[#ffc000] bg-white shadow-sm">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Obs.</p>
                  <p className="text-sm font-black text-amber-700">{filteredData.filter(d => d.veredicto.includes('OBSERVACIÓN')).length}</p>
                </div>
                <div className="px-3 py-1 border-l-4 border-[#ff0000] bg-white shadow-sm">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">No Aptos</p>
                  <p className="text-sm font-black text-red-700">{filteredData.filter(d => d.veredicto.includes('NO APTO')).length}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-[0.2em]">
            Este reporte es de carácter interno y requiere validación del SIGOP para su aprobación final.
          </p>
        </div>
      </div>
    );
  }

  // VISTA DE DETALLE (BASADA EN LAS CAPTURAS)
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
          <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase shadow-sm ${getStatusStyles(selectedItem.veredicto)}`}>
            {selectedItem.veredicto}
          </div>
        </div>

        {/* Info General (Captura 1) */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border border-gray-200">
          <div className="bg-gray-50 px-6 py-3 border-b flex items-center gap-2">
            <Building2 size={18} className="text-[#1f4e3d]" />
            <h2 className="text-xs font-bold text-[#1f4e3d] uppercase tracking-wider">Datos Técnicos del Presupuesto</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Comitente</span>
                <span className="text-xs font-bold text-gray-700 text-right">{selectedItem.comitente}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Obra</span>
                <span className="text-xs font-black text-[#1f4e3d] text-right">{selectedItem.nombre.split(' - ')[1] || 'ESCUELA DE REFERENCIA'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Empresa Constructora</span>
                <span className="text-xs font-black text-gray-800 text-right">{selectedItem.empresa}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase">Oferta Económica</span>
                <span className="text-sm font-black text-[#1f4e3d]">{formatCurrency(selectedItem.monto)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla Detalle Ítems (Captura 3) */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-[#1f4e3d] px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-green-400" />
              <h3 className="text-white text-xs font-bold uppercase tracking-widest">Desglose Comparativo de Costos</h3>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded text-white text-xs font-bold">
               <TrendingUp size={14} className={selectedItem.desvio > 0 ? "text-red-400" : "text-green-400"} />
               Desvío de Oferta: {selectedItem.desvio}%
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-left text-[9px] font-black text-gray-500 uppercase">Ítem / Designación de Tareas</th>
                  <th className="p-4 text-right text-[9px] font-black text-gray-500 uppercase">Unit. Maestro</th>
                  <th className="p-4 text-right text-[9px] font-black text-gray-500 uppercase">Unit. Cotizado</th>
                  <th className="p-4 text-right text-[9px] font-black text-gray-500 uppercase">Diferencia</th>
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
                    <td className="p-4 text-right text-[10px] font-medium text-gray-600">
                      {bi.dif > 0 ? '+' : ''}{formatCurrency(bi.dif)}
                    </td>
                    <td className="p-4 text-center">
                      <div className={`inline-block px-2 py-0.5 rounded text-[9px] font-black border ${
                        bi.desvio > 20 ? 'bg-red-50 text-red-700 border-red-200' : 
                        bi.desvio < 0 ? 'bg-green-50 text-green-700 border-green-200' : 
                        'bg-gray-50 text-gray-600 border-gray-200'
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
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Estado de Análisis</p>
                <p className={`text-xs font-black uppercase ${selectedItem.desvio > 20 ? 'text-red-600' : 'text-green-700'}`}>
                  {selectedItem.veredicto}
                </p>
             </div>
             <button className="bg-[#1f4e3d] text-white px-5 py-2 rounded font-bold text-[10px] uppercase hover:bg-black transition shadow-sm">
               Descargar XML Presupuestario
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
