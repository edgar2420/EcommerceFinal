import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import ProfileDetails from "../Components/Perfile/ProfileDetails";
import EditProfileForm from "../Components/Perfile/EditProfileForm";
import { ApiService } from "../service/ApiService";

export default function Profile() {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (updatedData) => {
    try {
      const updatedUser = await ApiService.updateProfile(user.id, updatedData);
      setUser(updatedUser); // Actualizar el usuario en el contexto
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al guardar los cambios");
    }
  };

  if (!user) {
    return <div>Debes iniciar sesión para ver tu perfil.</div>;
  }

  return (
    <div className="container my-4">
      {isEditing ? (
        <EditProfileForm user={user} onSave={handleSave} onCancel={handleCancel} />
      ) : (
        <ProfileDetails user={user} onEditClick={handleEditClick} />
      )}
    </div>
  );
}
