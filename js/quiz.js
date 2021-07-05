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
          fstName.value = '';
          lstName.value = '';
          document.querySelector('#login-btn').href = "quiz.html";
      }
    },
    getNextQuestion: function(questId) {

      var questNo, correctAnswer, wrongAnswer, totalQuestions, questionArray, isChecked, answer;

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

      axios.get('https://quiz-application-ca0b3-default-rtdb.firebaseio.com/questions.json')
        .then(response =>  { 
          const users  = [];
          const data = response.data;
          for(let key in data) {
            const user = data[key];
            user.id = key;
            users.push(user);
          }
          const currentQuestion = users.find((ques, index) => questId === ques.id);
          const currentQuestionIndex =  users.findIndex((ques, index) => questId === ques.id);

          for(var i = 0; i < opt.length; i++) {
            if(opt[i].checked) {
              if(currentQuestion.options[i] === currentQuestion.correctAnswer) {
                answerCorrectAnswer = answerCorrectAnswer + 1;
                isChecked = true;
              }else {
                answerWrongAnswer = answerWrongAnswer + 1;
                isChecked = true;
              }
            }
        }
      if(isChecked) {
        UIController.quizQuestionUI(currentQuestionIndex + 1);
      }
      else {
        alert('Please select an answer!');
      }
      var updateUserAnswers = new User(answerFirstName, answerLastName, answerCorrectAnswer, answerWrongAnswer);
      questionLocalStorage.setUserOnLocalStorage(updateUserAnswers);
        })
        .catch(error => console.log(error));
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
    summary: document.querySelector('.summary'),
    gotoHome: document.querySelector('.gotoHome'),
    viewScore: document.getElementById('viewScore'),
    scoreDetails: document.querySelector('.scoreDetails'),
    indicator: document.querySelector('.indicator'),
    fillIndicator: document.querySelector('.fill-indicator')
	};
    
	return {
		getDomItems: domItems,
    quizQuestionUI: function(questNo = 0) {
      function escapeHtml(text) {
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        }
      this.clearQuestionOnUI(domItems.quizQuest, domItems.quizOptContainer);
      var totalQuestions, inputHTML, quizInputHTML, quizOpt;
         axios.get('https://quiz-application-ca0b3-default-rtdb.firebaseio.com/questions.json')
        .then(response =>  { 
          const users  = [];
          const data = response.data;
          for(let key in data) {
            const user = data[key];
            user.id = key;
            users.push(user);
          }
        users.forEach((quest, index) => {
        if(index === questNo) {
          inputHTML = '<span class="quiz-question-number">Q. ' + (questNo + 1) +' </span><span class="quiz-question-text">'+ escapeHtml(quest.questionText) +'</span>';
          quizOpt = quest.options;
          
          if(domItems.quizQuest) {
            domItems.quizQuest.id = quest.id; 
          }           
          if(domItems.quizWrapper) {
          domItems.quizQuest.insertAdjacentHTML('beforeend', inputHTML);
         } 
         
        }
        else {

        }
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
        if(domItems.nextButton) {
            domItems.nextButton.style.display = "none";
            domItems.viewScore.style.display = "block";

            if(domItems.viewScore) {
              var questionsLength = users.length;
              console.log(questionsLength);
                domItems.viewScore.addEventListener('click', function() {
                  var scoreFromStorage = quizControllerQuiz.getQuestionFromQuizPage.getUserOnLocalStorage();
                var scoreInputHtml = '<div class="scoreDetails"><p><span>Hello </span> <span>' + scoreFromStorage.firstName + '! ' + '</span></p><p><span></span> <span>' + scoreFromStorage.correctAnswer + '</span> of ' + questionsLength + ' correct</p></div>';
                  domItems.summary.insertAdjacentHTML('afterbegin', scoreInputHtml);

                  domItems.indicator.style.display = "block";

                  var blockWidth = 100 / questionsLength;
                  console.log('blockWidth ' + blockWidth);
                  var showBlockWidth = scoreFromStorage.correctAnswer * blockWidth;
                  var resultInPercentage = (scoreFromStorage.correctAnswer / questionsLength) * 100;
                  console.log(resultInPercentage + '%');
                  var resultPhrase1 = '<div class="resul-pharase"><p>Great, you have cleard the test<img src="images/gold-medal.png" alt="certificate"></p></div>';
                  var resultPhrase2 = '<div class="resul-pharase"><p>Sorry, try again<img src="images/sad.png" alt="sad"></p><a class="gotoHome" href="index.html">Try Again</a></div>';
                  if(resultInPercentage >= 70) {
                    domItems.indicator.insertAdjacentHTML('beforeend', resultPhrase1);
                  }
                  else {
                    domItems.indicator.insertAdjacentHTML('beforeend', resultPhrase2);
                  }
                  if(scoreFromStorage.correctAnswer !== 0) {
                      domItems.fillIndicator.style.width = showBlockWidth + '%';
                      domItems.fillIndicator.style.height = "100%";
                  }
                  else {
                    domItems.fillIndicator.style.display = "none";
                  }

                  domItems.viewScore.style.display = "none";
                // domItems.gotoHome.style.display = "block";
               });
             }
          }
      }
      }
      addQuizOptDyn(quizOpt);
        })
      .catch(error => console.log(error));

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

    uictrl.quizQuestionUI(); 

if(selectedDomItems.nextButton) {
  selectedDomItems.nextButton.addEventListener('click', function() {
      //console.log('Options ' + opt);
      //console.log('Question Id ' + parseInt(selectedDomItems.quizQuest.id));
      quizctrl.getNextQuestion(selectedDomItems.quizQuest.id);  
});
} 
})(quizControllerQuiz, UIController);
