<<<<<<< HEAD
import React from "react";
import { useState } from "react";
=======
import React, { useState } from "react";
>>>>>>> 5a30ee97bb40765e3a98b6313e6ee6d9bb5615bc
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext";
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import Navbar from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
<<<<<<< HEAD
import  SignUp  from "./component/SignUp.jsx";
import ProfileForm from "./component/ProfileForm.jsx";
import LoadingSpinner from "./component/LoadingSpinner.jsx";
import Pagination from "./component/Pagination.jsx";
// Custom Pages or Views
=======
>>>>>>> 5a30ee97bb40765e3a98b6313e6ee6d9bb5615bc
import { Home } from "./pages/Home.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

// Productos
import ProductCards from "./pages/Products/ProductCards.jsx";
import ProductCard from "./pages/Products/ProductCard.jsx";
import ProductForm from "./pages/Products/ProductForm.jsx";
import ProductDetail from "./pages/Products/ProductDetail.jsx";
import ProductList from "./pages/Products/ProductList.jsx";

// Órdenes
import Orders from "./pages/Orders/Orders.jsx";
import OrderItems from "./pages/Orders/OrderItems.jsx";

const Layout = () => {
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const basename = process.env.BASENAME || "";

<<<<<<< HEAD
    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        {/* <Route element={<Demo />} path="/demo" /> */}
                        {/* <Route element={<Single />} path="/single/:theid" /> */}
                        <Route element={<SignUp setToken={setToken} />} path="/signup" />
                        <Route element={<ProfileForm />} path="/profile" />
                        <Route element={<LoadingSpinner />} path="/loading" />
                        <Route element={<Pagination />} path="/pagination" />
                        <Route element={<ProfilePage />} path="/profilepage" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
=======
  if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Routes>
            {/* Página de inicio */}
            <Route element={<Home />} path="/" />

            {/* Rutas de productos */}
            <Route path="/product-cards" element={<ProductCards />} />
            <Route path="/product-card/:productId" element={<ProductCard />} />
            <Route path="/product-form" element={<ProductForm />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route path="/product-list" element={<ProductList />} />

            {/* Rutas de órdenes */}
            <Route path="/orders" element={<Orders />} />
            <Route path="/order-items/:orderId" element={<OrderItems />} />

            {/* Página de error 404 */}
            <Route element={<h1>Not found!</h1>} path="*" />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Footer />
      </div>
    </div>
  );
>>>>>>> 5a30ee97bb40765e3a98b6313e6ee6d9bb5615bc
};

export default injectContext(Layout);
