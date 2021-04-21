import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateEntryPipe } from '@app/pipes/translate-entry.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [TranslateEntryPipe],
  imports: [CommonModule, DragDropModule, BrowserAnimationsModule],
  exports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatMenuModule,
    MatButtonToggleModule,
    DragDropModule,
    MatProgressSpinnerModule,
    TranslateEntryPipe,
    MatTreeModule,
    MatCheckboxModule,
    MatDialogModule,
    MatBadgeModule,
    MatChipsModule,
  ],
})
export class SharedModule {}
