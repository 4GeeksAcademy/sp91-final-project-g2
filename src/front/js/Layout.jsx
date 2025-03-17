import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext";
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import Navbar from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
import SignUp from "./component/SignUp.jsx";
import {ProfileForm} from "./component/ProfileForm.jsx";
import LoadingSpinner from "./component/LoadingSpinner.jsx";
import Pagination from "./component/Pagination.jsx";
// Custom Pages or Views
import  Home from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import {ProfilePage} from "./pages/ProfilePage.jsx";
// Productos
import {ProductCards} from "./pages/Products/ProductCards.jsx";
import {ProductCard} from "./pages/Products/ProductCard.jsx";
import ProductForm from "./pages/Products/ProductForm.jsx";
import ProductDetail from "./pages/Products/ProductDetail.jsx";
import {ProductList} from "./pages/Products/ProductList.jsx";
// Órdenes
import Orders from "./pages/Orders/Orders.jsx";
import OrderItems from "./pages/Orders/OrderItems.jsx";
//Administrador
import { AdminPage } from "./pages/AdminPage.jsx";
import { ProductListPage } from "./pages/Administrador/ProductListPage.jsx";
import { ProductDetailPage } from "./pages/Administrador/ProductDetailPage.jsx";
import { CommentsListPage } from "./pages/Administrador/CommentListPage.jsx";
import { UserDetailPage } from "./pages/Administrador/UserDetailPage.jsx";
import { UserListPage } from "./pages/Administrador/UserListPage.jsx";
import { FavoritesPage } from "./pages/FavoritesPage.jsx";
import { UserCommentsPage } from "./pages/Administrador/UserCommentsPage.jsx";
import { Error404 } from "./pages/Error404.jsx";


const Layout = () => {
    const [token, setToken] = useState(localStorage.getItem("access_token"));
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        {/* <Route element={<Demo />} path="/demo" /> */}
                        {/* <Route element={<Single />} path="/single/:theid" /> */}
                        {/* Rutas de ingresos */}
                        <Route element={<Home />} path="/" />
                        <Route element={<SignUp setToken={setToken} />} path="/signup" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<ProfilePage />} path="/profilepage" />
                        <Route element={<ProfileForm />} path="/profileform" />
                        {/* Rutas de productos */}
                        <Route path="/product-cards" element={<ProductCards />} />
                        <Route path="/product-card/:productId" element={<ProductCard />} />
                        <Route path="/product-form" element={<ProductForm />} />
                        <Route path="/product-detail" element={<ProductDetail />} />
                        <Route path="/product-list" element={<ProductList />} />
                        {/* Rutas de otros componentes */}
                        <Route element={<LoadingSpinner />} path="/loading" />
                        <Route element={<Pagination />} path="/pagination" />
                        {/* Rutas de órdenes */}
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/orderitems" element={<OrderItems />} />
                        {/* Rutas de administrador */}
                        <Route element={<AdminPage/>} path="/adminPage"/>
                        <Route element={<UserListPage/>} path="/user-list-page"/>
                        <Route element={<UserDetailPage/>} path="/user-details/:id"/>
                        <Route element={<ProductListPage/>} path="/product-list-page"/>
                        <Route element={<ProductDetailPage/>} path="/product-details-page/:id"/>
                        <Route element={<CommentsListPage/>} path="/comment-list-page"/>
                        <Route element={<UserCommentsPage/>} path="/user/:user_id/comments"/>
                        {/* Rutas de favoritos */}
                        <Route element={<FavoritesPage/>} path="/favorite-page"/>                        
                        <Route element={<Error404/>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
