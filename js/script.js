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
	
  // var questionLocalStorage = {
  //   setQuestionCollection: function(newCollection) {
  //     localStorage.setItem('QuestionId', JSON.stringify(newCollection));
  //   },
  //   getQuestionCollection: function() { 
  //    return JSON.parse(localStorage.getItem('QuestionId'));
  //   },
  //   removeQuestionCollection: function() {
  //     localStorage.removeItem('QuestionId');
  //   },
  //   clearLocaleStorage: function() {
  //     localStorage.clear('QuestionId');
  //   }
  // };
  // if (questionLocalStorage.getQuestionCollection() === null) {
  //       questionLocalStorage.setQuestionCollection([]);
  // }
 
return {
  // getQuestionLocalStorage: questionLocalStorage,
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

      // if (questionLocalStorage.getQuestionCollection().length > 0) {
      //  questionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length -1].id + 1;
      // }
      // else{
      //   questionId = 0;
      // }
      if (newQuestText.value !== '') {
        if (optionsArr.length > 1) {
          if (isChecked) {
      newQuestion = new Question(questionId, newQuestText.value, optionsArr, corrAns);
      
      // storedQuest = questionLocalStorage.getQuestionCollection();
      // storedQuest.push(newQuestion);
      // questionLocalStorage.setQuestionCollection(storedQuest);
      axios.post('https://quiz-application-ca0b3-default-rtdb.firebaseio.com/questions.json', newQuestion)
      .then(response => console.log(response))
      .catch(error => console.log(error));

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
    adminLogin: document.querySelector('.admin-login'),
    adminSignUp: document.querySelector('.admin-signup'),
    quizLoginForm: document.querySelector('.quiz-login-form'),
    adminLoginForm: document.querySelector('.admin-login-form'),
    adminSignUpForm: document.querySelector('.admin-signup-form'),
    adminSignUpButton: document.querySelector('.admmin-signup-btn'),
    loginEmail: document.getElementById('login-email'),
    loginPassword: document.getElementById('login-password'),
    adminLoginButton: document.getElementById('admin-login-btn'),
    signupEmail: document.getElementById('signup-email'),
    signupPassword: document.getElementById('signup-password'),
    signupLoginButton: document.getElementById('signup-login-btn'),
    adminPanelConatiner: document.querySelector('.admin-panel-container'),
    loginForm: document.getElementById('login-form'),
    logoutButton: document.getElementById('logout-btn'),
    inputErrorEmail: document.querySelector('.input-error-email'),
    inputErrorPassword: document.querySelector('.input-error-password'),
    inputInvalid: document.querySelector('.input-invalid'),
    insertQuestionError: document.querySelector('.insert-question-errors')
	};
	return {
	getDomItems: domItems,
  showErrorDynamically: function(message) {
      domItems.insertQuestionError.innerHTML = message;
      domItems.insertQuestionError.style.display = 'block';
      this.removeInputError(domItems.questInsertBtn, domItems.insertQuestionError);
  },
  removeInputUI: function() {
      var adminOptsWrapper = document.querySelectorAll('.admin-options-wrapper');
          adminOptsWrapper.forEach(function(item, index) {
          item.parentNode.removeChild(item);
      });
  },
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
    createQuestionList: function() {
      var questHTML, questionNumber;

      domItems.insertedQuestionWrapper.innerHTML = '';
      questionNumber = 0;
      axios.get('https://quiz-application-ca0b3-default-rtdb.firebaseio.com/questions.json')
        .then(response => {
          const users = [];
          const data = response.data;
          for(let key in data) {
            const user = data[key];
            user.id = key;
            users.push(user);
          }
          console.log(users);
          for(var i = 0; i < users.length; i++) {
        questHTML = '<p id="' + users[i].id + '"><span class="inserted-ques-text">' + ++questionNumber + '- ' + users[i].questionText + '</span><button class="edit-btn edit-btn-' + users.indexOf(users[i]) + '">Edit</button></p>';
        domItems.insertedQuestionWrapper.insertAdjacentHTML('beforeend', questHTML);
          } 
        })
        // questionNumber++;
        .catch(error => console.log(error));
      
      // for (var i = 0; i < getQuestions.getQuestionCollection().length; i++) {
      // }
      
    },
    addInput: function() {
          var inputHTML, z;
          z = document.querySelectorAll('.admin-option').length;
          inputHTML = '<div class="admin-options-wrapper"><input type="radio" name="answer" class="admin-options-' + z + '" value="' + z + '"><input type="text" class="admin-option admin-options-' + z + '" value=""></div>';
          domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);
      },
       editQuestionList: function(event, getEditQuestion) {
      var itemID, optionsList, z;
      itemID = event.target.parentNode.id;
      let adminOptsWrapper = document.querySelectorAll('.admin-options-wrapper');
      let adminOpts = Array.from(document.querySelectorAll('.admin-option'));

      axios.get('https://quiz-application-ca0b3-default-rtdb.firebaseio.com/questions.json')
      .then(response => {
        let users = [];
        const data = response.data; 
          for(let key in data) {
            const user = data[key];
            user.id = key;
            users.push(user);
          }
                for(var i = 0; i < users.length; i++) {
        if(itemID === users[i].id) {
            domItems.newQuestText.value = users[i].questionText;
            domItems.formsWrapper.id = users[i].id;
            domItems.questInsertBtn.style.display = 'none';
          
            optionsList = users[i].options;
              let answer = users[i].correctAnswer;
            

            if(optionsList.length === 3) {
                this.removeInputUI();

                this.addInput();
                this.addInput();
                this.addInput();
              
              let adminOpts = Array.from(document.querySelectorAll('.admin-option'));
              optionsList.forEach((option, index) => {
              adminOpts[index].value = option;
                  if(adminOpts[index].value === answer) {
                  adminOpts[index].previousElementSibling.checked = true;
                }
              });
              this.addInputDynamically();
            }
            else if(optionsList.length === 4) {

                this.removeInputUI();
                this.addInput();
                this.addInput();
                this.addInput();
                this.addInput();
              
              let adminOpts = Array.from(document.querySelectorAll('.admin-option'));
              optionsList.forEach((option, index) => {
              adminOpts[index].value = option;
                  if(adminOpts[index].value === answer) {
                  adminOpts[index].previousElementSibling.checked = true;
                }
              });
              this.addInputDynamically();
            }
            else if(optionsList.length === 2) {

                this.removeInputUI();
                this.addInput();
                this.addInput();
              
                let adminOpts = Array.from(document.querySelectorAll('.admin-option'));
                optionsList.forEach((option, index) => {
                adminOpts[index].value = option;
                  if(adminOpts[index].value === answer) {
                  adminOpts[index].previousElementSibling.checked = true;
                }
                });    
              this.addInputDynamically();
            }
        }
    }
        })
        .catch(error => console.log(error)); 

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
    removeInputError: function(focusElement, errorMessage) {
      focusElement.addEventListener('keydown', function() {
        errorMessage.style.display = "none";
      });
    },
    signUpFunction: function() {

    var baseUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAB_l_UtaTj0BOnsNQKKu268OhKR8TPp5o";
  
    if(domItems.signupEmail.value === '') {
        alert('plaese enter your email');
    }
    if(domItems.signupPassword.value === '') {
        alert('plaese enter your password');
    }
  else {
    var authData = {
      email: domItems.signupEmail.value,
      password: domItems.signupPassword.value,
      returnSecureToken: true
    };
    console.log(authData);
    axios.post(baseUrl, authData)
    .then(response => {
      console.log(response);
      // Cookies.set('jwtToken', response.data.idToken, );
      domItems.adminSignUpForm.style.display = 'none';
      domItems.adminLoginForm.style.display = 'block';
    })
    .catch(error => {
      console.log(error);
    });
  }
  domItems.signupEmail.value = '';
  domItems.signupPassword.value = '';
    },
  loginFunction: function() {
      var baseUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAB_l_UtaTj0BOnsNQKKu268OhKR8TPp5o";

   if(domItems.loginEmail.value === '') {
      domItems.inputErrorEmail.style.display = "block";
      domItems.inputInvalid.style.display = "none"; 
      this.removeInputError(domItems.loginEmail, domItems.inputErrorEmail); 
    }
    if(domItems.loginPassword.value === '') {
      domItems.inputErrorPassword.style.display = "block";
      domItems.inputInvalid.style.display = "none";
      this.removeInputError(domItems.loginPassword, domItems.inputErrorPassword); 
    }
  else {
    var authData = {
      email: domItems.loginEmail.value,
      password: domItems.loginPassword.value,
      returnSecureToken: true
    };
    console.log(authData);
    axios.post(baseUrl, authData)
    .then(response => {
      console.log(response);
      var expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
      localStorage.setItem('token', response.data.idToken);
      localStorage.setItem('expirationDate', expirationDate);
      domItems.loginForm.style.display = 'none';
      domItems.adminPanelConatiner.style.display = 'block';
      domItems.loginEmail.value = '';
      domItems.loginPassword.value = '';
    })
    .catch(error => {
      domItems.inputInvalid.style.display = 'block';
      console.log(error);
    });
  }
  },
  logoutFunction: function() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    domItems.adminPanelConatiner.style.display = 'none';
    domItems.loginForm.style.display = 'block';
  },
  checkAuthTimeout: function(expirationTime) {
    // var that = this;
    setTimeout(() => {
      this.logoutFunction();
    }, expirationTime * 1000);
  },
  checkAuthState: function() {
    var idToken = localStorage.getItem('token');
    var expirationDate = new Date(localStorage.getItem('expirationDate'));
    if(!idToken) {
      this.logoutFunction();
    }
    else if(expirationDate <= new Date()) {
      this.logoutFunction();  
    }
    else {
      domItems.adminPanelConatiner.style.display = 'block';
      domItems.loginForm.style.display = 'none';
      this.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000);
    }
  }
    
};
})();
/*****************************/
/*****  MODULE CONTROLLER *****/
/*****************************/

