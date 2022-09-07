import { useReducer } from "react";
import DigitButton from "./digits.js";
import OperationButton from "./operations.js";
import "./styles.css";

export const actions = {
  addDigit: "add-digit",
  clear: "clear",
  deleteDigit: "delete-digit",
  chooseOperation: "choose-operation",
  evaluate: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case actions.addDigit:
      if (state.overwrite) {
        return {
          ...state,
          currentOperation: payload.digit,
          overwrite: false,
        };
      }

      if (payload.digit === "0" && state.currentOperation === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperation.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperation: `${state.currentOperation || ""}${payload.digit}`,
      };
    case actions.chooseOperation:
      if (state.currentOperation == null && state.previousOperation == null) {
        return state;
      }

      if (state.currentOperation == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperation == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperation: state.currentOperation,
          currentOperation: null,
        };
      }

      return {
        ...state,
        previousOperation: evaluate(state),
        operation: payload.operation,
        currentOperation: null,
      };
    case actions.clear:
      return {};
    case actions.deleteDigit:
      if (state.overwrite) {
        return {
          ...state,
          currentOperation: null,
          overwrite: false,
        };
      }
      if (state.currentOperation == null) {
        return state;
      }
      if (state.currentOperation.length === 1) {
        return {
          ...state,
          currentOperation: null,
        };
      }

      return {
        ...state,
        currentOperation: state.currentOperation.slice(0, -1),
      };
    case actions.evaluate:
      if (
        state.operation == null ||
        state.currentOperation == null ||
        state.previousOperation == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperation: null,
        operation: null,
        currentOperation: evaluate(state),
      };
  }
}

function evaluate({ currentOperation, previousOperation, operation }) {
  const previous = parseFloat(previousOperation);
  const current = parseFloat(currentOperation);
  if (isNaN(previous) || isNaN(current)) return "";
  let evaluation = "";

  switch (operation) {
    case "+":
      evaluation = previous + current;
      break;
    case "-":
      evaluation = previous - current;
      break;
    case "*":
      evaluation = previous * current;
      break;
    case "/":
      evaluation = previous / current;
      break;
  }

  return evaluation.toString();
}

const integerFormatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperation(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return integerFormatter.format(integer);
  return `${integerFormatter.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperation, previousOperation, operation }, dispatch] =
    useReducer(reducer, {});

  return (
    <div className="Calculator">
      <div className="Output">
        <div className="PreviousValue">
          {formatOperation(previousOperation)} {operation}
        </div>
        <div className="currentValue">{formatOperation(currentOperation)}</div>
      </div>
      <button
        className="twoSpaceButton"
        onClick={() => dispatch({ type: actions.clear })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: actions.deleteDigit })}>
        DEL
      </button>
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <button
        className="twoSpaceButton"
        onClick={() => dispatch({ type: actions.evaluate })}
      >
        =
      </button>
    </div>
  );
}

export default App;
