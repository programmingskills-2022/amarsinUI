import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { useAuthStore } from './store/authStore'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Layout from './components/layout/Layout'
import User from './pages/User'
import InventoryGoodList from './pages/reports/InventoryGoodList'
import ProviderList from './pages/reports/ProviderList'


const queryClient = new QueryClient()

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>  
          <Routes>
            <Route path="/login" element={<Login isHomePage={true}/>} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/user/index"
              element={
                <PrivateRoute>
                  <User />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/RpProviders/Inventory"
              element={
                <PrivateRoute>
                  <InventoryGoodList />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/RpProviders"
              element={
                <PrivateRoute>
                  <ProviderList />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Layout>  
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App 