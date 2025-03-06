import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext";
// Custom components
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
// Custom Pages or Views
import { Home } from "./pages/Home.jsx";
import { PruebaCustomer } from "./pages/PruebaCustomer.jsx";
import { PruebaVendor } from "./pages/PruebaVendor.jsx";
import { Login } from "./pages/Login.jsx";
import { AdminPage } from "./pages/AdminPage.jsx";
import { UserListPage } from "./pages/Administrador/UserListPage.jsx";
import { UserDetailPage } from "./pages/Administrador/UserDetailPage.jsx";
import { ProductListPage } from "./pages/Administrador/ProductListPage.jsx";


// Create your first component
const Layout = () => {
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    // The basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        {/* <Route element={<Demo />} path="/demo" /> */}
                        {/* <Route element={<Single />} path="/single/:theid" /> */}
                        <Route element={<Login />} path="/login" />
                        <Route element={<AdminPage />} path="/adminpage" />
                        <Route element={<UserListPage />} path="/user-list"/>
                        <Route element={<UserDetailPage/>} path="/user-details/:id"/>
                        <Route element={<ProductListPage />} path="product-list"/>
                        <Route element={<PruebaCustomer />} path="/pruebacustomer" />
                        <Route element={<PruebaVendor />} path="/pruebavendor" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};


export default injectContext(Layout);
