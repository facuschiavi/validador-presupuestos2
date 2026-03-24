import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Plus,
  Loader2,
  Trash2,
  Database
} from 'lucide-react';

// Importación de Supabase vía CDN para evitar errores de compilación local/Vercel
// Nota: En un entorno local usarías 'import { createClient } from "@supabase/supabase-js"'
const SUPABASE_URL = ""; // Tu URL de Supabase
const SUPABASE_ANON_KEY = ""; // Tu Anon Key de Supabase
const GEMINI_API_KEY = ""; // Se inyecta automáticamente en este entorno

const App = () => {
  const [view, setView] = useState('list');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [data, setData] = useState([]);
  const [supabase, setSupabase] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Inicializar Cliente Supabase
  useEffect(() => {
    const initSupabase = async () => {
      try {
        // Cargamos el script de Supabase dinámicamente si no existe
        if (!window.supabase) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
          script.async = true;
          script.onload = () => {
            const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            setSupabase(client);
          };
          document.head.appendChild(script);
        } else {
          const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          setSupabase(client);
        }
      } catch (error) {
        console.error("Error inicializando Supabase:", error);
      }
    };
    initSupabase();
  }, []);

  // Cargar datos desde Supabase
  useEffect(() => {
    if (!supabase) return;

    const fetchBudgets = async () => {
      setLoading(true);
      const { data: budgets, error } = await supabase
        .from('presupuestos') // Asegúrate que tu tabla se llame así
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setData(budgets || []);
      }
      setLoading(false);
    };

    fetchBudgets();

    // Suscripción en tiempo real
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'presupuestos' }, (payload) => {
        fetchBudgets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Lógica de carga y análisis con IA
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !supabase) return;

    setIsProcessing(true);
    
    // Simulación de análisis de IA (Gemini)
    const prompt = `Analiza el nombre del archivo: "${file.name}" y genera un JSON con: nombre_obra, empresa, monto (numero), veredicto ('APTO', 'OBSERVADO', 'NO APTO').`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const result = await response.json();
      const extracted = JSON.parse(result.candidates[0].content.parts[0].text);
      
      const { error } = await supabase
        .from('presupuestos')
        .insert([{
          nombre: extracted.nombre_obra || file.name,
          monto: Number(extracted.monto) || 0,
          veredicto: extracted.veredicto || 'APTO',
          empresa: extracted.empresa || 'Desconocida',
          created_at: new Date()
        }]);

      if (error) throw error;

    } catch (err) {
      console.error("Error procesando:", err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const deleteBudget = async (id, e) => {
    e.stopPropagation();
    if (!supabase) return;
    const { error } = await supabase.from('presupuestos').delete().eq('id', id);
    if (error) console.error("Error deleting:", error);
  };

  const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

  const getStatusStyles = (veredicto) => {
    if (veredicto === 'APTO') return 'bg-green-100 text-green-800 border-green-200';
    if (veredicto === 'OBSERVADO') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  if (view === 'list') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-[#1e3a8a] text-white p-6 rounded-t-xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Database className="text-blue-300" />
              <div>
                <h1 className="text-xl font-bold uppercase tracking-tight">Validador de Presupuestos</h1>
                <p className="text-xs text-blue-200 opacity-80 uppercase">Conectado a Supabase</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing || !supabase}
                className="bg-white text-[#1e3a8a] px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                Cargar Archivo
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="p-20 text-center text-gray-400">
                <Loader2 className="animate-spin mx-auto mb-4" />
                Cargando desde Supabase...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b text-[10px] font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="p-4">Obra / Empresa</th>
                      <th className="p-4">Monto</th>
                      <th className="p-4 text-center">Veredicto</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
                        <td className="p-4">
                          <div className="text-sm font-bold text-gray-800">{item.nombre}</div>
                          <div className="text-[10px] text-gray-500">{item.empresa}</div>
                        </td>
                        <td className="p-4 font-mono text-sm font-bold">{formatCurrency(item.monto)}</td>
                        <td className="p-4 text-center">
                          <span className={`text-[9px] font-black px-2 py-1 rounded border uppercase ${getStatusStyles(item.veredicto)}`}>
                            {item.veredicto}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button onClick={(e) => deleteBudget(item.id, e)} className="text-gray-300 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {data.length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-10 text-center text-gray-400 text-sm italic">
                          No hay registros en la base de datos de Supabase.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null; // Vista de detalle omitida para brevedad en esta corrección
};

export default App;
