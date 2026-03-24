import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Upload, 
  Search, 
  FileText, 
  ArrowLeft,
  MoreVertical,
  Check,
  X,
  FileUp,
  Database
} from 'lucide-react';

const App = () => {
  const [view, setView] = useState('list'); // 'list', 'detail', 'upload'
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Datos de ejemplo basados en tu captura
  const [data] = useState([
    { id: 1, proyecto: 'CONSTRUCCIÓN ESCUELA 12', presupuesto: 45000000, desviacion: 8, estado: 'APTO' },
    { id: 2, proyecto: 'REFACCIÓN HOSPITAL CENTRAL', presupuesto: 12500000, desviacion: 18, estado: 'ALERTA' },
    { id: 3, proyecto: 'MPA - PLAZA DE MAYO', presupuesto: 8900000, desviacion: 5, estado: 'APTO' },
  ]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency', currency: 'ARS'
    }).format(val);
  };

  // --- COMPONENTES DE DISEÑO FIEL ---

  const Header = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Validador de Presupuestos</h1>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => setView('upload')}
          className="border border-black px-4 py-2 text-[11px] font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all flex items-center gap-2"
        >
          <Upload size={14} /> Cargar Archivos
        </button>
      </div>
    </div>
  );

  const Table = () => (
    <div className="bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#f9fafb] border-y border-gray-200">
            <th className="px-6 py-3 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nombre del Proyecto</th>
            <th className="px-6 py-3 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Monto Total</th>
            <th className="px-6 py-3 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">Desvío</th>
            <th className="px-6 py-3 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">Veredicto</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map(item => (
            <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedItem(item); setView('detail'); }}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.proyecto}</td>
              <td className="px-6 py-4 text-sm text-right text-gray-600 font-mono">{formatCurrency(item.presupuesto)}</td>
              <td className="px-6 py-4 text-center">
                <span className={`text-xs font-bold ${item.desviacion > 10 ? 'text-red-500' : 'text-gray-900'}`}>
                  {item.desviacion}%
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 text-[10px] font-bold rounded-md ${
                  item.estado === 'APTO' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-orange-50 text-orange-600 border border-orange-200'
                }`}>
                  {item.estado}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <MoreVertical size={16} className="text-gray-400 inline" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const UploadView = () => (
    <div className="p-8 max-w-4xl mx-auto">
      <button onClick={() => setView('list')} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-black font-bold text-xs uppercase tracking-widest">
        <ArrowLeft size={16} /> Volver al listado
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cargar Maestro */}
        <div className="bg-white border border-gray-200 p-8 rounded-sm hover:border-black transition-all group">
          <div className="mb-4 bg-gray-50 w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-black group-hover:text-white transition-all">
            <Database size={24} />
          </div>
          <h3 className="text-sm font-bold uppercase mb-2">Cargar Listado Maestro</h3>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Actualiza los precios unitarios de referencia del Ministerio. Sube el Excel con el desglose de ítems oficial.
          </p>
          <label className="inline-block border border-black px-6 py-2 text-[10px] font-bold uppercase cursor-pointer hover:bg-black hover:text-white transition-all">
            Seleccionar Excel
            <input type="file" className="hidden" />
          </label>
        </div>

        {/* Cargar Presupuesto a Controlar */}
        <div className="bg-white border border-gray-200 p-8 rounded-sm hover:border-black transition-all group">
          <div className="mb-4 bg-gray-50 w-12 h-12 flex items-center justify-center rounded-lg group-hover:bg-black group-hover:text-white transition-all">
            <FileUp size={24} />
          </div>
          <h3 className="text-sm font-bold uppercase mb-2">Nuevo Presupuesto</h3>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Sube el archivo del contratista para realizar el análisis de desvíos y verificación de ítems automática.
          </p>
          <label className="inline-block border border-black px-6 py-2 text-[10px] font-bold uppercase cursor-pointer hover:bg-black hover:text-white transition-all">
            Cargar Presupuesto
            <input type="file" className="hidden" />
          </label>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-sm">
        <h4 className="text-[10px] font-black uppercase text-blue-800 mb-2 flex items-center gap-2">
          <Check size={14} /> Recomendación de formato
        </h4>
        <p className="text-xs text-blue-700/80 leading-relaxed">
          Para una lectura óptima, asegúrate de que el archivo contenga las columnas: <b>ITEM, DESCRIPCIÓN, UNIDAD, CANTIDAD y PRECIO UNITARIO</b>. La IA se encargará de mapear los nombres si no coinciden.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header />
      
      {view === 'list' && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="BUSCAR PROYECTO..." 
                className="w-full border border-gray-200 py-2 pl-10 pr-4 text-[11px] font-bold uppercase tracking-wider focus:outline-none focus:border-black"
              />
            </div>
          </div>
          <Table />
        </div>
      )}

      {view === 'upload' && <UploadView />}

      {view === 'detail' && selectedItem && (
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('list')} className="text-gray-400 hover:text-black transition-all">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-lg font-bold">{selectedItem.proyecto}</h2>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Análisis detallado de desviaciones</p>
              </div>
            </div>
            <div className={`px-4 py-2 text-[11px] font-bold border ${
              selectedItem.estado === 'APTO' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-orange-50 border-orange-200 text-orange-600'
            }`}>
              {selectedItem.estado}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="border border-gray-100 p-4">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Total Cotizado</span>
              <span className="text-xl font-bold font-mono">{formatCurrency(selectedItem.presupuesto)}</span>
            </div>
            <div className="border border-gray-100 p-4">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Referencia Maestro</span>
              <span className="text-xl font-bold font-mono text-gray-400">{formatCurrency(selectedItem.presupuesto * 0.92)}</span>
            </div>
            <div className="border border-gray-100 p-4">
              <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Desvío General</span>
              <span className={`text-xl font-bold ${selectedItem.desviacion > 10 ? 'text-red-500' : 'text-blue-600'}`}>
                {selectedItem.desviacion}%
              </span>
            </div>
          </div>

          <div className="text-center py-20 border-2 border-dashed border-gray-50 rounded-lg text-gray-300 uppercase font-black tracking-widest text-xs">
            Desglose de ítems comparativos
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
