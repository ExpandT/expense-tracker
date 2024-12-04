import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Transaction } from '../../types/transaction';
import { Balance } from '../../types/balance';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly STORAGE_KEY = 'transactions';
  private transactions: Transaction[] = [];
  private filteredTransactionsSubject$ = new BehaviorSubject<Transaction[]>([]);
  private balanceSubject$ = new BehaviorSubject<Balance>({ income: 0, expense: 0, total: 0 });
  private sortBy: 'date' | 'amount' = 'date';
  private sortOrder: boolean = true;

  constructor() {
    this.loadTransactions();
    this.calculateBalance();
  }

  getTransactions(): Observable<Transaction[]> {
    return this.filteredTransactionsSubject$.asObservable();
  }

  getBalance() {
    return this.balanceSubject$.asObservable();
  }

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
    this.filteredTransactionsSubject$.next(this.transactions);
    this.calculateBalance();
    this.saveTransactions();
  }

  applyFilters(type: string | null, category: string | null): void {
    let filtered = [...this.transactions];

    if (type) {
      filtered = filtered.filter(transaction => transaction.type === type);
    }

    if (category) {
      filtered = filtered.filter(transaction => transaction.category === category);
    }

    this.filteredTransactionsSubject$.next(filtered);
    this.applySorting();
  }

  applySorting(): void {
    const sorted = [...this.filteredTransactionsSubject$.value].sort((a, b) => {
      if (this.sortBy === 'date') {
        return this.sortOrder ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (this.sortBy === 'amount') {
        return this.sortOrder ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
    this.filteredTransactionsSubject$.next(sorted);
  }

  setSortBy(sortBy: 'date' | 'amount'): void {
    this.sortBy = sortBy;
    this.applySorting();
  }

  toggleSortOrder(): void {
    this.sortOrder = !this.sortOrder;
    this.applySorting();
  }

  private calculateBalance() {
    const income = this.transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = this.transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const total = income - expense;

    const balance: Balance = { income, expense, total };
    this.balanceSubject$.next(balance);
  }

  private loadTransactions(): void {
    const storedTransactions = localStorage.getItem(this.STORAGE_KEY);
    if (storedTransactions) {
      this.transactions = JSON.parse(storedTransactions);
    }
    this.filteredTransactionsSubject$.next(this.transactions);
  }

  private saveTransactions(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.transactions));
    this.filteredTransactionsSubject$.next(this.transactions);
  }
}
