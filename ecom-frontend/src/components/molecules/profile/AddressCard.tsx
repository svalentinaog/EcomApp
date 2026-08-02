import type { Address } from "@/types/Address";
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

      <p className="address-card__name">{address.recipient_full_name}</p>
      <p className="address-card__line">{address.address_line}</p>
      
      {/* Si hay complemento (apto, torre, bloque), lo mostramos */}
      {address.complement && (
        <p className="address-card__line">{address.complement}</p>
      )}

      <p className="address-card__line">
        {address.city}, {address.department} - {address.neighborhood}
      </p>
      <p className="address-card__phone">{address.phone}</p>

      <div className="address-card__actions">
        <CommonButton variant="primary" onClick={() => onEdit(address)}>
          Editar
        </CommonButton>
        <CommonButton
          variant="danger"
          onClick={() => onDelete(address.id)}
          disabled={isDeleting}
        >
          {isDeleting ? "Eliminando..." : "Eliminar"}
        </CommonButton>
      </div>
    </div>
  );
}