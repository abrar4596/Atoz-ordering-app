import logo from './logo.svg';
import './App.css';
import Navigation from './customer/components/navigation/Navigation';
import HomePage from './customer/pages/HomePage/HomePage';
import Footer from './customer/components/Footer/Footer';
import Product from './customer/components/Product/Product';


function App() {
  return (
    <div className="">
     <Navigation/>
    <div>
      <HomePage/>
    </div>
    <Footer/>
    <Product/>
    </div>
  );
}

export default App;
