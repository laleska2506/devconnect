import { useState, useEffect } from 'react';
import { projectsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface Project {
  id: string;
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  status: string;
  createdAt: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await projectsApi.list();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Projects</h1>
        {user?.role === 'client' && (
          <a href="/projects/create" className="btn">
            Create Project
          </a>
        )}
      </div>
      {projects.length === 0 ? (
        <div className="card">No projects found.</div>
      ) : (
        projects.map((project) => (
          <div key={project.id} className="card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div style={{ marginTop: '10px', color: '#666' }}>
              <strong>Budget:</strong> ${project.budgetMin} - ${project.budgetMax} |{' '}
              <strong>Status:</strong> {project.status}
            </div>
            {user?.role === 'freelancer' && (
              <button
                className="btn"
                style={{ marginTop: '10px' }}
                onClick={() => {
                  // TODO: Implement apply functionality
                  alert('Apply functionality to be implemented');
                }}
              >
                Apply
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Projects;

