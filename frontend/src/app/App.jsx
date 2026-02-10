import Navbar from '../component/Navbar'
import AppRouter from './router'
import { AuthProvider } from "../context/AuthContext"
import { BrowserRouter } from 'react-router-dom'
import {CartProvider} from '../context/CartContext'


export default function App() {
return (

    <AuthProvider>
      <CartProvider>
       <BrowserRouter>
          <Navbar />
          <AppRouter />
       </BrowserRouter>
      </CartProvider>
    </AuthProvider>


)
}