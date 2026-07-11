import React, { useState } from "react";
import Container from "@/layouts/Container";
import Input from "@/components/atoms/Input";
import CommonButton from "@/components/atoms/CommonButton";

export default function ProfileSection() {
  const [formData, setFormData] = useState({
    fullName: "Valentina Ortiz",
    email: "svalentinaog@gmail.com",
    birthDate: "10/11/2002",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);
  };

  return (
      <Container className="user-profile__container">
        <div className="user-profile__left">
          <ul className="user-profile__menu">
            <li className="user-profile__menu-item user-profile__menu-item--active">
              Mi Perfil
            </li>
            <li className="user-profile__menu-item">
              Mis Pedidos
            </li>
          </ul>
        </div>
        
        <div className="user-profile__right">
          <h1 className="user-profile__title">Mi perfil</h1>
          <p className="user-profile__subtitle">
            Gestiona tu información personal y preferencias de cuenta.
          </p>

          <form className="user-profile__form" onSubmit={handleSubmit}>
            <h2 className="user-profile__section-title">Información Personal</h2>
            
            <div className="user-profile__form-group">
              <Input
                type="text"
                name="fullName"
                label="Nombre completo"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            
            <div className="user-profile__form-group">
              <Input
                type="email"
                name="email"
                label="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="user-profile__form-group">
              <Input
                type="text"
                name="birthDate"
                label="Fecha de nacimiento"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>

            <CommonButton type="submit" variant="primary" className="user-profile__submit-btn">
              Actualizar Datos
            </CommonButton>
          </form>
        </div>
      </Container>
    // <section className="user-profile">
    // </section>
  );
}
