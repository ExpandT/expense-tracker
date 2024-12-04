import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction/transaction.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { categories } from '../../../core/config/category';

@Component({
  selector: 'app-create-transaction-modal',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatDialogTitle,
    MatInput,
    MatOption,
    MatSelect,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    MatLabel,
    MatError,
  ],
  templateUrl: './create-transaction-modal.component.html',
  styleUrl: './create-transaction-modal.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTransactionModalComponent {
  formBuilder = inject(FormBuilder);
  transactionService = inject(TransactionService);
  dialogRef = inject(MatDialogRef<CreateTransactionModalComponent>);

  transactionForm: UntypedFormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    type: ['', Validators.required],
    category: ['', Validators.required],
    date: [new Date(), Validators.required]
  });

  categories = categories;

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const newTransaction = this.transactionForm.value;
      this.transactionService.addTransaction(newTransaction);
      this.dialogRef.close();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
