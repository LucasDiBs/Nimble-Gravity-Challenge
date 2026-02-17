import { useState, useEffect } from 'react';

const BASE_URL = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net/api';

function App() {
  const [candidate, setCandidate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CONFIGURACIÓN ---
  const MI_EMAIL = 'lucas_dibenedetto@hotmail.com'; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 2: Obtener datos de candidato
        const resCand = await fetch(`${BASE_URL}/candidate/get-by-email?email=${MI_EMAIL}`);
        const dataCand = await resCand.json();
        setCandidate(dataCand);

        // Step 3: Obtener lista de posiciones
        const resJobs = await fetch(`${BASE_URL}/jobs/get-list`);
        const dataJobs = await resJobs.json();
        setJobs(dataJobs);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h2>Cargando desafío...</h2>
    </div>
  );

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#f4f7f9', 
      padding: '40px 20px',
      fontFamily: 'sans-serif' 
    }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        
        <header style={{ textAlign: 'center', marginBottom: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h1 style={{ color: '#1a365d', margin: 0 }}>Challenge Nimble Gravity</h1>
          {candidate && (
            <div style={{ marginTop: '15px', fontSize: '14px', color: '#4a5568', textAlign: 'left' }}>
              <p><strong>Candidato:</strong> {candidate.firstName} {candidate.lastName}</p>
              <p><strong>UUID:</strong> <code style={{fontSize: '11px'}}>{candidate.uuid}</code></p>
              <p><strong>Candidate ID:</strong> <code>{candidate.candidateId}</code></p>
                            
            </div>
          )}
        </header>

        <main style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} candidate={candidate} />
          ))}
        </main>
      </div>
    </div>
  );
}

function JobCard({ job, candidate }) {
  const [repoUrl, setRepoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Este es el objeto exacto que pide el Step 5

const payload = {
  uuid: String(candidate?.uuid || "").trim(),
  jobId: String(job.id).trim(),
  candidateId: String(candidate?.candidateId || "").trim(),
  applicationId: String(candidate?.applicationId || "").trim(), // <--- AGREGAR ESTA LÍNEA (tu ID del Step 2)
  repoUrl: repoUrl.trim()
};

// Imprimimos en consola para que verifiques antes de apretar el botón
console.log("Payload a enviar:", payload);

  const handleApply = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
// 1. Lo que enviamos (Revisalo en la consola F12)
  
    try {
      const response = await fetch(`${BASE_URL}/candidate/apply-to-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        alert(`¡Éxito! Postulación enviada para: ${job.title}`);
      } else {
        alert(`Error: ${result.message || 'Cuerpo de solicitud inválido'}`);
      }
    } catch (err) {
      alert("Error de red al intentar postularse");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ marginTop: 0, color: '#2d3748' }}>{job.title}</h3>
      
      {/* Visualización de lo que se envía (Step 4 Requisito) */}
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '10px', 
        borderRadius: '6px', 
        fontSize: '11px', 
        marginBottom: '15px',
        border: '1px solid #cbd5e0',
        color: '#475569'
      }}>
        <strong style={{ display: 'block', marginBottom: '5px' }}>JSON PREVIEW (Step 5):</strong>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>

      <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="url" 
          placeholder="https://github.com/tu-usuario/tu-repo" 
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          required 
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
        />
        <button 
          type="submit" 
          disabled={isSubmitting || !repoUrl}
          style={{ 
            padding: '10px', 
            backgroundColor: '#3182ce', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Enviando...' : 'Confirmar y Enviar'}
        </button>
      </form>
    </div>
  );
}

export default App;