import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useOrders } from "@/hooks/api/useOrders";
import type { Order } from "@/types/Order";
import OrdersTable from "@/components/molecules/profile/OrdersTable";
import OrderDetail from "@/components/molecules/profile/OrderDetail";
import EmptyState from "@/components/molecules/common/EmptyState";
import Pagination from "@/components/molecules/shop/Pagination";
import LoandingState from "@/components/molecules/common/LoadingState";

import noOrdersImg from "@/assets/images/no-orders.jpg";

const PAGE_SIZE = 5;

export default function OrdersTab() {
  const { t } = useTranslation("profile");
  const { orders, isLoading, isError } = useOrders();
  const [mode, setMode] = useState<"list" | "detail">("list");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(orders.length / PAGE_SIZE);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return orders.slice(start, start + PAGE_SIZE);
  }, [orders, currentPage]);

  const handleSelect = (order: Order) => {
    setSelectedOrder(order);
    setMode("detail");
  };

  const handleBack = () => {
    setMode("list");
    setSelectedOrder(null);
  };

  if (isLoading) {
    return <LoandingState />
  }

  if (isError) {
    return (
      <EmptyState
        translationKey="error503"
        title={t("ordersSection.errorTitle")}
        description={t("ordersSection.errorDescription")}
      />
    );
  }

  if (mode === "detail" && selectedOrder) {
    return <OrderDetail order={selectedOrder} onBack={handleBack} />;
  }

  if (orders.length === 0) {
    return <EmptyState translationKey="noOrders" imageSrc={noOrdersImg} />;
  }

  return (
    <div className="orders-tab">
      <div>
        <h1 className="user-profile__title">{t("ordersSection.title")}</h1>
        <p className="user-profile__subtitle">{t("ordersSection.subtitle")}</p>
      </div>

      <OrdersTable orders={paginatedOrders} onSelect={handleSelect} />

      <p className="orders-tab__count">
        {t("ordersSection.showingCount", { 
          current: paginatedOrders.length, 
          total: orders.length 
        })}
      </p>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}