import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent } from './dropdown.component';
import { By } from '@angular/platform-browser';
import { BoldCharsPipe } from '../../pipes/bold-chars/bold-chars.pipe';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  const selectors = {
    input: 'input[type=text]',
    results: '.results',
    option: '.results .option',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownComponent, BoldCharsPipe],
      imports: [],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should apply the custom placeholder', () => {
    component.placeholder = 'test placeholder';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css(selectors.input));

    expect(input).toBeDefined();
    expect(input.nativeElement.placeholder).toBe('test placeholder');
  });

  it('should show / hide results', () => {
    component.options = ['a', 'b'];
    fixture.detectChanges();

    const results = fixture.debugElement.query(By.css(selectors.results));

    // default
    expect(results.nativeElement.classList).not.toContain('show');

    // show
    fixture.nativeElement.dispatchEvent(new MouseEvent('mouseover', {}));
    fixture.detectChanges();

    expect(results.nativeElement.classList).toContain('show');

    // hide
    fixture.nativeElement.dispatchEvent(new MouseEvent('mouseout', {}));
    fixture.detectChanges();

    expect(results.nativeElement.classList).not.toContain('show');
  });

  describe('primitive values', () => {
    beforeEach(() => {
      component.options = ['a', 'b', 'c', 'd'];
      fixture.detectChanges();
    });

    it('should have 4 options', () => {
      const options = fixture.debugElement.queryAll(By.css(selectors.option));

      expect(options.length).toBe(4);
      expect(options[0].nativeElement.innerText).toBe('a');
      expect(options[1].nativeElement.innerText).toBe('b');
      expect(options[2].nativeElement.innerText).toBe('c');
      expect(options[3].nativeElement.innerText).toBe('d');
    });

    it('should apply filter', () => {
      const input = fixture.debugElement.query(By.css(selectors.input));

      // Select the 'a' value
      input.nativeElement.value = 'a';
      input.nativeElement.dispatchEvent(
        new KeyboardEvent('keyup', { code: 'a' })
      );

      fixture.detectChanges();
      let options = fixture.debugElement.queryAll(By.css(selectors.option));

      expect(options.length).toBe(1);
      expect(options[0].nativeElement.innerHTML).toBe('<b>a</b>');

      // Select the 'B' value - case insensitive
      input.nativeElement.value = 'B';
      input.nativeElement.dispatchEvent(
        new KeyboardEvent('keyup', { code: 'B' })
      );

      fixture.detectChanges();
      options = fixture.debugElement.queryAll(By.css(selectors.option));

      expect(options.length).toBe(1);
      expect(options[0].nativeElement.innerHTML).toBe('<b>b</b>');
    });

    it('should select the first object', () => {
      // show result
      fixture.nativeElement.dispatchEvent(new MouseEvent('mouseover', {}));
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css(selectors.option));

      expect(options.length).toBe(4);

      const spy = spyOn(component.select, 'emit');

      options[0].nativeElement.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledOnceWith('a');
    });
  });

  describe('object values', () => {
    beforeEach(() => {
      component.displayProperty = 'name' as any;
      component.options = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ];

      fixture.detectChanges();
    });

    it('should have 2 options', () => {
      const options = fixture.debugElement.queryAll(By.css(selectors.option));

      expect(options.length).toBe(2);
      expect(options[0].nativeElement.innerText).toBe('a');
      expect(options[1].nativeElement.innerText).toBe('b');
    });

    it('should apply filter', () => {
      const input = fixture.debugElement.query(By.css(selectors.input));

      // Select the 'a' value
      input.nativeElement.value = 'a';
      input.nativeElement.dispatchEvent(
        new KeyboardEvent('keyup', { code: 'a' })
      );

      fixture.detectChanges();
      let options = fixture.debugElement.queryAll(By.css(selectors.option));

      expect(options.length).toBe(1);
      expect(options[0].nativeElement.innerHTML).toBe('<b>a</b>');

      // Select the 'B' value - case insensitive
      input.nativeElement.value = 'B';
      input.nativeElement.dispatchEvent(
        new KeyboardEvent('keyup', { code: 'B' })
      );

      fixture.detectChanges();
      options = fixture.debugElement.queryAll(By.css(selectors.option));

      expect(options.length).toBe(1);
      expect(options[0].nativeElement.innerHTML).toBe('<b>b</b>');
    });

    it('should select the first object', () => {
      // show result
      fixture.nativeElement.dispatchEvent(new MouseEvent('mouseover', {}));
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css(selectors.option));

      expect(options.length).toBe(2);

      const spy = spyOn(component.select, 'emit');

      options[0].nativeElement.click();
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledOnceWith({ id: 1, name: 'a' });
    });
  });
});
