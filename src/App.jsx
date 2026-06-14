import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Importa o guardião

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública: qualquer pessoa pode aceder */}
        <Route path="/" element={<Login />} />
        
        {/* Rota privada: embrulhada pelo ProtectedRoute */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;