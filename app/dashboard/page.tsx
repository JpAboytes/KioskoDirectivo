'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Justificante {
  _id: string;
  eventName: string;
  requester: string;
  status: 'pendiente' | 'aprobado' | 'rechazado';
  createdAt: string;
  justifiedDates: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [justificantes, setJustificantes] = useState<Justificante[]>([]);
  const [stats, setStats] = useState({ total: 0, pendientes: 0, aprobados: 0 });
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState<'crear' | 'mis-justificantes' | 'aprobar'>('crear');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchJustificantes();
    }
  }, [user]);

  const fetchJustificantes = async () => {
    try {
      const response = await fetch('/api/justificantes');
      const data = await response.json();
      
      if (data.success) {
        setJustificantes(data.data);
        
        // Calculate stats
        const total = data.data.length;
        const pendientes = data.data.filter((j: Justificante) => j.status === 'pendiente').length;
        const aprobados = data.data.filter((j: Justificante) => j.status === 'aprobado').length;
        setStats({ total, pendientes, aprobados });
      }
    } catch (error) {
      console.error('Error fetching justificantes:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sistema de Justificantes</h1>
            <p className="text-sm text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendientes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-5">
                <p className="text-sm font-medium text-gray-500">Aprobados</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.aprobados}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('crear')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'crear'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ✏️ Crear Justificante
              </button>
              <button
                onClick={() => setActiveTab('mis-justificantes')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'mis-justificantes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📋 Mis Justificantes
              </button>
              <button
                onClick={() => setActiveTab('aprobar')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'aprobar'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ✅ Aprobar Justificantes
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'crear' && <CrearJustificante user={user} onSuccess={fetchJustificantes} />}
            {activeTab === 'mis-justificantes' && <MisJustificantes justificantes={justificantes.filter(j => j.status !== 'pendiente' || true)} />}
            {activeTab === 'aprobar' && <AprobarJustificantes justificantes={justificantes.filter(j => j.status === 'pendiente')} onUpdate={fetchJustificantes} user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
}

// Componente para crear justificante
function CrearJustificante({ user, onSuccess }: { user: any; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    requester: '',
    eventName: '',
    justifiedDates: '',
    studentsText: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const dates = formData.justifiedDates.split(',').map(d => d.trim()).filter(d => d);

      const response = await fetch('/api/justificantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          justifiedDates: dates,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ requester: '', eventName: '', justifiedDates: '', studentsText: '' });
        onSuccess();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || 'Error al crear el justificante');
      }
    } catch (err) {
      setError('Error al crear el justificante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Crear Nuevo Justificante</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          ✅ Justificante creado exitosamente
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Solicitante <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.requester}
            onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona...</option>
            <option value="Deportes">Deportes</option>
            <option value="Asuntos Estudiantiles">Asuntos Estudiantiles</option>
            <option value="Coordinador">Coordinador</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Evento <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Torneo de fútbol"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fechas Justificadas <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.justifiedDates}
            onChange={(e) => setFormData({ ...formData, justifiedDates: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 2025-11-15, 2025-11-16"
          />
          <p className="mt-1 text-sm text-gray-500">Separa las fechas con comas</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lista de Estudiantes <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.studentsText}
            onChange={(e) => setFormData({ ...formData, studentsText: e.target.value })}
            required
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej:&#10;Juan Pérez – 12345 – Ingeniería&#10;María García – 67890 – Administración"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
        >
          {loading ? 'Guardando...' : 'Crear Justificante'}
        </button>
      </form>
    </div>
  );
}

// Componente para ver mis justificantes
function MisJustificantes({ justificantes }: { justificantes: Justificante[] }) {
  if (justificantes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tienes justificantes aún</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Mis Justificantes</h2>
      <div className="space-y-4">
        {justificantes.map((j) => (
          <div key={j._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{j.eventName}</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  j.status === 'aprobado'
                    ? 'bg-green-100 text-green-800'
                    : j.status === 'rechazado'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {j.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Solicitante:</strong> {j.requester}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Fechas:</strong> {j.justifiedDates.join(', ')}
            </p>
            <p className="text-sm text-gray-500">
              Creado: {new Date(j.createdAt).toLocaleDateString('es-MX')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente para aprobar justificantes
function AprobarJustificantes({ justificantes, onUpdate, user }: { justificantes: Justificante[]; onUpdate: () => void; user: any }) {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = async (id: string, action: 'aprobado' | 'rechazado') => {
    setProcessing(id);
    try {
      const response = await fetch('/api/justificantes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status: action,
          approvedBy: user.email,
        }),
      });

      const data = await response.json();
      if (data.success) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProcessing(null);
    }
  };

  if (justificantes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay justificantes pendientes de aprobación</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Justificantes Pendientes</h2>
      <div className="space-y-4">
        {justificantes.map((j) => (
          <div key={j._id} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">{j.eventName}</h3>
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              <p><strong>Solicitante:</strong> {j.requester}</p>
              <p><strong>Fechas:</strong> {j.justifiedDates.join(', ')}</p>
              <p><strong>Estudiantes:</strong></p>
              <pre className="bg-gray-50 p-2 rounded text-xs whitespace-pre-wrap">{j.studentsText}</pre>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(j._id, 'aprobado')}
                disabled={processing === j._id}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
              >
                {processing === j._id ? 'Procesando...' : '✅ Aprobar'}
              </button>
              <button
                onClick={() => handleApprove(j._id, 'rechazado')}
                disabled={processing === j._id}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
              >
                {processing === j._id ? 'Procesando...' : '❌ Rechazar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
