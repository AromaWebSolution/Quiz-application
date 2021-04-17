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
    }
  };
  if (questionLocalStorage.getQuestionCollection() === null) {
        questionLocalStorage.setQuestionCollection([]);
  }
 
return {
  addQuestionOnLocalStorage: function(newQuestText, opts) {
     var optionsArr, corrAns, questionId, newQuestion, storedQuest, isChecked;
      optionsArr = [];
      isChecked = false;
 
      for (var i = 0; i < opts.length; i++) {
        if(opts[i].value !== "") {
          optionsArr.push(opts[i].value);
        }
        if (opts[i].previousElementSibling.checked && opts[i].value !== '') {
          corrAns = opts[i].value;
          isChecked = true;
        }
      }

      if (questionLocalStorage.getQuestionCollection().length > 0) {
       questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length -1].id + 1;
      }
      else{
        questionId = 0;
      }
      if (newQuestText.value !== '') {
        if (optionsArr.length > 1) {
          if (isChecked) {
      newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
      
      storedQuest = questionLocalStorage.getQuestionCollection();
      storedQuest.push(newQuestion);
      questionLocalStorage.setQuestionCollection(storedQuest);

      newQuestText.value = '';

      for (var x = 0; x < opts.length; x++) {
        opts[x].value = '';
        opts[x].previousElementSibling.checked = false; 
      }

      }else{
        alert('you missed to Check the correct Answer options');
      }
      }else{
        alert('Please Insert atleast two Item');
      }
      }
      else{
        alert('Please Enter the Question');
      }
  }
};

})();

/*****************************/
/******  UI CONTROLLER ******/
/*****************************/

var UIController = (function() {
	//****** Admin Panel Section ******

	var domItems = {
		questInsertBtn: document.getElementById('question-insert-btn'),
		newQuestText: document.getElementById('new-question-text'),
		adminOpts: document.querySelectorAll('.admin-option'),
    adminOptsWrapper: document.querySelectorAll('.admin-options-wrapper'),
    adminOptionsContainer: document.querySelector('.admin-options-container'),
    insertedQuestionWrapper: document.querySelector('.inserted-questions-wrapper'),
    questionClearBtn: document.getElementById('question-clear-btn'),
    editButton: document.querySelectorAll('.edit-btn'),
    formsWrapper: document.querySelector('.forms-wrapper'),
    updateButton: document.getElementById('question-update-btn'),
    deleteButton: document.getElementById('question-delete-btn'),
	};
	return {
		getDomItems: domItems
    
};
})();
/*****************************/
/*****  MODULE CONTROLLER *****/
/*****************************/

var moduleController = (function(quizctrl, uictrl) {

})(quizController, UIController);
