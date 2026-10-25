import { BeverageType } from "../domain/types";
import { beverageOptions } from "../data/coffeeMethods";

interface BeverageSelectorProps {
  value: BeverageType;
  onChange: (value: BeverageType) => void;
}

export const BeverageSelector = ({
  value,
  onChange,
}: BeverageSelectorProps) => {
  return (
    <section>
      <h2>Tipo de bebida</h2>
      <div className="beverage-grid">
        {beverageOptions.map((option) => {
          const selected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              className={`beverage-card ${selected ? "selected" : ""}`}
              onClick={() => onChange(option.value)}
              aria-pressed={selected}
            >
              <span className="icon">{option.icon}</span>
              <span>{option.label}</span>
              <small>{option.description}</small>
            </button>
          );
        })}
      </div>
    </section>
  );
};
