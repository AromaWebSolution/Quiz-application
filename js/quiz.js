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
})();

/*****************************/
/******  UI CONTROLLER ******/
/*****************************/

var UIController = (function() {
})();

/*****************************/
/*****  MODULE CONTROLLER *****/
/*****************************/

var moduleController = (function(quizctrl, uictrl) {
})(quizControllerQuiz, UIController);
