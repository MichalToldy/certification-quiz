import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersComponent } from './answers.component';
import { QuestionComponent } from '../question/question.component';

describe('AnswersComponent', () => {
  let component: AnswersComponent;
  let fixture: ComponentFixture<AnswersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnswersComponent],
    });
    fixture = TestBed.createComponent(AnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
