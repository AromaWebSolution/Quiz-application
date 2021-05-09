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
 
return {
  getQuestionLocalStorage: questionLocalStorage,
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
  },
    deleteQuestionOnLocalStorage: function(questionId) {
      var questionCollection = questionLocalStorage.getQuestionCollection();
      for(var i = 0; i < questionCollection.length; i++) {
        if(questionId === questionCollection[i].id) {
          var questionIndex = questionCollection.indexOf(questionCollection[i]);
          questionCollection.splice(questionIndex, 1);
        }
      }
      questionLocalStorage.setQuestionCollection(questionCollection);
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
	getDomItems: domItems,
	addInputDynamically: function() {
      	let addInput = function() {
        var inputHTML, z;
        
        z = document.querySelectorAll('.admin-option').length;
        inputHTML = '<div class="admin-options-wrapper"><input type="radio" name="answer" class="admin-options-' + z + '" value="' + z + '"><input type="text" class="admin-option admin-options-' + z + '" value=""></div>';
        domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
        
      domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput); 
      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
      }
      domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);      
    },
    createQuestionList: function(getQuestions) {
      var questHTML, questionNumber;

      domItems.insertedQuestionWrapper.innerHTML = '';
      questionNumber = 0;
      
      for (var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
        questHTML = '<p id="' + getQuestions.getQuestionCollection()[i].id + '"><span class="inserted-ques-text">' + ++questionNumber + '- ' + getQuestions.getQuestionCollection()[i].questionText + '</span><button class="edit-btn edit-btn-' + getQuestions.getQuestionCollection()[i].id + '">Edit</button></p>';
        domItems.insertedQuestionWrapper.insertAdjacentHTML('beforeend', questHTML); 
      }  
    },
    editQuestionList: function(event, getEditQuestion) {
      var itemID, optionsList, z;
      itemID = parseInt(event.target.parentNode.id);
      let adminOptsWrapper = document.querySelectorAll('.admin-options-wrapper');
      let adminOpts = Array.from(document.querySelectorAll('.admin-option'));

      let addInput = function() {
          var inputHTML, z;
          z = document.querySelectorAll('.admin-option').length;
          inputHTML = '<div class="admin-options-wrapper"><input type="radio" name="answer" class="admin-options-' + z + '" value="' + z + '"><input type="text" class="admin-option admin-options-' + z + '" value=""></div>';
          domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
      }

      for(var i = 0; i < getEditQuestion.getQuestionCollection().length; i++) {
        if(itemID === getEditQuestion.getQuestionCollection()[i].id) {
            domItems.newQuestText.value = getEditQuestion.getQuestionCollection()[i].questionText;
            domItems.formsWrapper.id = getEditQuestion.getQuestionCollection()[i].id;
            domItems.questInsertBtn.style.display = 'none';
          
            optionsList = getEditQuestion.getQuestionCollection()[i].options;
              let answer = getEditQuestion.getQuestionCollection()[i].correctAnswer;
            

            if(optionsList.length === 3) {
                adminOptsWrapper.forEach(function(item, index) {
                    item.parentNode.removeChild(item);
                });
                addInput();
                addInput();
                addInput();
              
              let adminOpts = Array.from(document.querySelectorAll('.admin-option'));
              optionsList.forEach((option, index) => {
              adminOpts[index].value = option;
                  if(adminOpts[index].value === answer) {
                  adminOpts[index].previousElementSibling.checked = true;
                }
              });
            }
            else if(optionsList.length === 4) {

                adminOptsWrapper.forEach(function(item, index) {
                    item.parentNode.removeChild(item);
                });

                addInput();
                addInput();
                addInput();
                addInput();
              let adminOpts = Array.from(document.querySelectorAll('.admin-option'));
              optionsList.forEach((option, index) => {
              adminOpts[index].value = option;
                  if(adminOpts[index].value === answer) {
                  adminOpts[index].previousElementSibling.checked = true;
                }
              });

            }
            else if(optionsList.length === 2) {

                adminOptsWrapper.forEach(function(item, index) {
                    item.parentNode.removeChild(item);
                });
                addInput();
                addInput();
              
                let adminOpts = Array.from(document.querySelectorAll('.admin-option'));
                optionsList.forEach((option, index) => {
                adminOpts[index].value = option;
                  if(adminOpts[index].value === answer) {
                  adminOpts[index].previousElementSibling.checked = true;
                }
                });    
            }
        }
    }
    domItems.deleteButton.style.display = 'inline-block';
    domItems.updateButton.style.display = 'inline-block';
},
    updateQuestion: function() {
      let mylStorage = quizController.getQuestionLocalStorage.getQuestionCollection();
      let adminOpts = document.querySelectorAll('.admin-option');
      let newQuestText  = document.getElementById('new-question-text');

    function Question(id, questionText, options, correctAnswer) {
    this.id = id;
    this.questionText = questionText;
    this.options = options;
    this.correctAnswer = correctAnswer;
  }

      for(var i = 0; i < mylStorage.length; i++) {
        if (mylStorage[i].id === parseInt(domItems.formsWrapper.id)) {
          var questionId = mylStorage[i].id;
          var questionIndex = mylStorage.indexOf(mylStorage[i]);
    
           function updateFunction(newQuestText, opts) {
            var optionsArr, corrAns, newQuestion, storedQuest, isChecked;
            optionsArr = [];
 
      for (var i = 0; i < opts.length; i++) {
        if(opts[i].value !== "") {
          optionsArr.push(opts[i].value);
        }
        if (opts[i].previousElementSibling.checked && opts[i].value !== '') {
          corrAns = opts[i].value;
          isChecked = true;
        }
      }

      if (newQuestText.value !== '') {
        if (optionsArr.length > 1) {
          if (isChecked) {
            newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
              mylStorage.splice(questionIndex, 1, newQuestion);
            quizController.getQuestionLocalStorage.setQuestionCollection(mylStorage);
           newQuestText.value = '';

      for (var x = 0; x < opts.length; x++) {
        opts[x].value = '';
        opts[x].previousElementSibling.checked = false; 
      }
      domItems.questInsertBtn.style.display = 'block';
      domItems.deleteButton.style.display = 'none';
      domItems.updateButton.style.display = 'none';

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
      updateFunction(newQuestText, adminOpts);
        }
      }
    },
    deleteQuestionUI: function() {
      var opts = document.querySelectorAll('.admin-option');
      var adminOpts = document.querySelectorAll('.admin-options-wrapper');
      domItems.newQuestText.value = '';
      for (var x = 0; x < opts.length; x++) {
        opts[x].previousElementSibling.checked = false;
        opts[x].value = ''; 
      }
      domItems.deleteButton.style.display = 'none';
      domItems.updateButton.style.display = 'none';
      domItems.questInsertBtn.style.display = 'block';
    },
    
};
})();
/*****************************/
/*****  MODULE CONTROLLER *****/
/*****************************/

var moduleController = (function(quizctrl, uictrl) {
	
    var selectedDomItems = uictrl.getDomItems;
    uictrl.createQuestionList(quizctrl.getQuestionLocalStorage);
    uictrl.addInputDynamically();

    selectedDomItems.questInsertBtn.addEventListener('click', function() {
        var adminOpts = document.querySelectorAll('.admin-option');
        quizctrl.addQuestionOnLocalStorage(selectedDomItems.newQuestText, adminOpts);
        uictrl.createQuestionList(quizctrl.getQuestionLocalStorage);
    });

})(quizController, UIController);
