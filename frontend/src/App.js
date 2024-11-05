import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Patients from "./Pages/Patients";
import History from "./Pages/History";
import Login from "./Pages/Login";
import ProtectedRoute from "./assets/ProtectedRoute";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>

          <Route path='/Login' element={<Login />} />

          <Route path='/' element={<ProtectedRoute > <Home /> </ProtectedRoute>} />
          <Route path='/Patients' element={<ProtectedRoute > < Patients /> </ProtectedRoute>} />
          <Route path='/History' element={<ProtectedRoute > <History /> </ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
