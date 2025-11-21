import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <Projects />
                </PrivateRoute>
              }
            />
            <Route
              path="/projects/create"
              element={
                <PrivateRoute>
                  <CreateProject />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/projects" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

