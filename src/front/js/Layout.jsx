import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext";
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import Navbar from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
import { SingUp  from "./component/SignUp.jsx";
import  LogIn  from "./component/LogIn.jsx";
// Custom Pages or Views
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { UserListPage } from "./pages/Administrador/UserListPage.jsx";
import { UserDetailPage } from "./pages/Administrador/UserDetailPage.jsx";
import { ProductListPage } from "./pages/Administrador/ProductListPage.jsx";
import { ProductDetailPage } from "./pages/Administrador/ProductDetailPage.jsx";
import { CommentsListPage } from "./pages/Administrador/CommentListPage.jsx";

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
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

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
                        <Route element={<LogIn setToken={setToken} />} path="/login" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
