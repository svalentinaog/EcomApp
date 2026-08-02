import { useState } from "react";
import CustomInput from "@/components/atoms/CustomInput";
import CommonButton from "@/components/atoms/CommonButton";
import type { Address, AddressPayload } from "@/types/Address";

interface AddressFormProps {
  initialData?: Address | null;
  onSubmit: (payload: AddressPayload) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

const emptyForm: AddressPayload = {
  recipient_full_name: "",
  phone: "",
  address_line: "",
  city: "",
  department: "",
  neighborhood: "",
  complement: "", 
  is_default: false,
};

export default function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  errorMessage,
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressPayload>(
    initialData
      ? {
          recipient_full_name: initialData.recipient_full_name,
          phone: initialData.phone,
          address_line: initialData.address_line,
          city: initialData.city,
          department: initialData.department,
          neighborhood: initialData.neighborhood,
          complement: initialData.complement || "", // Previene warnings de React
          is_default: initialData.is_default,
        }
      : emptyForm
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      {errorMessage && <p className="address-form__error">{errorMessage}</p>}

      <CustomInput type="text" name="recipient_full_name" label="Nombre de quien recibe" value={formData.recipient_full_name} onChange={handleChange} />
      <CustomInput type="text" name="phone" label="Teléfono" value={formData.phone} onChange={handleChange} />
      
      <CustomInput type="text" name="department" label="Departamento" value={formData.department} onChange={handleChange} />
      <CustomInput type="text" name="city" label="Ciudad" value={formData.city} onChange={handleChange} />
      <CustomInput type="text" name="neighborhood" label="Barrio" value={formData.neighborhood} onChange={handleChange} />
      
      <CustomInput type="text" name="address_line" label="Dirección principal" value={formData.address_line} onChange={handleChange} />
      <CustomInput type="text" name="complement" label="Complemento (Apto, Torre, Oficina) Opcional" value={formData.complement || ""} onChange={handleChange} />

      <label className="address-form__checkbox">
        <input
          type="checkbox"
          name="is_default"
          checked={formData.is_default}
          onChange={handleChange}
        />
        Usar como dirección predeterminada
      </label>

      <div className="address-form__actions">
        <CommonButton type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar dirección"}
        </CommonButton>
        <CommonButton type="button" variant="primary" onClick={onCancel}>
          Cancelar
        </CommonButton>
      </div>
    </form>
  );
}