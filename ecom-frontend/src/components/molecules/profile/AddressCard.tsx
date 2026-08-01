import type { Address } from "@/hooks/useAddresses";
import CommonButton from "@/components/atoms/CommonButton";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

export default function AddressCard({ address, onEdit, onDelete, isDeleting }: AddressCardProps) {
  return (
    <div className="address-card">
      {address.is_default && (
        <span className="address-card__badge">Predeterminada</span>
      )}

      <p className="address-card__name">{address.full_name}</p>
      <p className="address-card__line">{address.address_line}</p>
      <p className="address-card__line">
        {address.city}, {address.state}, {address.postal_code}
      </p>
      <p className="address-card__line">{address.country}</p>
      <p className="address-card__phone">{address.phone}</p>

      <div className="address-card__actions">
        <CommonButton variant="primary" onClick={() => onEdit(address)}>
          Editar
        </CommonButton>
        <CommonButton
          variant="primary"
          style={{ backgroundColor: "#A70000", color: "#fff", border: "none" }}
          onClick={() => onDelete(address.id)}
          disabled={isDeleting}
        >
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </CommonButton>
      </div>
    </div>
  );
}