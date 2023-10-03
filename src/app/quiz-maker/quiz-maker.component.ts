import { Component, ViewChild } from '@angular/core';
import { Category, Difficulty, Question } from '../data.models';
import {
  BehaviorSubject,
  Observable,
  Subject,
  map,
  switchMap,
  take,
} from 'rxjs';
import { QuizService } from '../quiz.service';
import { DropdownComponent } from '../shared/components/dropdown/dropdown.component';

export const QUIZ_COUNT = 5;

@Component({
  selector: 'app-quiz-maker',
  templateUrl: './quiz-maker.component.html',
  styleUrls: ['./quiz-maker.component.css'],
})
export class QuizMakerComponent {
  categories$ = new Observable<Category[]>();
  subCategories$!: Observable<Category[]>;
  questions$ = new BehaviorSubject<Question[]>([]);
  canChangeQuestion = true;

  private selectedMainCategory = new Subject<string>();
  private savedQuizeCreation!: { id: string; difficulty: Difficulty };

  @ViewChild('mainCategory', { static: true, read: DropdownComponent })
  mainCategory!: DropdownComponent<Category>;
  @ViewChild('subCategory', { read: DropdownComponent })
  subCategory!: DropdownComponent<Category>;

  constructor(protected quizService: QuizService) {
    this.categories$ = this.quizService.allCategories$.pipe(
      map((categories) =>
        categories
          .map((category) => {
            const name = category.name.split(':')[0];
            const id = name === category.name ? category.id : -1;

            return { id, name };
          })
          .filter(
            // remove duplicities
            (category, index, arr) =>
              index ===
              arr.findIndex(
                (cat) => cat.name === category.name && cat.id === category.id
              )
          )
      )
    );

    this.subCategories$ = this.selectedMainCategory.pipe(
      switchMap((mainCategory) =>
        this.quizService.allCategories$.pipe(
          map((categories) =>
            mainCategory === ''
              ? []
              : categories
                  .filter(
                    (category) => category.name.split(':')[0] === mainCategory
                  )
                  .map((category) => ({
                    ...category,
                    name: category.name.split(':')[1].trim() ?? '',
                  }))
          )
        )
      )
    );
  }

  selectCategory(category: Category): void {
    if (category.id === -1) {
      this.selectedMainCategory.next(category.name);
    } else {
      this.selectedMainCategory.next('');
    }
  }

  createQuiz(difficulty: Difficulty): void {
    const id =
      (this.subCategory?.value?.id ?? this.mainCategory.value?.id) + ''; // to string

    if (id && id !== '-1') {
      this.savedQuizeCreation = { id, difficulty };
      this.quizService
        .createQuiz(id + '', difficulty as Difficulty, QUIZ_COUNT)
        .pipe(take(1))
        .subscribe((qs) => this.questions$.next(qs));
    }
  }

  replaceQuestion(question: Question) {
    this.quizService
      .createQuiz(
        this.savedQuizeCreation.id,
        this.savedQuizeCreation?.difficulty,
        1
      )
      .subscribe((newQuestion) => {
        const qs = this.questions$.value;
        const index = qs.findIndex((q) => q.question === question.question);

        qs[index] = newQuestion[0];
        this.canChangeQuestion = false;

        this.questions$.next(qs);
      });
  }
}
