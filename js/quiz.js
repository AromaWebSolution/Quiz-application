/*****************************/
/*****  QUIZ CONTROLLER ******/
/*****************************/

var quizController = (function () {
    // ******* QUESTION CONSTRUCTOR 
  function Question(id, questionText, options, correctAnswer) {
  	this.id = id;
  	this.questionText = questionText;
  	this.options = options;
  	this.correctAnswer = correctAnswer;
  }
    
var questionLocalStorage = {
    setQuestionCollection: function(newCollection) {
      localStorage.setItem('QuestionId', JSON.stringify(newCollection));
    },
    getQuestionCollection: function() { 
     return JSON.parse(localStorage.getItem('QuestionId'));
    },
    removeQuestionCollection: function() {
      localStorage.removeItem('QuestionId');
    },
    clearLocaleStorage: function() {
      localStorage.clear('QuestionId');
    }
  };
    
if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
  }
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
})(quizController, UIController);
