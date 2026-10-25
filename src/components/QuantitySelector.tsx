import { useId } from "react";
import { commonCupSizes } from "../data/coffeeMethods";

interface QuantitySelectorProps {
  cups: number;
  setCups: (cups: number) => void;
  cupSizeMl: number;
  setCupSizeMl: (size: number) => void;
  customSizeMl: string;
  setCustomSizeMl: (value: string) => void;
  isCustomSize: boolean;
  setIsCustomSize: (value: boolean) => void;
}

export const QuantitySelector = ({
  cups,
  setCups,
  cupSizeMl,
  setCupSizeMl,
  customSizeMl,
  setCustomSizeMl,
  isCustomSize,
  setIsCustomSize,
}: QuantitySelectorProps) => {
  const customInputId = useId();

  const selectedSize = commonCupSizes.includes(cupSizeMl);

  return (
    <section>
      <h2>Cantidad</h2>
      <div className="quantity-card">
        <label className="field-label" htmlFor="cups-input">
          Número de tazas
        </label>
        <div className="stepper">
          <button
            type="button"
            onClick={() => setCups(Math.max(1, cups - 1))}
            aria-label="Disminuir tazas"
          >
            −
          </button>
          <input
            id="cups-input"
            type="number"
            min={1}
            max={12}
            value={cups}
            onChange={(event) => {
              const value = Number(event.target.value);
              setCups(Math.min(12, Math.max(1, Number.isFinite(value) ? value || 1 : 1)));
            }}
          />
          <button
            type="button"
            onClick={() => setCups(Math.min(12, cups + 1))}
            aria-label="Aumentar tazas"
          >
            +
          </button>
        </div>
        <label>Tamaño por taza (ml)</label>
        <div className="size-grid">
          {commonCupSizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`size-btn ${!isCustomSize && selectedSize && cupSizeMl === size ? "selected" : ""}`}
              onClick={() => {
                setCupSizeMl(size);
                setIsCustomSize(false);
              }}
            >
              {size}
            </button>
          ))}
          <button
            type="button"
            className={`size-btn ${isCustomSize ? "selected" : ""}`}
            onClick={() => setIsCustomSize(true)}
          >
            Personal.
          </button>
        </div>
        {isCustomSize && (
          <div className="custom-size">
            <input
              id={customInputId}
              type="number"
              min={80}
              max={700}
              value={customSizeMl}
              placeholder="Ej. 220"
              onChange={(event) => {
                setCustomSizeMl(event.target.value);
                const size = Number(event.target.value);
                if (Number.isFinite(size) && size >= 80 && size <= 700) {
                  setCupSizeMl(Math.round(size));
                }
              }}
              onBlur={() => {
                const size = Number(customSizeMl);
                if (!Number.isFinite(size) || size <= 0) {
                  setCustomSizeMl(String(cupSizeMl));
                  return;
                }
                const boundedSize = Math.min(700, Math.max(80, Math.round(size)));
                setCustomSizeMl(String(boundedSize));
                setCupSizeMl(boundedSize);
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};
