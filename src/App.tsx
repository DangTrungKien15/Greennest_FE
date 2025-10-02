import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AddressProvider } from './context/AddressContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import AdminUsers from './pages/AdminUsers';
import AdminRoles from './pages/AdminRoles';
import AdminCategories from './pages/AdminCategories';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import Profile from './pages/Profile';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PaymentSuccess from './pages/PaymentSuccess';
import AddressManagement from './pages/AddressManagement';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route
            path="/addresses"
            element={
              <ProtectedRoute>
                <AddressManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <Admin />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <AdminUsers />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
                 <Route
                   path="/admin/roles"
                   element={
                     <ProtectedRoute>
                       <ErrorBoundary>
                         <AdminRoles />
                       </ErrorBoundary>
                     </ProtectedRoute>
                   }
                 />
                 <Route
                   path="/admin/categories"
                   element={
                     <ProtectedRoute>
                       <ErrorBoundary>
                         <AdminCategories />
                       </ErrorBoundary>
                     </ProtectedRoute>
                   }
                 />
                 <Route
                   path="/admin/products"
                   element={
                     <ProtectedRoute>
                       <ErrorBoundary>
                         <AdminProducts />
                       </ErrorBoundary>
                     </ProtectedRoute>
                   }
                 />
                 <Route
                   path="/admin/orders"
                   element={
                     <ProtectedRoute>
                       <ErrorBoundary>
                         <AdminOrders />
                       </ErrorBoundary>
                     </ProtectedRoute>
                   }
                 />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AddressProvider>
            <AppContent />
          </AddressProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
