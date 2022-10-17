/*****************************/
/*****  QUIZ CONTROLLER ******/
/*****************************/

var quizControllerQuiz = (function () {
    // ******* QUESTION CONSTRUCTOR 
  function User(fullName, correctAnswer, wrongAnswer) {
    this.fullName = fullName;
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
    getUserOnLocalStorage: function(key) {
      return JSON.parse(localStorage.getItem(key));
    },
    removeUserOnLocalStorage: function(key) {
      localStorage.removeItem(key);
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

      answer = questionLocalStorage.getUserOnLocalStorage("userName");
      //questNo = 0;
      if(questionLocalStorage.getQuestionCollectionQuiz() !== '') {
        user = questionLocalStorage.getQuestionCollectionQuiz();

      }
      
      var answerFirstName = answer.fullName;
      // var answerLastName = answer.lastName;
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
      var updateUserAnswers = new User(answerFirstName, answerCorrectAnswer, answerWrongAnswer);
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
        var deleteAccount = "https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyAB_l_UtaTj0BOnsNQKKu268OhKR8TPp5o";
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
          const currentQuestion = users.find((ques, index) => questNo === index);
        // users.forEach((quest, index) => {
        if(currentQuestion) {
          inputHTML = '<span class="quiz-question-number">Q. ' + (questNo + 1) +' </span><span class="quiz-question-text">'+ escapeHtml(currentQuestion.questionText) +'</span>';
          quizOpt = currentQuestion.options;
          
          if(domItems.quizQuest) {
            domItems.quizQuest.id = currentQuestion.id; 
          }           
          if(domItems.quizWrapper) {
          domItems.quizQuest.insertAdjacentHTML('beforeend', inputHTML);
         } 
         
        }
        else {

        }
      // });
      function addQuizOptDyn(opts) {
        if(opts) {
          for(var i = 0; i < opts.length; i++) {
          quizInputHTML = '<div class="quiz-options-wrapper"><input type="radio" name="answer" class="admin-options-' + i +'" value="' + i +'"><span class="quiz-question-option quiz-question-options-' + i +'">' + escapeHtml(opts[i]) +'</span></div>';
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
                domItems.viewScore.addEventListener('click', function() {
                      axios.post(deleteAccount, {idToken: quizControllerQuiz.getQuestionFromQuizPage.getUserOnLocalStorage("idToken")})
    .then(response => {
      console.log(response);
      quizControllerQuiz.getQuestionFromQuizPage.removeUserOnLocalStorage('idToken');
    })
    .catch(error => {
      console.log(error);
    });
                  var scoreFromStorage = quizControllerQuiz.getQuestionFromQuizPage.getUserOnLocalStorage("userName");
                var scoreInputHtml = '<div class="scoreDetails"><p><span>Hello </span> <span>' + scoreFromStorage.fullName + '! ' + '</span></p><p><span></span> <span>' + scoreFromStorage.correctAnswer + '</span> of ' + questionsLength + ' correct</p></div>';
                  domItems.summary.insertAdjacentHTML('afterbegin', scoreInputHtml);

                  domItems.indicator.style.display = "block";

                  var blockWidth = 100 / questionsLength;
                  var showBlockWidth = scoreFromStorage.correctAnswer * blockWidth;
                  var resultInPercentage = (scoreFromStorage.correctAnswer / questionsLength) * 100;
                  var resultPhrase1 = '<div class="resul-pharase"><p>Great, you have cleard the test<img src="images/certificate.png" alt="certificate"></p><p>You may close the winodw or go to <a class="gotoHome" href="index.html">homepage</a></p></div>';
                  var resultPhrase2 = '<div class="resul-pharase"><p class="failed-margin-top">Sorry, try again<img src="images/sad.png" alt="sad"></p><p><a class="gotoHome" href="index.html">Try Again</a></p></div>';
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

// if(selectedDomItems.loginButton) {
//   selectedDomItems.loginButton.addEventListener('click', function(event) {
//     quizctrl.checkLogin(selectedDomItems.firstName, selectedDomItems.lastName);
//   });
// }

//   document.addEventListener('keydown', function(event) {
//       if (event.keyCode === 13 || event.which === 13) {
//            quizctrl.checkLogin(selectedDomItems.firstName, selectedDomItems.lastName);
//         }
//    });

    uictrl.quizQuestionUI(); 

if(selectedDomItems.nextButton) {
  selectedDomItems.nextButton.addEventListener('click', function() {
      //console.log('Options ' + opt);
      //console.log('Question Id ' + parseInt(selectedDomItems.quizQuest.id));
      quizctrl.getNextQuestion(selectedDomItems.quizQuest.id);  
});
} 
})(quizControllerQuiz, UIController);
