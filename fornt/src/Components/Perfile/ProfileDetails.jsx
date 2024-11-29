import React from "react";

export default function ProfileDetails({ user, onEditClick }) {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Mi Perfil</h3>
        <p>
          <strong>Nombre:</strong> {user.nombre}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Tipo de Usuario:</strong> {user.tipoUsuario}
        </p>
        <button className="btn btn-primary" onClick={onEditClick}>
          Editar Perfil
        </button>
      </div>
    </div>
  );
}
