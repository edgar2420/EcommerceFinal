import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Nav from "./Components/Nav";
import Footer from "./Components/Footer";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import { UserProvider } from "./contexts/UserContext";
import Categories from "./Pages/Categories";
import Profile from "./Pages/Profile";
import MyProducts from "./Pages/MyProducts";
import AddProductForm from "./Pages/AddProducts";
import MisPedidos from "./Pages/MisPedidos";
import PedidoDetalles from "./Pages/PedidoDetalles";
import SobreNosotros from "./Pages/SobreNosotros";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/categorias/:id" element={<Categories />} />
          <Route path="/mis-productos" element={<MyProducts />} />
          <Route path="/mis-productos/nuevo" element={<AddProductForm />} />
          <Route path="/orders" element={<MisPedidos />} />
          <Route path="/pedido/:id" element={<PedidoDetalles />} />
          <Route path="/sobrenosotros" element={<SobreNosotros />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Footer />
      </Router>
    </UserProvider>
  );
}
