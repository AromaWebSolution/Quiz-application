/*****************************/
/*****  QUIZ CONTROLLER ******/
/*****************************/

var quizControllerQuiz = (function () {
    // ******* QUESTION CONSTRUCTOR 
  function User(firstName, lastName, correctAnswer, wrongAnswer) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.correctAnswer = correctAnswer;
    this.wrongAnswer = wrongAnswer;
  }

  var questionLocalStorage = {
    getQuestionCollectionQuiz: function() { 
     return JSON.parse(localStorage.getItem('QuestionId'));
    },
    setUserOnLocalStorage: function(user) {
      localStorage.setItem('userName', JSON.stringify(user));
    },
    getUserOnLocalStorage: function() {
      return JSON.parse(localStorage.getItem('userName'));
    }
  };
    
   return {
    getQuestionFromQuizPage: questionLocalStorage,
    removeInputError: function(focusElement, errorMessage) {
      focusElement.addEventListener('keydown', function() {
        errorMessage.style.display = "none";
      });
    },   
    checkLogin: function(fstName, lstName) {

    var inputErrorFirstname = document.querySelector('.input-error-firstname');
    var inputErrorLastname = document.querySelector('.input-error-lastname');

      if(fstName.value === ''){
        inputErrorFirstname.style.display = "block";
        this.removeInputError(fstName, inputErrorFirstname); 
      }
      if (lstName.value === '') {
        inputErrorLastname.style.display = "block";
        this.removeInputError(lstName, inputErrorLastname);  
      }
      else {
          var firstName = fstName.value;
          var lastName = lstName.value;
          var name = firstName + lastName;
          var userName = new User(firstName, lastName, 0, 0);
          questionLocalStorage.setUserOnLocalStorage(userName);
          console.log(firstName, lastName);
          fstName.value = '';
          lstName.value = '';
          document.querySelector('#login-btn').href = "quiz.html";
      }
    },
        getNextQuestion: function(questId) {
      var questNo, correctAnswer, wrongAnswer, totalQuestions, questionArray, isChecked, answer;
      questionArray = Array.from(questionLocalStorage.getQuestionCollectionQuiz());
      totalQuestions = questionArray.length;
      answer = questionLocalStorage.getUserOnLocalStorage();
      //questNo = 0;
      if(questionLocalStorage.getQuestionCollectionQuiz() !== '') {
        user = questionLocalStorage.getQuestionCollectionQuiz();

      }
      
      var answerFirstName = answer.firstName;
      var answerLastName = answer.lastName;
      var answerCorrectAnswer = answer.correctAnswer;
      var answerWrongAnswer = answer.wrongAnswer;
    
      var opt = Array.from(document.querySelectorAll('input'));

      const currentQuestion = questionArray.find((ques, index) => questId === index);    
      // debugger;
    

      for(var i = 0; i < opt.length; i++) {
            if(opt[i].checked) {
              if(currentQuestion.options[i] === currentQuestion.correctAnswer) {
                answerCorrectAnswer = answerCorrectAnswer + 1;
                isChecked = true;
                console.log('correctAnswer ' + answerCorrectAnswer);
              }else {
                answerWrongAnswer = answerWrongAnswer + 1;
                isChecked = true;
                console.log('wrongAnswer ' + answerWrongAnswer);
              }
            }
        }
      if(isChecked) {
        UIController.quizQuestionUI(questionLocalStorage.getQuestionCollectionQuiz(), questId + 1);
      }
      else {
        alert('Please select an answer!');
      }
      var updateUserAnswers = new User(answerFirstName, answerLastName, answerCorrectAnswer, answerWrongAnswer);
      questionLocalStorage.setUserOnLocalStorage(updateUserAnswers);

    }
   };
})();

/*****************************/
/******  UI CONTROLLER ******/
/*****************************/

