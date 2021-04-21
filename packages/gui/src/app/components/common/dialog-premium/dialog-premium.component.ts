import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-premium',
  templateUrl: './dialog-premium.component.html',
  styleUrls: ['./dialog-premium.component.scss'],
})
export class DialogPremiumComponent {
  constructor(public dialogRef: MatDialogRef<DialogPremiumComponent>) {}
}
