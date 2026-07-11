import { useAccordionMenu } from "@/hooks/useAccordionMenu";

export interface CategoryGroup {
  name: string;
  subcategories: string[];
}

interface Props {
  groups?: CategoryGroup[];
  selected?: string;
  onSelect?: (cat: string) => void;
}

export default function AccordionMenu({
  groups = [],
  selected = "",
  onSelect = () => {},
}: Props) {
  const { openGroup, toggleGroup } = useAccordionMenu();

  return (
    <div className="accordion">
      {groups.map((group) => (
        <div key={group.name} className="accordion__group">
          <button
            className={`accordion__header ${
              openGroup === group.name || selected === group.name
                ? "active"
                : ""
            }`}
            onClick={() => {
              toggleGroup(group.name);
              onSelect(group.name);
            }}
          >
            {group.name}
            <span className="accordion__icon">
              {openGroup === group.name ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 6L15 12L9 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </button>

          <div
            className={`accordion__content ${
              openGroup === group.name ? "open" : ""
            }`}
          >
            {(group.subcategories || []).map((sub) => (
              <button
                key={sub}
                className={`accordion__item ${
                  selected === sub ? "selected" : ""
                }`}
                onClick={() => onSelect(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
