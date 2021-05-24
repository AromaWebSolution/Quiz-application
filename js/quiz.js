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
   };
})();

/*****************************/
/******  UI CONTROLLER ******/
/*****************************/

var UIController = (function() {
    
   var domItems = {
    firstName: document.getElementById('first-name'),
    lastName: document.getElementById('last-name'),
    loginButton: document.getElementById('login-btn')
	};
    
	return {
		getDomItems: domItems,
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
})(quizControllerQuiz, UIController);
