import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '../services/api';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budgetMin: '',
    budgetMax: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await projectsApi.create({
        ...formData,
        budgetMin: parseFloat(formData.budgetMin),
        budgetMax: parseFloat(formData.budgetMax),
      });
      navigate('/projects');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div>
      <h1>Create Project</h1>
      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Minimum Budget ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.budgetMin}
              onChange={(e) => setFormData({ ...formData, budgetMin: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Maximum Budget ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.budgetMax}
              onChange={(e) => setFormData({ ...formData, budgetMax: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn">
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;

