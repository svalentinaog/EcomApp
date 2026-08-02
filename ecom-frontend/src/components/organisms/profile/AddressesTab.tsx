import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAddresses } from "@/hooks/api/useAddresses";
import type { Address } from "@/types/Address";
import AddressCard from "@/components/molecules/profile/AddressCard";
import AddressForm from "@/components/molecules/profile/AddressForm";
import CommonButton from "@/components/atoms/CommonButton";
import LoandingState from "@/components/molecules/common/LoadingState";

export default function AddressesTab() {
  const { t } = useTranslation("profile");
  const {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    deleteAddress,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
  } = useAddresses();

  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setMode("edit");
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteAddress(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateSubmit = async (payload: Parameters<typeof createAddress>[0]) => {
    await createAddress(payload);
    setMode("list");
  };

  const handleUpdateSubmit = async (payload: Parameters<typeof createAddress>[0]) => {
    if (!editingAddress) return;
    await updateAddress(editingAddress.id, payload);
    setMode("list");
    setEditingAddress(null);
  };

  if (isLoading) {
    return <LoandingState />
  }

  if (mode === "create") {
    return (
      <AddressForm
        onSubmit={handleCreateSubmit}
        onCancel={() => setMode("list")}
        isSubmitting={isCreating}
        errorMessage={(createError as any)?.response?.data?.message ?? null}
      />
    );
  }

  if (mode === "edit" && editingAddress) {
    return (
      <AddressForm
        initialData={editingAddress}
        onSubmit={handleUpdateSubmit}
        onCancel={() => {
          setMode("list");
          setEditingAddress(null);
        }}
        isSubmitting={isUpdating}
        errorMessage={(updateError as any)?.response?.data?.message ?? null}
      />
    );
  }

  return (
    <div className="addresses-tab">
      {/* Título integrado en el componente hijo */}
      <h1 className="user-profile__title">{t("addressesSection.title")}</h1>
      <p className="user-profile__subtitle">{t("addressesSection.subtitle")}</p>

      <div className="addresses-tab__header">
        <CommonButton variant="primary" onClick={() => setMode("create")}>
          {t("addressesSection.addButton")}
        </CommonButton>
      </div>

      {addresses.length === 0 ? (
        <p>{t("addressesSection.emptyMessage")}</p>
      ) : (
        <div className="addresses-tab__grid">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting && deletingId === address.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}