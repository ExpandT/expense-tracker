import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Transaction } from '../../../core/types/transaction';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect, MatSelectChange } from '@angular/material/select';
import { MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { CreateTransactionModalComponent } from '../create-transaction-modal/create-transaction-modal.component';
import { categories } from '../../../core/config/category';

@Component({
  selector: 'app-transaction-list',
  imports: [
    MatHeaderCell,
    MatTable,
    MatRow,
    MatRowDef,
    MatCell,
    DatePipe,
    MatButton,
    MatCellDef,
    MatHeaderCellDef,
    MatColumnDef,
    MatHeaderRow,
    MatHeaderRowDef,
    FormsModule,
    MatLabel,
    MatSelect,
    MatOption,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatFormField
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionListComponent implements OnInit {
  dialog = inject(MatDialog);
  transactionService = inject(TransactionService);
  cdr = inject(ChangeDetectorRef);

  transactions: Transaction[] = [];
  categories = categories;
  selectedType: string | null = null;
  selectedCategory: string | null = null;
  sortBy: 'date' | 'amount' = 'date';
  sortOrder: boolean = true;
  displayedColumns: string[] = ['name', 'amount', 'category', 'date'];

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe(transactions => {
      this.transactions = transactions;
      this.transactions = [...this.transactions];

      this.cdr.detectChanges();
      this.cdr.markForCheck();
    });
  }

  openTransactionDialog(): void {
   this.dialog.open(CreateTransactionModalComponent);
  }

  onTypeFilterChange(event: MatSelectChange): void {
    this.selectedType = event.value;
    this.transactionService.applyFilters(this.selectedType, this.selectedCategory);
  }

  onCategoryFilterChange(event: MatSelectChange): void {
    this.selectedCategory = event.value;
    this.transactionService.applyFilters(this.selectedType, this.selectedCategory);
  }

  onSortChange(event: MatButtonToggleChange): void {
    this.sortBy = event.value;
    this.transactionService.setSortBy(this.sortBy);
  }

  toggleSortOrder(): void {
    this.sortOrder = !this.sortOrder;
    this.transactionService.toggleSortOrder();
  }
}
