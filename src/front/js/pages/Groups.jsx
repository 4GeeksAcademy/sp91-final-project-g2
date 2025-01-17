import React, { useEffect, useState } from 'react'

export function Groups() {
  const [name, setName] = useState()
  const [description, setDescription] = useState()
  const [message, setMessage] = useState()
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [group, setGroup] = useState(() => {
    const savedGroup = localStorage.getItem('group')
    return savedGroup ? JSON.parse(savedGroup) : null
  })

  useEffect(() => {
    if (!group) {
      setMessage('No perteneces a ningún grupo, puedes crear uno nuevo.');
    } else {
      setMessage(`Ya perteneces a un grupo: ${group.name}`);
    }
  }, [group]);

  // Añadir usuario al grupo pasandole el id del grupo almadenado en el estado
  const addUserToGroup = async ({ id_group }) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/add_user_to_group/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'id_group': id_group }),
      })

      const data = await response.json()
      if (response.status === 200) {
        console.log('HECHO', data)
        changeRol({ id_rol: 1 })
      }

      if (response.status !== 200) {
        console.log(data)
      }
    } catch (error) {
      console.log('Error al añadir usuario al grupo', error)
    }
  }

  // Crear grupo pasandole el nombre y la descripción
  const createGroup = async ({ name, description }) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/create_groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'name': name, 'description': description })
      })

      const data = await response.json()
      if (response.status === 200) {
        localStorage.setItem('group', JSON.stringify(data))
        setGroup(data)
        await addUserToGroup({ id_group: data.id })
      }

      if (response.status !== 200) {
        console.log('Error al crear grupo', response)
      }
    } catch (error) {
      console.log('Error al crear grupo', error)
    }
  }

  // Cambiar el rol del usuario que crea el grupo a administrador
  const changeRol = async ({ id_rol }) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/change_rol/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id_rol": id_rol }) // 1 es el id del rol de administrador y 2 el invitado
      })

      const data = await response.json()
      if (response.status === 200) {
        console.log('HECHO', data)
      }

      if (response.status !== 200) {
        console.log(data)
      }
    } catch (error) {
      console.log('Error al cambiar rol', error)
    }
  }

  // Borrar Grupo
  const deleteGroup = async () => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:3001/'}api/delete_group/${group.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "id_group": group.id }),
      })

      const data = await response.json()
      if (response.status === 200) {
        localStorage.removeItem('group')
        changeRol({ id_rol: 2 })
      }

      if (response.status !== 200) {
        console.log(data)
      }
    } catch (error) {
      console.log('Error al cambiar rol', error)
    }
  }

  // Manejar el evento de submit del formulario de creación de grupo y llamar a la función de creación de grupo
  const handleSubmit = (e) => {
    e.preventDefault()
    createGroup({ name, description })
  }

  return (
    <div>
      <div className="alert alert-warning" role="alert">{message}</div>
      {!group && (
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Crear grupo
        </button>
      )}

      {user?.id_rol === 1 && (
        <div>
          <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteGroup">
            Delete Group
          </button>

          <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteGroup">
            Delete Group
          </button>

          <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteGroup">
            Delete Group
          </button>

          <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteGroup">
            Delete Group
          </button>

          {/* Delete Group */}
          <div className="modal fade" id="deleteGroup" aria-labelledby="deleteGroupLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="deleteGroupLabel">Surely you want to delete the group</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-danger" onClick={deleteGroup}>Delete Group</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Nuevo Grupo</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre del Grupo</label>
                  <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descripción</label>
                  <textarea className="form-control" id="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  <button type="submit" className="btn btn-primary">Crear Grupo</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

