export interface DemoItem {
  id: string;
  name: string;
  value: number;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface CalculatorData {
  annualSalary: number;
  startDate: string; // ISO 8601 date string
  personName: string;
  imageUrl: string;
  contextText: string;
}