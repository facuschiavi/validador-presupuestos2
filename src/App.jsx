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
  Calendar
} from 'lucide-react';

// Manejo seguro de variables de entorno para evitar errores en entornos es2015
const getEnv = (key) => {
  try {
    return import.meta.env[key];
  } catch (e) {
    return null;
  }
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

// Inicialización condicional de Supabase
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
    if (!supabase) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('presupuestos') 
        .select('*');
      if (fetchError) throw fetchError;
      setDatos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = datos.filter(p => 
    p.proyecto?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fmt = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val || 0);

  // Pantalla de error si no hay configuración
  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-200">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-800 mb-4">Error de Credenciales</h1>
          <p className="text-slate-500 mb-6 font-medium">
            Faltan las variables de entorno en el sistema. Asegúrate de que <b>VITE_SUPABASE_URL</b> y <b>VITE_SUPABASE_ANON_KEY</b> estén definidas.
          </p>
          <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold transition-transform active:scale-95">
            Reintentar
          </button
