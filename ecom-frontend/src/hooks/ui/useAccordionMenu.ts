import { useState } from "react";

export function useAccordionMenu() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (groupName: string) => {
    setOpenGroup((current) => (current === groupName ? null : groupName));
  };

  return {
    openGroup,
    toggleGroup,
  };
}
