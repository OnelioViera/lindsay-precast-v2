export type Unit = "feet" | "inches" | "yards" | "meters" | "centimeters";

export interface DimensionInput {
  value: number;
  unit: Unit;
}

export interface BaseCalculatorInputs {
  quantity: number;
}
