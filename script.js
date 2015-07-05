'use strict';

angular.module('heimdall', ['ui.router'])
  .constant("ATN", {
    "API_URL": "http://localhost:3000",
    "fbRef": new Firebase("https://askthenerd.firebaseio.com/")
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
            console.log("Authenticated successfully with payload:", authData);
            $rootScope.activeUser = authData.uid;
            $state.go('home');
          }
        });
      },
      logout: function(user) {
        $state.go('logout');
        return ATN.fbRef.unauth();
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
      return $rootScope.activeUser === undefined;
    };
  })
  .controller('NewQuestionCtrl', function($scope, Question, $state) {
    $scope.askQuestion = function() {
      Question.addQuestion($scope.question)
        .success(function(data) {
          $scope.question = {};
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
  .controller('QuestionCtrl', function($scope, Question, Answer, $state) {
    $scope.slug = $state.params.slug;

    Question.getOne($state.params.slug)
      .success(function(data) {
        $scope.question = data;
      }).catch(function(err) {
        console.error(err);
        $state.go("404");
      });

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
