import { NgModule } from '@angular/core';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { BoldCharsPipe } from './pipes/bold-chars/bold-chars.pipe';

const DECLARATIONS = [DropdownComponent, BoldCharsPipe];

@NgModule({
  imports: [CommonModule],
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
})
export class SharedModule {}
