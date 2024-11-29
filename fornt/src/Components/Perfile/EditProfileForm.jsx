import React, { useState } from "react";

export default function EditProfileForm({ user, onSave, onCancel }) {
  const [nombre, setNombre] = useState(user.nombre);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ nombre, email });
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Editar Perfil</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success me-2">
            Guardar
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
