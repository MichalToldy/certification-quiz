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
    this.setInputValue('');
    this._options = options;
    this.applyFilter();
  }

  @Output() select = new EventEmitter<T>();
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
    this.setInputValue(this.getValueFromOption(option));
    this.applyFilter();

    this.value = option;
    this.select.emit(option);

    this.showResults = false;
  }

  protected onBlur() {
    if (this.value !== null) {
      this.setInputValue(this.getValueFromOption(this.value));
      this.applyFilter();
    }
  }

  private setInputValue(value: string) {
    if (this.inputEl) {
      this.inputEl.nativeElement.value = value;
    }
    this.textFilter = value;
    this.value = null;
  }

  private getValueFromOption(option: T): string {
    return (
      this.displayProperty ? option[this.displayProperty] : option
    ) as string;
  }
}
