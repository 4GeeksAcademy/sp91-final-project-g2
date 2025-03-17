import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FaSearch } from "react-icons/fa";

export const AdminPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [searchUser, setSearchUser] = useState("");
    const [searchProduct, setSearchProduct] = useState("");

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_admin") {
            alert("Acceso denegado");
            navigate("/login");            
        }else { actions.getUsers();
                actions.getProducts();
                actions.getComments();
        }
    }, [store.isLogged, store.userRole]);

    const handleUserSearch = () => {
        const userFound = store.users.find(user => user.email.toLowerCase().includes(searchUser.toLowerCase()));
        if (userFound) {
            navigate(`/user-details/${userFound.id}`);
        } else {
            alert("Usuario no encontrado");
        }
    }

    const users = store.users || [];
    const totalVendors = users.filter(user => user.is_vendor).length;
    const totalCustomers = users.filter(user => user.is_customer).length;
    const activeUsers = users.filter(user => user.is_active).length;
    const inactiveUsers = users.filter(user => user.is_active === false).length;

    const totalProducts = store.products?.length || 0;
    const totalSold = store.products?.filter(product => !product.in_sell).length || 0;
    const totalComments = store.comments?.length || 0;

    return (
        <div className="container my-4">
            <h1 className="text-center">Zona de Administrador</h1>
            <div className="row my-4">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Usuarios</h4>
                            <h5>Total de vendedores: {totalVendors}</h5>
                            <h5>Total de clientes: {totalCustomers}</h5>
                            <p>Total de Usuarios Activos: {activeUsers}</p>
                            <p>Total de Usuarios Inactivos: {inactiveUsers}</p>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar usuario por email..."
                                    value={searchUser}
                                    onChange={(e) => setSearchUser(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={handleUserSearch}>
                                    <FaSearch />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Productos en Venta</h5>
                            <p>Total Publicados: {totalProducts}</p>
                            <p>Total Vendidos: {totalSold}</p>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar producto..."
                                    value={searchProduct}
                                    onChange={(e) => setSearchProduct(e.target.value)}
                                />
                                <button className="btn btn-primary" onClick={() => navigate(`/product-detail?search=${searchProduct}`)}>
                                    <FaSearch />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Comentarios</h5>
                            <p>Total de Comentarios: {totalComments}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex gap-3">
                <button className="btn btn-primary" onClick={() => navigate("/user-list-page")}>Listado de usuarios</button>
                <button className="btn btn-primary" onClick={() => navigate("/product-list-page")}>Listado de productos</button>
                <button className="btn btn-primary" onClick={() => navigate("/comment-list-page")}>Listado de Comentarios</button>                
            </div>
        </div>
    );
};