import React, { useState } from "react";
import { useAddresses } from "@/hooks/api/useAddresses";
import CommonButton from "@/components/atoms/CommonButton";
import InlineAlert from "@/components/molecules/common/InlineAlert";
import type { Address } from "@/types/Address";
import LoandingState from "@/components/molecules/common/LoadingState";

export default function AddressesTab() {
  const {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    deleteAddress,
  } = useAddresses();

  // Estado para controlar la vista: 'list' | 'create' | 'edit'
  const [viewMode, setViewMode] = useState<"list" | "create" | "edit">("list");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estado local para los campos del formulario
  const [formData, setFormData] = useState({
    recipient_full_name: "",
    phone: "",
    department: "",
    city: "",
    neighborhood: "",
    address_line: "",
    complement: "",
    is_default: false,
  });

  // Abrir formulario para crear
  const handleOpenCreate = () => {
    setFormData({
      recipient_full_name: "",
      phone: "",
      department: "",
      city: "",
      neighborhood: "",
      address_line: "",
      complement: "",
      is_default: false,
    });
    setSelectedAddress(null);
    setErrorMessage(null);
    setViewMode("create");
  };

  // Abrir formulario para editar
  const handleOpenEdit = (address: Address) => {
    setSelectedAddress(address);
    setFormData({
      recipient_full_name: address.recipient_full_name || "",
      phone: address.phone || "",
      department: address.department || "",
      city: address.city || "",
      neighborhood: address.neighborhood || "",
      address_line: address.address_line || "",
      complement: address.complement || "",
      is_default: address.is_default || false,
    });
    setErrorMessage(null);
    setViewMode("edit");
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedAddress(null);
    setErrorMessage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (viewMode === "create") {
        await createAddress(formData);
      } else if (viewMode === "edit" && selectedAddress) {
        await updateAddress(selectedAddress.id, formData);      }
      setViewMode("list");
    } catch (err: any) {
      console.error("Error guardando dirección:", err);
      setErrorMessage("Ocurrió un error al guardar la dirección. Revisa los datos e intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (addressId: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta dirección?")) {
      try {
        await deleteAddress(addressId);
      } catch (err) {
        console.error("Error al eliminar dirección:", err);
      }
    }
  };

  if (isLoading) {
     return <LoandingState />
  }

  // ==========================================
  // VISTA: FORMULARIO (Crear / Editar)
  // ==========================================
  if (viewMode === "create" || viewMode === "edit") {
    return (
      <div className="addresses-tab">
        <div className="addresses-header">
          <h2>{viewMode === "create" ? "Nueva dirección" : "Editar dirección"}</h2>
          <p className="addresses-subtitle">
            Ingresa la información detallada para las entregas de tus compras.
          </p>
        </div>

        {errorMessage && (
          <div style={{ marginBottom: "1.5rem" }}>
            <InlineAlert variant="danger" message={errorMessage} onClose={() => setErrorMessage(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-group">
            <label htmlFor="recipient_full_name">Nombre de quien recibe</label>
            <input
              type="text"
              id="recipient_full_name"
              name="recipient_full_name"
              value={formData.recipient_full_name}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Teléfono</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Ej: 318 1234567"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="department">Departamento</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Ej: Valle del Cauca"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">Ciudad</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Ej: Cali / Jamundí"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="neighborhood">Barrio</label>
            <input
              type="text"
              id="neighborhood"
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              placeholder="Ej: Ciudadela Terranova"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address_line">Dirección principal</label>
            <input
              type="text"
              id="address_line"
              name="address_line"
              value={formData.address_line}
              onChange={handleChange}
              placeholder="Ej: Calle 20 B # 47 A Sur 24"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="complement">Complemento (Apto, Torre, Oficina) Opcional</label>
            <input
              type="text"
              id="complement"
              name="complement"
              value={formData.complement}
              onChange={handleChange}
              placeholder="Ej: Apt 302, Bl. 4"
            />
          </div>

          <div className="form-checkbox">
            <input
              type="checkbox"
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onChange={handleChange}
            />
            <label htmlFor="is_default">Usar como dirección predeterminada</label>
          </div>

          <div className="form-actions">
            <CommonButton variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Datos"}
            </CommonButton>
            <button type="button" className="btn-danger-cancel" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // VISTA: LISTA DE DIRECCIONES / ESTADO VACÍO
  // ==========================================
  return (
    <div className="addresses-tab">
      <div className="addresses-header">
        <h2>Mis direcciones</h2>
        <p className="addresses-subtitle">
          Administra las direcciones donde quieres recibir tus pedidos.
        </p>
      </div>

      {addresses.length === 0 ? (
        /* ESTADO VACÍO (Figma: Tarjeta gris centrada) */
        <div className="addresses-empty-card">
          <div className="addresses-text">
            <h3>Todavía no tienes direcciones guardadas.</h3>
            <p>Da clic al botón para crear una</p>
          </div>
          <CommonButton variant="primary" onClick={handleOpenCreate}>
            + Añadir Dirección
          </CommonButton>
        </div>
      ) : (
        /* LISTADO DE TARJETAS (Figma: Tarjetas individuales) */
        <div className="addresses-list">
          {addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="address-card__top">
                <div className="address-card__header-info">
                  {address.is_default && (
                    <span className="address-badge-default">Predeterminada</span>
                  )}
                  <h4 className="address-card__title">
                    {address.recipient_full_name || "Dirección de envío"}
                  </h4>
                </div>

                <div className="address-card__actions">
                  <button
                    type="button"
                    className="icon-btn edit-btn"
                    title="Editar"
                    onClick={() => handleOpenEdit(address)}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    className="icon-btn delete-btn"
                    title="Eliminar"
                    onClick={() => handleDelete(address.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="address-card__details">
                <p>
                  <strong>Dirección:</strong> {address.address_line}
                  {address.neighborhood ? `, ${address.neighborhood}` : ""}
                  {address.city ? `, ${address.city}` : ""}
                  {address.department ? `, ${address.department}` : ""}
                </p>
                {address.complement && (
                  <p>
                    <strong>Complemento:</strong> {address.complement}
                  </p>
                )}
                <p>
                  <strong>Teléfono:</strong> {address.phone}
                </p>
              </div>
            </div>
          ))}

          <div className="addresses-add-more">
            <CommonButton variant="primary" onClick={handleOpenCreate}>
              + Añadir Dirección
            </CommonButton>
          </div>
        </div>
      )}
    </div>
  );
}