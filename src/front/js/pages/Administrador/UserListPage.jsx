import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../store/appContext";
import { useNavigate } from "react-router-dom";
import { UserList } from "../../component/Admin/UserList.jsx";
import Pagination from "../../component/Pagination.jsx"; // Importa el componente de paginación

export const UserListPage = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [expandedUserId, setExpandedUserId] = useState(null);

    // Estados para la paginación de cada sección
    const [currentPageAdmins, setCurrentPageAdmins] = useState(1);
    const [currentPageVendors, setCurrentPageVendors] = useState(1);
    const [currentPageCustomers, setCurrentPageCustomers] = useState(1);
    const usersPerPage = 5; // Número de usuarios por página

    useEffect(() => {
        if (!store.isLogged || store.userRole !== "is_admin") {
            alert("Acceso denegado");
            navigate("/login");
        }
    }, []);

    const handleEdit = (id) => {
        navigate(`/user-details/${id}`);
    };

    const handleDeactivate = async (id) => {
        await actions.deactivateUser(id);
        if (success) actions.getUsers();
    };

    const handleToggleExpand = (id) => {
        setExpandedUserId(expandedUserId === id ? null : id);
    };

    // Separar a los usuarios dependiendo el tipo de rol que tengan.
    const admins = store.users?.filter((user) => user.is_admin) || [];
    const vendors = store.users?.filter((user) => user.is_vendor && !user.is_admin) || [];
    const customers = store.users?.filter((user) => user.is_customer && !user.is_vendor && !user.is_admin) || [];

    // Calcular los usuarios a mostrar en cada página
    const indexOfLastAdmin = currentPageAdmins * usersPerPage;
    const indexOfFirstAdmin = indexOfLastAdmin - usersPerPage;
    const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);

    const indexOfLastVendor = currentPageVendors * usersPerPage;
    const indexOfFirstVendor = indexOfLastVendor - usersPerPage;
    const currentVendors = vendors.slice(indexOfFirstVendor, indexOfLastVendor);

    const indexOfLastCustomer = currentPageCustomers * usersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - usersPerPage;
    const currentCustomers = customers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    return (
        <div className="container mt-5">
            <h1 className="text-center">Administración</h1>
            <h2 className="text-center">Listado de Usuarios</h2>

            <div classNme="user-section">
            <h4>Administradores</h4>
            <UserList
                users={currentAdmins}
                onEdit={handleEdit}
                onDeactivate={handleDeactivate}
                onToggleExpand={handleToggleExpand}
                expandedUserId={expandedUserId}
            />
            {admins.length > usersPerPage && (
                <Pagination
                    currentPage={currentPageAdmins}
                    totalPages={Math.ceil(admins.length / usersPerPage)}
                    onPageChange={(page) => setCurrentPageAdmins(page)}
                />
            )}
            </div>

            <div className="user-section">
            <h4>Vendedores</h4>
            <UserList
                users={currentVendors}
                onEdit={handleEdit}
                onDeactivate={handleDeactivate}
                onToggleExpand={handleToggleExpand}
                expandedUserId={expandedUserId}
            />
            {vendors.length > usersPerPage && (
                <Pagination
                    currentPage={currentPageVendors}
                    totalPages={Math.ceil(vendors.length / usersPerPage)}
                    onPageChange={(page) => setCurrentPageVendors(page)}
                />
            )}
            </div>

            <div className="user-section">
            <h4>Clientes</h4>
            <UserList
                users={currentCustomers}
                onEdit={handleEdit}
                onDeactivate={handleDeactivate}
                onToggleExpand={handleToggleExpand}
                expandedUserId={expandedUserId}
            />
            {customers.length > usersPerPage && (
                <Pagination
                    currentPage={currentPageCustomers}
                    totalPages={Math.ceil(customers.length / usersPerPage)}
                    onPageChange={(page) => setCurrentPageCustomers(page)}
                />
            )}
            </div>

            <button className="btn btn-secondary mt-3" onClick={() => navigate('/adminpage')}>
                Regresar
            </button>
        </div>
    );
};