var UIController = (function() {
    
   var domItems = {
    firstName: document.getElementById('first-name'),
    lastName: document.getElementById('last-name'),
    loginButton: document.getElementById('login-btn'),
    quizOptContainer: document.querySelector('.quiz-options-container'),
    quizWrapper: document.querySelector('.quiz-wrapper'),
    quizQuest: document.querySelector('.quiz-question'),
    quizOpts: document.querySelectorAll('.quiz-question-option'),
    nextButton: document.getElementById('question-next-btn'),
    summary: document.querySelector('.summary')
	};
    
	return {
		getDomItems: domItems,
        quizQuestionUI: function(questions, questNo = 0) {
      this.clearQuestionOnUI(domItems.quizQuest, domItems.quizOptContainer);
      var totalQuestions, questionArray, inputHTML, quizInputHTML, quizOpt;
      questionArray = questions;

          questionArray.forEach((quest, index) => {
        if(index === questNo) {
          inputHTML = '<span class="quiz-question-number">Q. ' + (questNo + 1) +' </span><span class="quiz-question-text">'+ quest.questionText +'</span>';
          quizOpt = quest.options;
          
          if(domItems.quizQuest) {
            domItems.quizQuest.id = index; 
          } 
          
          if(domItems.quizWrapper) {
          domItems.quizQuest.insertAdjacentHTML('beforeend', inputHTML);
         } 
         
        }
        else {

        }
        //questNo++;
      });

      function addQuizOptDyn(opts) {
        if(opts) {
          for(var i = 0; i < opts.length; i++) {
          quizInputHTML = '<div class="quiz-options-wrapper"><input type="radio" name="answer" class="admin-options-' + i +'" value="' + i +'"><span class="quiz-question-option quiz-question-options-' + i +'">' + opts[i] +'</span></div>';
          if(domItems.quizOptContainer) {
            domItems.quizOptContainer.insertAdjacentHTML('beforeend', quizInputHTML); 
          }
        }
      }
      else {
        console.log('no question');
        if(domItems.nextButton) {
            domItems.nextButton.style.display = "none";
            domItems.viewScore.style.display = "block";

            if(domItems.viewScore) {
              var questionsLength = quizControllerQuiz.getQuestionFromQuizPage.getQuestionCollectionQuiz().length;
                domItems.viewScore.addEventListener('click', function() {
                  var scoreFromStorage = quizControllerQuiz.getQuestionFromQuizPage.getUserOnLocalStorage();
                var scoreInputHtml = '<div class="scoreDetails"><p><span>Hello </span> <span>' + scoreFromStorage.firstName + '! ' + '</span></p><p><span></span> <span>' + scoreFromStorage.correctAnswer + '</span> of ' + questionsLength + ' correct</p></div>';
                  domItems.summary.insertAdjacentHTML('afterbegin', scoreInputHtml);

                  domItems.indicator.style.display = "block";

                  var blockWidth = 100 / questionsLength;
                  console.log('blockWidth ' + blockWidth);
                  var showBlockWidth = scoreFromStorage.correctAnswer * blockWidth;
                  if(scoreFromStorage.correctAnswer !== 0) {
                      domItems.fillIndicator.style.width = showBlockWidth + '%';
                      domItems.fillIndicator.style.height = "100%";
                  }
                  else {
                    domItems.fillIndicator.style.display = "none";
                  }

                  domItems.viewScore.style.display = "none";
                domItems.gotoHome.style.display = "inline-block";
               });
             }
          }
      }
      }
      addQuizOptDyn(quizOpt);

    },
    clearQuestionOnUI: function(question, optionContainer) {
      if(question) {
              question.innerHTML = '';
      optionContainer.innerHTML = '';
      }
    }
    };
    
})();

/*****************************/
/*****  MODULE CONTROLLER *****/
/*****************************/

var moduleController = (function(quizctrl, uictrl) {
   var selectedDomItems = uictrl.getDomItems;

if(selectedDomItems.loginButton) {
  selectedDomItems.loginButton.addEventListener('click', function(event) {
    quizctrl.checkLogin(selectedDomItems.firstName, selectedDomItems.lastName);
  });
}

  document.addEventListener('keydown', function(event) {
      if (event.keyCode === 13 || event.which === 13) {
           quizctrl.checkLogin(selectedDomItems.firstName, selectedDomItems.lastName);
        }
   });

 var checkQuestionOnLocalStorage = quizctrl.getQuestionFromQuizPage.getQuestionCollectionQuiz();

    uictrl.quizQuestionUI(checkQuestionOnLocalStorage); 

if(selectedDomItems.nextButton) {
  selectedDomItems.nextButton.addEventListener('click', function() {
      //console.log('Options ' + opt);
      //console.log('Question Id ' + parseInt(selectedDomItems.quizQuest.id));
      quizctrl.getNextQuestion(parseInt(selectedDomItems.quizQuest.id));  
});
} 
})(quizControllerQuiz, UIController);
