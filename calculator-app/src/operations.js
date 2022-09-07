import { actions } from "./App";

export default function OperationButton({ dispatch, operation }) {
  return (
    <button
      onClick={() =>
        dispatch({ type: actions.chooseOperation, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}
