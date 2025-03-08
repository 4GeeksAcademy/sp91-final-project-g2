import React, { useContext } from 'react';
import { Context } from '../store/appContext';
import Pagination from './Pagination.jsx';
import '../../styles/pagination.css';

const Pages = ({ items, itemsPerPage }) => {
  const { store, actions } = useContext(Context);

  // Calcular los elementos a mostrar en la página actual
  const indexOfLastItem = store.currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="pages">
      {currentItems.map(item => (
        <div key={item.id} className="page-item">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      ))}
      <Pagination
        currentPage={store.currentPage}
        totalPages={totalPages}
        onPageChange={actions.setPage}
      />
    </div>
  );
};

export default Pages;