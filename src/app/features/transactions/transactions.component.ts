import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { Balance } from '../../core/types/balance';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionService } from '../../core/services/transaction/transaction.service';

@Component({
  selector: 'app-transactions',
  imports: [
    CurrencyPipe,
    MatCard,
    MatCardTitle,
    MatCard,
    MatCardContent,
    TransactionListComponent
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsComponent implements OnInit {
  transactionService = inject(TransactionService);

  balance: Balance = { income: 0, expense: 0, total: 0 };

  ngOnInit() {
    this.transactionService.getBalance().subscribe(balance => {
      this.balance = balance;
    });
  }
}
