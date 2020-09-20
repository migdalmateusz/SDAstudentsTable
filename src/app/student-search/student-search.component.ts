import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

import { Student } from '../student';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-student-search',
  templateUrl: './student-search.component.html',
  styleUrls: [ './student-search.component.css' ]
})
export class StudentSearchComponent implements OnInit {
  students$: Observable<Student[]>;
  private searchTerms = new Subject<string>();

  constructor(private studentService: StudentService) {}

  // Dodanie wyszukiwanej frazy do obserwowalnego strumienia
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.students$ = this.searchTerms.pipe(
      // Odczekanie 300ms po każdym naciśnięciu klawisza przed uwzględnieniem frazy
      debounceTime(300),

      // Zignorowanie frazy, jeżeli jest ona taka sama jak poprzednia
      distinctUntilChanged(),

      // Przełączenie na nowe obserwowalne wyszukiwanie za każdym razem, gdy zmieni się fraza
      // https://jsfiddle.net/ys7Lruns/
      switchMap((term: string) => this.studentService.searchStudents(term)),
    );
  }
}
