import { createSignal } from "solid-js";

export default function Counter() {
  const [count, setCount] = createSignal(0);
  const [step, setStep] = createSignal(1);

  return (
    <>
      <button
        class="increment"
        onClick={() => setCount((current) => current + step())}
        type="button"
      >
        Clicks: {count()}
      </button>
      <label>
        Step
        <input
          type="number"
          min="1"
          value={step()}
          onInput={(event) => setStep(event.currentTarget.valueAsNumber || 1)}
        />
      </label>
      <p>Next click adds {step()}.</p>
      <button disabled={count() === 0} onClick={() => setCount(0)}>
        Reset
      </button>
    </>
  );
}
