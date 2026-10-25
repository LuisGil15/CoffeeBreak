import { BrewIntensity } from "../domain/types";
import { intensityOptions } from "../data/coffeeMethods";

interface IntensitySelectorProps {
  value: BrewIntensity;
  onChange: (value: BrewIntensity) => void;
}

export const IntensitySelector = ({
  value,
  onChange,
}: IntensitySelectorProps) => {
  const labels = intensityOptions;
  const index = labels.findIndex((option) => option.value === value);

  return (
    <section>
      <h2>Intensidad</h2>
      <div className="intensity-panel">
        <div className="intensity-row">
          <strong>{labels[index].label}</strong>
          <span>{labels[index].description}</span>
        </div>
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={index}
          onChange={(event) =>
            onChange(labels[Number(event.target.value)]?.value ?? "balanced")
          }
          aria-label="Selector de intensidad"
        />
        <div className="intensity-labels">
          {labels.map((label) => (
            <span key={label.value}>{label.label}</span>
          ))}
        </div>
      </div>
    </section>
  );
};
