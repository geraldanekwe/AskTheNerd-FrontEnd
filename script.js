'use strict';

angular.module('heimdall', ['ui.router'])
  .constant("ATN", {
    "API_URL": "http://localhost:3000",
    "fbRef": new Firebase("https://askthenerd.firebaseio.com/")
  })
  .run(function(User) {
    User.init();
  })
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state('home', {
        url: "/",
        templateUrl: "list.html",
        controller: 'MainCtrl'
      })
      .state('404', {
        url: "/404",
        templateUrl: "404.html"
      })
      .state('new', {
        url: "/new",
        templateUrl: "new.html",
        controller: "NewQuestionCtrl"
      })
      .state('signup', {
        url: "/signup",
        templateUrl: "signup.html",
        controller: "UserCtrl"
      })
      .state('login', {
        url: "/login",
        templateUrl: "login.html",
        controller: "UserCtrl"
      })
      .state('logout', {
        url: "/logout",
        templateUrl: "logout.html",
        controller: ""
      })
      .state('question', {
        url: "/:slug",
        templateUrl: "question.html",
        controller: "QuestionCtrl"
      });
  })
  .factory('User', function($http, ATN, $state, $rootScope) {
    return {
      init: function() {
        ATN.fbRef.onAuth(function(authData) {
          if (authData) {
            // console.log("Authenticated successfully with payload:", authData);
            $rootScope.activeUser = authData.password.email;
          }
        });
      },
      email: "",
      register: function(user) {
        return ATN.fbRef.createUser(user, function(error, userData) {
          if (error) {
            console.log("Error creating user:", error);
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
            $state.go("login");
          }
        });
      },
      login: function(user) {
        ATN.fbRef.authWithPassword(user, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            $state.go('home');
          }
        });
      },
      logout: function(user) {
        $state.go('logout');
        return ATN.fbRef.unauth();
      },
      activeUser: function() {
        return $rootScope.activeUser === undefined;
      }
    }
  })
  .factory('Question', function($http, ATN) {
    return {
      getOne: function(slug) {
        return $http.get(ATN.API_URL + "/questions/" + slug);
      },
      getAll: function() {
        return $http.get(ATN.API_URL + "/questions");
      },
      addQuestion: function(newQuestion) {
        return $http.post(ATN.API_URL + "/questions", newQuestion);
      },
      deleteQuestion: function(slug) {
        return $http.delete(ATN.API_URL + "/questions/" + slug);
      }
    }
  })
  .factory('Answer', function($http, ATN) {
    return {
      addAnswer: function(newAnswer, slug) {
        return $http.post(ATN.API_URL + "/questions/" + slug + "/answers", newAnswer);
      }
    }
  })
  .filter("dateInWords", function() {
    return function(input) {
      return moment(input).utc().fromNow();
    }
  })
  .controller('NavbarCtrl', function($scope, $rootScope, $state, User) {
    $scope.logout = function() {
      User.logout($rootScope.activeUser);
    };
    $scope.activeUser = function() {
      return User.activeUser();
    };
  })
  .controller('NewQuestionCtrl', function($scope, Question, User, $state, $rootScope) {
    $scope.question = {};
    $scope.question.email = $rootScope.activeUser || "Login to Ask the Nerds";
    $scope.activeUser = function() {
      return User.activeUser();
    };
    $scope.askQuestion = function() {
      Question.addQuestion($scope.question)
        .success(function(data) {
          $scope.question.body = "";
          $state.go("home");
        })
        .catch(function(err) {
          console.error(err);
        })
    };
  })
  .controller('UserCtrl', function($scope, User, $state) {
    if ($state.includes('signup')) {
      $scope.getNewUser = function() {
        User.register($scope.user);
      }
    } else {
      $scope.loginUser = function() {
        User.login($scope.user);
      }
    }
  })
  .controller('QuestionCtrl', function($scope, $rootScope, Question, Answer, User, $state) {
    $scope.slug = $state.params.slug;

    Question.getOne($state.params.slug)
      .success(function(data) {
        $scope.question = data;
        console.log($scope.question.email);
        console.log($rootScope.activeUser);
        $scope.activateDelete = function() {
          var isLoggedInUser = $rootScope.activeUser === $scope.question.email;
          var noAnswers = $scope.question.answers.length === 0;
          return isLoggedInUser && noAnswers;
        };

      }).catch(function(err) {
        console.error(err);
        $state.go("404");
      });

    $scope.activeUser = function() {
      return User.activeUser();
    };


    $scope.deleteQuestion = function() {
      Question.deleteQuestion($state.params.slug);
    };


    $scope.addAnswer = function() {
      Answer.addAnswer($scope.answer, $scope.slug).success(function(data) {
        $scope.question = data;
        $scope.answer = {};
      }).catch(function(err) {
        console.error(err);
      });
    };
  })
  .controller('MainCtrl', function($scope, Question) {
    Question.getAll().success(function(data) {
      $scope.questions = data;
    }).catch(function(err) {
      console.error(err);
    });
  });
