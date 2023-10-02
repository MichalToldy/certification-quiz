import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Question } from '../data.models';
import { QuizService } from '../quiz.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent {
  @Input()
  questions: Question[] | null = [];

  @Output()
  replace = new EventEmitter<Question>();

  userAnswers: string[] = [];
  quizService = inject(QuizService);
  router = inject(Router);

  submit(): void {
    this.quizService.computeScore(this.questions ?? [], this.userAnswers);
    this.router.navigateByUrl('/result');
  }

  trackByQuestion(q: Question) {
    return q.question;
  }
}
