import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { FaSearch } from "react-icons/fa";

export const AdminPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [searchUser, setSearchUser] = useState("");
    const [searchProduct, setSearchProduct] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_admin") {
          alert("Acceso denegado");
          navigate("/login");
        }
      }, [store.isLogged, store.userRole, navigate]);
    
    useEffect(() => {
        actions.getUsers();
        actions.getProducts();
        actions.getComments();
    }, [actions]);

    const handleUserSearch = () => {
        const userFound = store.users.find(user => user.email.toLowerCase().includes(searchUser.toLowerCase()));
        if (userFound){
            navigate(`/user-details/${userFound.id}`)
        }else{
            alert("Usuario no encontrado");
        }
    }

    const totalUsers = store.users?.filter(user => user.is_customer && user.is_vendor).length || 0;
    const totalVendors = store.users?.filter(user => user.is_vendor).length || 0;
    const totalCustomers = store.users?.filter(user => user.is_customer).length || 0;
    const activeUsers = store.users?.filter(user => user.is_active).length || 0;
    const inactiveUsers = store.users?.filter(user => user.is_active === false).length || 0;
    const totalProducts = store.products?.length || 0;
    const totalSold = store.products?.filter(product => !product.in_sell).length || 0;
    const totalComments = store.comments?.length || 0;

    return (
        <div className="container my-4">
            <h1 className="text-center">Zona de Administrador</h1>
            <div className="row my-4">
                {/* Usuarios */}
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Usuarios</h5>
                            <h5>Total de vendedores: {totalVendors}</h5>
                            <h5>Total de clientes: {totalCustomers}</h5>
                            <p>Total de Usuarios Activos: {activeUsers}</p>
                            <p>Total de Usuarios Inactivos: {inactiveUsers}</p>
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Buscar usuario por email..." value={searchUser} onChange={(e) => setSearchUser(e.target.value)} />
                                <button className="btn btn-primary" onClick={handleUserSearch}>
                                    <FaSearch /></button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Productos */}
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Productos en Venta</h5>
                            <p>Total Publicados: {totalProducts}</p>
                            <p>Total Vendidos: {totalSold}</p>                           
                            <div className="input-group">
                                <input type="text" className="form-control" placeholder="Buscar producto..." value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} />
                                <button className="btn btn-primary" onClick={() => navigate(`/productdetail?search=${searchProduct}`)}>
                                    <FaSearch /></button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Comentarios */}
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
                <button className="btn btn-primary" onClick={() => navigate("/user-list")}>Listado de usuarios</button>
                <button className="btn btn-primary" onClick={() => navigate("/product-list")}>Listado de productos</button>
                <button className="btn btn-primary" onClick={() => navigate("/")}>Listado de Comentarios</button>
                <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </div>
    )
}