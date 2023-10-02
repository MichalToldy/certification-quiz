import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownComponent<T = unknown> {
  @Input() placeholder = '';
  @Input() displayProperty?: keyof T;

  private _options: T[] = [];
  @Input() set options(options: T[]) {
    this.setInputValue(null);
    this._options = options;
    this.applyFilter();
  }

  @Output() selectItem = new EventEmitter<T>();
  value: T | null = null;

  showResults = false;
  textFilter = '';
  filteredOptions: T[] = [];

  @ViewChild('input', { static: true }) inputEl!: ElementRef<HTMLInputElement>;

  @HostListener('mouseover', ['$event']) onMouseOver() {
    this.showResults = true;
  }

  @HostListener('mouseout', ['$event']) onMouseOut() {
    this.showResults = false;
  }

  protected applyFilter() {
    this.filteredOptions = this._options.filter((option) => {
      return this.getValueFromOption(option)
        .toLowerCase()
        .includes(this.textFilter.toLowerCase());
    });
  }

  protected selectOption(option: T) {
    this.setInputValue(option);
    this.applyFilter();

    if (option) {
      this.selectItem.emit(option);
    }

    this.showResults = false;
  }

  protected onBlur() {
    // to avoid overwrite new selection with the old selection
    setTimeout(() => {
      if (this.value !== null) {
        this.setInputValue(this.value);
        this.applyFilter();
      }
    }, 100);
  }

  private setInputValue(option: T | null) {
    const newValue = option ? this.getValueFromOption(option) : '';
    if (this.inputEl) {
      this.inputEl.nativeElement.value = newValue;
    }
    this.textFilter = newValue;

    this.value = option;
  }

  private getValueFromOption(option: T): string {
    return (
      this.displayProperty ? option[this.displayProperty] : option
    ) as string;
  }
}