var moduleController = (function(quizctrl, uictrl) {
	
    var selectedDomItems = uictrl.getDomItems;
    uictrl.createQuestionList();
    uictrl.addInputDynamically();

    selectedDomItems.questInsertBtn.addEventListener('click', function() {
        var adminOpts = document.querySelectorAll('.admin-option');
        quizctrl.addQuestionOnLocalStorage(selectedDomItems.newQuestText, adminOpts);
        uictrl.removeInputUI();
        uictrl.addInput();
        uictrl.addInput();
        uictrl.createQuestionList();
    });
selectedDomItems.questionClearBtn.addEventListener('click', function() {
    let clearQuestion = confirm('Are you Sure you want to remove the question list?');
    if (clearQuestion == true) {
    quizctrl.getQuestionLocalStorage.clearLocaleStorage(); 
    quizctrl.getQuestionLocalStorage.getQuestionCollection();
    //selectedDomItems.insertedQuestionWrapper.innerHTML = '';
    uictrl.createQuestionList(); 
    }
});
selectedDomItems.insertedQuestionWrapper.addEventListener('click', function(event) {
    uictrl.editQuestionList(event, quizctrl.getQuestionLocalStorage);
});

selectedDomItems.updateButton.addEventListener('click', function() {
    uictrl.updateQuestion();
});

selectedDomItems.deleteButton.addEventListener('click', function() {
      let deleteQuestion = confirm('Are you Sure you want to delete the question?');
    if (deleteQuestion == true) {
      var formsWrapperId = selectedDomItems.formsWrapper.id;
      if(formsWrapperId) {
        quizctrl.deleteQuestionOnLocalStorage(parseInt(formsWrapperId));
        uictrl.deleteQuestionUI();
        uictrl.createQuestionList();
      }
    }
});

selectedDomItems.adminLogin.addEventListener('click', function() {
  selectedDomItems.quizLoginForm.style.display = 'none';
  selectedDomItems.adminLoginForm.style.display = 'block';
});

selectedDomItems.adminSignUp.addEventListener('click', function() {
  selectedDomItems.adminLoginForm.style.display = 'none';
  selectedDomItems.adminSignUpForm.style.display = 'block';
});

selectedDomItems.adminSignUpButton.addEventListener('click', function(event) {
   // event.preventDefault();
   uictrl.signUpFunction();

});

selectedDomItems.adminLoginButton.addEventListener('click', function(event) {
   // event.preventDefault();
  uictrl.loginFunction();
});

selectedDomItems.logoutButton.addEventListener('click', function() {
    uictrl.logoutFunction();
});

window.onload = function() {
  uictrl.checkAuthState();
}	
})(quizController, UIController);
