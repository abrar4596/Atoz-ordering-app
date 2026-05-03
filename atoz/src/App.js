import './App.css';
import Navigation from './customer/components/navigation/Navigation';
import Footer from './customer/components/Footer/Footer';
import { CartProvider } from './customer/context/CartContext';
import { AuthProvider } from './customer/context/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './Routers/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <div className="flex-grow">
              <AppRoutes />
            </div>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
