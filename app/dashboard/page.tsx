'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

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
  const [activeTab, setActiveTab] = useState<'crear' | 'mis-justificantes' | 'aprobar' | 'subir-archivo'>('crear');

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
      const response = await fetch('https://mongo-api-fawn.vercel.app/api/justificantes', {
        headers: {
          'X-API-KEY': process.env.NEXT_PUBLIC_MONGO_API_KEY || ''
        }
      });
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
              <div className="shrink-0 bg-blue-500 rounded-md p-3">
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
              <div className="shrink-0 bg-yellow-500 rounded-md p-3">
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
                Crear Justificante
              </button>
              <button
                onClick={() => setActiveTab('mis-justificantes')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'mis-justificantes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Mis Justificantes
              </button>
              <button
                onClick={() => setActiveTab('aprobar')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'aprobar'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Aprobar Justificantes
              </button>
              <button
                onClick={() => setActiveTab('subir-archivo')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'subir-archivo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Subir Archivo
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'crear' && <CrearJustificante user={user} onSuccess={fetchJustificantes} />}
            {activeTab === 'mis-justificantes' && <MisJustificantes justificantes={justificantes.filter(j => j.status !== 'pendiente' || true)} />}
            {activeTab === 'aprobar' && <AprobarJustificantes justificantes={justificantes.filter(j => j.status === 'pendiente')} onUpdate={fetchJustificantes} user={user} />}
            {activeTab === 'subir-archivo' && <SubirArchivoHTM />}
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
    selectedStudents: [] as string[],
  });
  const [students, setStudents] = useState<Array<{ matricula: string; nombre: string; apellidos: string; carrera: string }>>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Cargar estudiantes desde el servidor
  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const response = await fetch('https://mongo-api-fawn.vercel.app/api/estudiantes', {
          headers: {
            'X-API-KEY': process.env.NEXT_PUBLIC_MONGO_API_KEY || ''
          }
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setStudents(data.data);
        }
      } catch (err) {
        console.error('Error al cargar estudiantes:', err);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  // Filtrar estudiantes según búsqueda
  const filteredStudents = students.filter(s => 
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.matricula.includes(searchTerm) ||
    s.carrera.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStudent = (matricula: string) => {
    setFormData(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(matricula)
        ? prev.selectedStudents.filter(m => m !== matricula)
        : [...prev.selectedStudents, matricula]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (formData.selectedStudents.length === 0) {
        setError('Debes seleccionar al menos un estudiante');
        setLoading(false);
        return;
      }

      const dates = formData.justifiedDates.split(',').map(d => d.trim()).filter(d => d);

      // Construir texto de estudiantes desde selección
      const studentsText = formData.selectedStudents
        .map(matricula => {
          const student = students.find(s => s.matricula === matricula);
          if (student) {
            return `${student.nombre} ${student.apellidos} – ${student.matricula} – ${student.carrera}`;
          }
          return '';
        })
        .filter(Boolean)
        .join('\n');

      const response = await fetch('https://mongo-api-fawn.vercel.app/api/justificantes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X_API_KEY': process.env.NEXT_PUBLIC_MONGO_API_KEY || ''
        },
        body: JSON.stringify({
          requester: formData.requester,
          eventName: formData.eventName,
          justifiedDates: dates,
          studentsText,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setFormData({ requester: '', eventName: '', justifiedDates: '', selectedStudents: [] });
        setSearchTerm('');
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
            Seleccionar Estudiantes <span className="text-red-500">*</span>
          </label>
          
          {loadingStudents ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando estudiantes...</span>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre, matrícula o carrera..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              
              <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto">
                {filteredStudents.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No se encontraron estudiantes</p>
                ) : (
                  filteredStudents.map((student) => (
                    <label
                      key={student.matricula}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedStudents.includes(student.matricula)}
                        onChange={() => toggleStudent(student.matricula)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {student.nombre} {student.apellidos}
                        </p>
                        <p className="text-xs text-gray-500">
                          {student.matricula} • {student.carrera}
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
              
              {formData.selectedStudents.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {formData.selectedStudents.length} estudiante(s) seleccionado(s)
                </p>
              )}
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || loadingStudents}
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

// Componente para subir archivo HTM
function SubirArchivoHTM() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');
  const [processingStatus, setProcessingStatus] = useState('');
  const [stats, setStats] = useState<{ estudiantes: number; profesores: number; horarios: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.htm') && !selectedFile.name.endsWith('.html')) {
        setError('Por favor selecciona un archivo .htm o .html');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const processHTML = async (htmlContent: string) => {
    setProcessingStatus('📄 Procesando HTML...');
    
    // Crear un parser DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Estructuras para almacenar datos únicos
    const estudiantesMap = new Map();
    const profesoresMap = new Map();
    const horariosData: any[] = [];
    
    // Obtener todas las tablas
    const tables = doc.querySelectorAll('table');
    setProcessingStatus(`🔍 Procesando ${tables.length} tablas...`);
    
    for (const table of Array.from(tables)) {
      const rows = table.querySelectorAll('tr');
      let profesorActual: string | null = null;
      let profesorNombre = '';
      let profesorApellidos = '';
      let grupoActual = '';
      let materiaActual = '';
      
      for (const row of Array.from(rows)) {
        const text = row.textContent?.trim() || '';
        const cells = row.querySelectorAll('td, th');
        
        // Detectar línea de grupo y profesor (ej: "GRUPO:107C07-41 MAESTRO: 72256 RAMIREZ AVILA, ARMANDO MTRO.")
        if (text.includes('GRUPO:') && text.includes('MAESTRO:')) {
          const maestroMatch = text.match(/MAESTRO:\s*\d+\s+([^,]+),\s*([^\s]+)/);
          if (maestroMatch) {
            profesorApellidos = maestroMatch[1].trim();
            profesorNombre = maestroMatch[2].trim().replace(/MTRO\.|MTRA\.|DR\.|DRA\./gi, '').trim();
            const key = `${profesorNombre}_${profesorApellidos}`;
            
            if (!profesoresMap.has(key)) {
              profesoresMap.set(key, {
                nombre: profesorNombre,
                apellidos: profesorApellidos,
                correo: '',
                escuela: 'Ingeniería'
              });
            }
            profesorActual = key;
          }
          
          const grupoMatch = text.match(/GRUPO:([^\s]+)/);
          if (grupoMatch) {
            grupoActual = grupoMatch[1].trim();
          }
        }
        
        // Detectar línea de materia (buscar patrones de código de materia)
        if (text.match(/^[A-Z]{2,}\d{3}/) && !text.includes('MATRICULA')) {
          const materiaMatch = text.match(/^([A-Z]{2,}\d{3})/);
          if (materiaMatch) {
            materiaActual = materiaMatch[1];
          }
        }
        
        // Detectar línea de estudiante (debe tener más de 4 columnas y contener matrícula)
        if (cells.length >= 6) {
          const numeroCell = cells[0]?.textContent?.trim();
          const matriculaCell = cells[4]?.textContent?.trim();
          const nombreCell = cells[5]?.textContent?.trim();
          
          // Verificar que es una fila de estudiante (número, matrícula válida y nombre)
          if (numeroCell && /^\d+$/.test(numeroCell) && 
              matriculaCell && /^\d{6}$/.test(matriculaCell) && 
              nombreCell && nombreCell.includes(',')) {
            
            const [apellidosStr, nombreStr] = nombreCell.split(',').map(s => s.trim());
            const programaCell = cells[1]?.textContent?.trim() || '';
            const carrera = programaCell || 'Sin especificar';
            
            if (!estudiantesMap.has(matriculaCell)) {
              estudiantesMap.set(matriculaCell, {
                matricula: matriculaCell,
                nombre: nombreStr || '',
                apellidos: apellidosStr || '',
                carrera: carrera,
                escuela: 'Ingeniería',
                status: 'activo'
              });
            }
            
            // Guardar relación para horarios
            if (profesorActual && materiaActual) {
              horariosData.push({
                matricula: matriculaCell,
                profesorKey: profesorActual,
                materia: materiaActual,
                grupo: grupoActual
              });
            }
          }
        }
      }
    }
    
    const estudiantes = Array.from(estudiantesMap.values());
    const profesores = Array.from(profesoresMap.values());
    
    setProcessingStatus(`👥 ${estudiantes.length} estudiantes y 👨‍🏫 ${profesores.length} profesores encontrados`);
    
    return { estudiantes, profesores, horarios: horariosData };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setStats(null);
    setProcessingStatus('📖 Leyendo archivo...');

    try {
      // Leer el contenido del archivo
      const htmlContent = await file.text();
      
      // Procesar HTML en el cliente
      const { estudiantes, profesores, horarios } = await processHTML(htmlContent);
      
      setProcessingStatus('📤 Enviando datos al servidor en lotes...');
      
      // Dividir en lotes más pequeños para evitar error 413
      const BATCH_SIZE = 50; // Reducir tamaño de lote
      let batchCount = 0;
      
      // Enviar estudiantes en lotes
      for (let i = 0; i < estudiantes.length; i += BATCH_SIZE) {
        const batch = estudiantes.slice(i, i + BATCH_SIZE);
        batchCount++;
        setProcessingStatus(`📤 Enviando estudiantes (lote ${batchCount})...`);
        
        const response = await fetch('https://mongo-api-fawn.vercel.app/api/upload-tables', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X_API_KEY': process.env.NEXT_PUBLIC_MONGO_API_KEY || ''
          },
          body: JSON.stringify({
            estudiantes: batch,
            profesores: i === 0 ? profesores : [], // Solo enviar profesores en el primer lote
            horarios: [],
            description: description || 'Carga desde cliente'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error en lote ${batchCount}`);
        }
      }
      
      // Enviar horarios en lotes separados
      if (horarios.length > 0) {
        const HORARIO_BATCH_SIZE = 100;
        for (let i = 0; i < horarios.length; i += HORARIO_BATCH_SIZE) {
          const batch = horarios.slice(i, i + HORARIO_BATCH_SIZE);
          batchCount++;
          setProcessingStatus(`📤 Enviando horarios (lote ${batchCount})...`);
          
          const response = await fetch('https://mongo-api-fawn.vercel.app/api/upload-tables', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X_API_KEY': process.env.NEXT_PUBLIC_MONGO_API_KEY || ''
            },
            body: JSON.stringify({
              estudiantes: [],
              profesores: [],
              horarios: batch,
              description: description || 'Carga desde cliente'
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error en lote ${batchCount}`);
          }
        }
      }

      setSuccess(true);
      setStats({
        estudiantes: estudiantes.length,
        profesores: profesores.length,
        horarios: horarios.length
      });
      setFile(null);
      setDescription('');
      setProcessingStatus('');
      
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      setTimeout(() => {
        setSuccess(false);
        setStats(null);
      }, 10000);
    } catch (err) {
      setError('Error al procesar el archivo: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      console.error('Error:', err);
      setProcessingStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Subir Archivo HTM</h2>
      <p className="text-gray-600 mb-6">
        Sube un archivo .htm para extraer y procesar los datos de estudiantes, profesores y horarios
      </p>

      {processingStatus && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
          <div className="flex items-center">
            <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{processingStatus}</span>
          </div>
        </div>
      )}

      {success && stats && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold mb-2">✅ Archivo procesado exitosamente</p>
              <ul className="text-sm space-y-1">
                <li>👥 Estudiantes: {stats.estudiantes}</li>
                <li>👨‍🏫 Profesores: {stats.profesores}</li>
                <li>📅 Horarios: {stats.horarios}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
          <svg className="h-5 w-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción (opcional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Carga de horarios otoño 2025"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="mt-4">
            <label
              htmlFor="file-input"
              className="cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <span className="px-4 py-2 bg-blue-50 rounded-lg inline-block hover:bg-blue-100 transition-colors">
                Seleccionar archivo
              </span>
              <input
                id="file-input"
                type="file"
                accept=".htm,.html"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>
          
          <p className="mt-2 text-sm text-gray-500">
            Archivos .htm o .html únicamente
          </p>
          
          {file && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg inline-block">
              <p className="text-sm text-blue-700 font-medium">
                📄 {file.name}
              </p>
              <p className="text-xs text-blue-600">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">ℹ️ Proceso de extracción:</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>1. Se lee el archivo HTML en tu navegador</li>
            <li>2. Se extraen automáticamente estudiantes, profesores y horarios</li>
            <li>3. Los datos se envían al servidor para almacenarlos</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            '🔍 Procesar y Enviar Datos'
          )}
        </button>
      </form>
    </div>
  );
}

// Componente para aprobar justificantes
function AprobarJustificantes({ justificantes, onUpdate, user }: { justificantes: Justificante[]; onUpdate: () => void; user: any }) {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = async (id: string, action: 'aprobado' | 'rechazado') => {
    setProcessing(id);
    try {
      const response = await fetch('https://mongo-api-fawn.vercel.app/api/justificantes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X_API_KEY': process.env.NEXT_PUBLIC_MONGO_API_KEY || ''
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
