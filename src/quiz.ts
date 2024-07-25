export type QuizSession = {
  question: QuizQuestion;
  options: string[];
  correctOptIdx: number;
};

export type QuizSessionResult = {
  isAnswerCorrect: boolean;
  isQuizFinished: boolean;
  remainingLength: number;
};

export type QuizQuestion = {
  jp: string;
  sound: string;
  eng: string;
};

export class Quiz {
  remainingWords: QuizQuestion[];
  possibleAnswers: string[];

  currentWord: QuizQuestion;
  numberOfTrial: number;

  constructor(wordList: QuizQuestion[]) {
    this.remainingWords = [...wordList];
    this.possibleAnswers = [];
    this.remainingWords.forEach((question: QuizQuestion) => {
      this.possibleAnswers.push(question.eng);
    });

    this.numberOfTrial = 0;
  }

  public getNextQuiz(): QuizSession {
    shuffle(this.remainingWords);
    let question = this.remainingWords[0];
    this.currentWord = question;

    let options = [question.eng];
    for (let i = 0; i < 8; i++) {
      let option =
        this.possibleAnswers[
          Math.floor(Math.random() * this.possibleAnswers.length)
        ];
      while (options.includes(option)) {
        option =
          this.possibleAnswers[
            Math.floor(Math.random() * this.possibleAnswers.length)
          ];
      }
      options.push(option);
    }

    shuffle(options);
    let answerIdx = options.findIndex((el: string) => question.eng == el);

    return {
      question: question,
      options: options,
      correctOptIdx: answerIdx,
    };
  }

  public submitAnswer(answer: string): QuizSessionResult {
    let isAnswerCorrect = answer == this.currentWord.eng;
    this.numberOfTrial += 1;

    if (isAnswerCorrect) {
      // swap the first and the last, then pop
      [
        this.remainingWords[0],
        this.remainingWords[this.remainingWords.length - 1],
      ] = [
        this.remainingWords[this.remainingWords.length - 1],
        this.remainingWords[0],
      ];

      this.remainingWords.pop();
    }

    return {
      isAnswerCorrect: isAnswerCorrect,
      isQuizFinished: this.remainingWords.length == 0,
      remainingLength: this.remainingWords.length,
    };
  }
}

function shuffle<T>(array: T[]) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}
