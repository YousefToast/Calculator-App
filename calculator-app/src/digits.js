import { actions } from "./App";

export default function DigitButton({ dispatch, digit }) {
  return (
    <button
      onClick={() => dispatch({ type: actions.addDigit, payload: { digit } })}
    >
      {digit}
    </button>
  );
}
