import { BrowserRouter, Routes, Route } from 'react-router'
import RegisterPage from './pages/RegisterPage'
import { AuthProvide } from './context/AuthContext'
import DashboardRoutes from './routes/AdminRoutes'
import { ProfilePage } from './pages/ProfilePage'
import { ProtectedRoute } from './ProtectedRoute'
// import { Task } from './pages/task'
import { ReservaProvider } from './context/Reserva/ReservaProvider'
import ClienteRoutes from './routes/ClienteRoutes'
import { RecetaProvider } from './context/Receta/RecetaProvider'
import Verificar from './pages/auth/Verificar'

//import { BitacoraPage } from './bitacora/pages/BitacoraPage'
// import MeseroPedidos from './components/mesero/Pedido'

export default function App() {
  // todas las rutas hijas tendran el contexto
  return (
    <AuthProvide>
      <BrowserRouter>
        <ReservaProvider>
          <RecetaProvider>
            <Routes>
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/profile' element={<ProfilePage />} />
              {/* <Route path='/task' element={<Task />} /> */}
              {/* <Route path='/mesero' element={<MeseroPedidos />} /> */}
              <Route element={<ProtectedRoute />}>{DashboardRoutes()}</Route>
              <Route path='/verificar' element={<Verificar />} />
              {ClienteRoutes()}
            </Routes>
          </RecetaProvider>
        </ReservaProvider>
      </BrowserRouter>
    </AuthProvide>
  )
}
