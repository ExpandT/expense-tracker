export interface Transaction {
  id: number;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
}
