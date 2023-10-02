import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { QuizMakerComponent } from './quiz-maker.component';
import { DropdownComponent } from '../shared/components/dropdown/dropdown.component';
import { QuizComponent } from '../quiz/quiz.component';
import { QuizService } from '../quiz.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { BoldCharsPipe } from '../shared/pipes/bold-chars/bold-chars.pipe';
import { Category } from '../data.models';

describe('QuizMakerComponent', () => {
  let component: QuizMakerComponent;
  let fixture: ComponentFixture<QuizMakerComponent>;

  let quizService: QuizService;

  const selectors = {
    dropdown: 'app-dropdown',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        QuizMakerComponent,
        DropdownComponent,
        QuizComponent,
        BoldCharsPipe,
      ],
      imports: [HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(QuizMakerComponent);
    component = fixture.componentInstance;

    quizService = TestBed.inject(QuizService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Main and Sub categories', () => {
    beforeEach(() => {
      const spy = spyOn(quizService, 'getAllCategories');

      spy.and.returnValue(
        of([
          { id: 1, name: 'OnlyMain' },
          { id: 2, name: 'MainWith:FirstSub' },
          { id: 3, name: 'MainWith:SecondSub' },
          { id: 4, name: 'MainWith:ThirdSub' },
          { id: 5, name: 'SecondMainWith:FirstSub' },
          { id: 6, name: 'SecondMainWith:SecondSub' },
        ])
      );

      fixture.detectChanges();
    });

    it('should be visible the dropdown with main categories', fakeAsync(() => {
      const dropdown = fixture.debugElement.query(By.css(selectors.dropdown));

      expect(dropdown).toBeDefined();

      let mains: Category[] = [];
      component.categories$.subscribe((res) => (mains = res));
      tick();

      expect(mains.length).toBe(3);
    }));

    it('should be visible the dropdown with sub categories, only when is selected main category with subs', fakeAsync(() => {
      let mains: Category[] = [];
      component.categories$.subscribe((res) => (mains = res));
      tick();

      component.selectCategory(mains[0]); // first without subs
      fixture.detectChanges();

      let dropdown = fixture.debugElement.queryAll(By.css(selectors.dropdown));

      expect(dropdown).toBeDefined();
      expect(dropdown.length).toBe(1);

      component.selectCategory(mains[1]);
      fixture.detectChanges();

      dropdown = fixture.debugElement.queryAll(By.css(selectors.dropdown));
      expect(dropdown.length).toBe(2);
    }));

    it('should change the dropdown items in sub category depends on selected main category', fakeAsync(() => {
      let mains: Category[] = [];
      component.categories$.subscribe((res) => (mains = res));
      tick();

      let subs: Category[] = [];
      component.subCategories$.subscribe((res) => (subs = res));

      // select main category with 3 sub categories
      component.selectCategory(mains[1]);
      fixture.detectChanges();
      tick();
      expect(subs.length).toBe(3);

      // select main category with 2 sub categories
      component.selectCategory(mains[2]);
      fixture.detectChanges();
      tick();
      expect(subs.length).toBe(2);
    }));
  });
});
