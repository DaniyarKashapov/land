// Все варианты ответа
const option1 = document.querySelector('.option1'),
      option2 = document.querySelector('.option2'),
      option3 = document.querySelector('.option3'),
      option4 = document.querySelector('.option4');

// Все наши ответы
const optionElements = document.querySelectorAll('.option');

// Вопросы
const question = document.getElementById('question'); //сам вопрос

const numberOfQuestion = document.getElementById('number-of-question'),//номер вопроса
      numberOfAllQuestions = document.getElementById('number-of-all-questions'); //кол-во всех вопросов

let indexOfQuestion, //индекс текущего вопроса
    indexOfPage = 0; //индекс страницы

const answersTracker = document.getElementById('answers-tracker');//обертка для трекера
const btnNext = document.getElementById('btn-next'); //кнопка далее

let score = 0; //итоговый результат викторины

const correctAnswer = document.getElementById('correct-answer'), //кол-во правильных ответов
      numberOfAllQuestions2 = document.getElementById('number-of-all-questions-2'), //кол-во всех вопросов в модальном окне
      btnTryAgain = document.getElementById('btn-try-again'); //кнопка "начать викторину заново"

const questions = [
    {
        question: 'Что такое клавиатура ?',
        options: [
            'Не знаю',
            'Устройство ввода с клавишами',
            'Штучка с проводом',
            'Экран',
        ],
        rightAnswer: 1
    },
    {
        question: 'Чем мы управляем на экране ? ',
        options: [
            'Мышкой',
            'Клавиатурой',
            'Монитором',
            'Не знаю'
        ],
        rightAnswer: 0
    },
    {
        question: 'Что такое монитор ',
        options: [
           'Телевизор',
           'Устройство вывода',
           'Проверка данных',
           'Не знаю'
        ],
        rightAnswer: 1
    }
];

//innerHTML - позволяет выводить внутрь элемента какие-то значения
numberOfAllQuestions.innerHTML = questions.length; //выводим кол-во вопросов
//indexOfQuestion будет генерироваться случайным образом
const load = () => {
    question.innerHTML = questions[indexOfQuestion].question; //сам вопрос

    //мапим ответы

    option1.innerHTML = questions[indexOfQuestion].options[0];
    option2.innerHTML = questions[indexOfQuestion].options[1];
    option3.innerHTML = questions[indexOfQuestion].options[2];
    option4.innerHTML = questions[indexOfQuestion].options[3];

    numberOfQuestion.innerHTML = indexOfPage + 1; //установка номера текущей страницы
    indexOfPage++; //увеличение индекса страницы
};

//чтобы вопросы не повторялись

let completedAnswers = []; //массив, для уже заданных вопросов

//Math.floor- округление
const randomQuestion = () => {
    let randomNumber = Math.floor(Math.random() * questions.length); //если так оставить он будет генерировать дробное число
    let hitDublicate = false; //якорь для проверки одинаковых вопросов

    if(indexOfPage == questions.length) {
        quizOver();
    }else {
        if(completedAnswers.length > 0) {
            completedAnswers.forEach(item => {
                if(item == randomNumber) {
                    hitDublicate = true;
                }
            });
            if(hitDublicate == true) {
                randomQuestion();
            }else {
                indexOfQuestion = randomNumber;
                load();
            }
        }
        if(completedAnswers.length == 0){
            indexOfQuestion = randomNumber;
            load();
        }
    }
    completedAnswers.push(indexOfQuestion); //push поможет заполнить индексами, чтобы отправлять использованные индексы
};

const checkAnswer = el => {
    if(el.target.dataset.id == questions[indexOfQuestion].rightAnswer) {
        el.target.classList.add('correct'); //css
        updateAnswerTracker('correct');
        score++; //счетчик правильных ответов
    } else {
        el.target.classList.add('wrong'); //css
        updateAnswerTracker('wrong');
    }
    disabledOptions();
}

for(option of optionElements) {
    option.addEventListener('click' , e => checkAnswer(e));
}

const disabledOptions = () => {
    optionElements.forEach(item => {
        item.classList.add('disabled'); //css
        if(item.dataset.id == questions[indexOfQuestion].rightAnswer) {
            item.classList.add('correct');
        }
    })
}
//удаление всех классов со всех ответов
const enableOptions = () => {
    optionElements.forEach(item => {
        item.classList.remove('disabled', 'correct', 'wrong');
    })
};

const answerTracker = () => {
    questions.forEach(() => {
        const div = document.createElement('div'); //создали новый объект div
        answersTracker.appendChild(div); //засунули новый объект div в html
    })
};

const updateAnswerTracker = status => {
    answersTracker.children[indexOfPage - 1].classList.add(`${status}`);
}

//чтобы нельзя было, не выбрав ответ пойти дальше. ! - разворачивает код true на false, в нашем случае мы будем проверять с помошью contains disabled присутсвует или нет
const validate = () => {
    if(!optionElements[0].classList.contains('disabled')){
        alert('Вам нужно выбрать один из вариантов ответа')
    } else {
        randomQuestion();
        enableOptions();
    }
}

const quizOver = () => {
    document.querySelector('.quiz-over-modal').classList.add('active');
    correctAnswer.innerHTML = score;
    numberOfAllQuestions2.innerHTML = questions.length;
};

const tryAgain = () => {
    window.location.reload(); //перезагрузка страницы
};

btnTryAgain.addEventListener('click', tryAgain);

btnNext.addEventListener('click', () => {
    validate();
})

//для того, чтобы load прогружался только тогда, когда прогрузится html
window.addEventListener('load', () => {
    randomQuestion();
    answerTracker();
});