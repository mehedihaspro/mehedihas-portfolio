export interface QuizOption {
  _key?: string;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  _key?: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
  relatedSection?: string;
}

export interface Quiz {
  enabled: boolean;
  title?: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface QuizAnswer {
  questionIndex: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
}
