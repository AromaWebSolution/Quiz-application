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
