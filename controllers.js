  app.controller('NavbarCtrl', function($scope, $rootScope, $state, User) {
      $scope.logout = function() {
        User.logout($rootScope.activeUser);
      };
    })
    .controller('NewQuestionCtrl', function($scope, Question, User, $state, $rootScope) {
      User.init();
      $scope.question = {};
      $scope.question.email = $rootScope.activeUser;

      $scope.askQuestion = function() {
        Question.addQuestion($scope.question)
          .success(function(data) {
            $scope.question.body = "";
            $state.go("home");
          })
          .catch(function(err) {
            console.error(err);
            $state.go("404");
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
      User.init();

      Question.getOne($state.params.slug)
        .success(function(data) {
          $scope.singleQuestion = data;
          $scope.isLoggedInUser = $rootScope.activeUser === $scope.singleQuestion.email;
          $scope.activateEditOrDelete = function() {
            var noAnswers = $scope.singleQuestion.answers.length === 0;
            return $scope.isLoggedInUser && noAnswers;
          };
          $scope.isUser = function() {
            return $scope.isLoggedInUser;
          };
          $scope.isUserandLoggedIn = function() {
            console.log($scope.isLoggedInUser && !$rootScope.activeUser);
            return $scope.isLoggedInUser && !$rootScope.activeUser;
          };
        }).catch(function(err) {
          console.error(err);
          $state.go("404");
        });

      $scope.showEditForm = function() {
        $scope.isEditClicked = !$scope.isEditClicked;
        Question.getOne($state.params.slug)
          .success(function(data) {
            $scope.question = data;
            $scope.question.email = $rootScope.activeUser;
          }).catch(function(err) {
            console.error(err);
            $state.go("404");
          });
      };

      $scope.editQuestion = function() {
        Question.editQuestion($state.params.slug, $scope.question)
          .success(function(data) {
            $state.go("home");
          })
          .catch(function(err) {
            console.error(err);
            $state.go("404");
          });
        $scope.isEditClicked = !$scope.isEditClicked;

      };

      $scope.showAnswerForm = function() {
        $scope.isAddClicked = !$scope.isAddClicked;
        Question.getOne($state.params.slug)
          .success(function(data) {
            $scope.question = data;
            $scope.question.body = "";
            $scope.question.email = $rootScope.activeUser;
          }).catch(function(err) {
            console.error(err);
            $state.go("404");
          });
      };

      $scope.addAnswer = function() {
        Answer.addAnswer($scope.question, $scope.slug)
          .success(function(data) {
            $scope.question = data;
            $scope.isAddClicked = !$scope.isAddClicked;
          }).catch(function(err) {
            console.error(err);
            $state.go("404");
          });
      };

      $scope.deleteQuestion = function() {
        Question.deleteQuestion($state.params.slug)
          .success(function(data) {
            $state.go("home");
          })
          .catch(function(err) {
            console.error(err);
            $state.go("404");
          });
      };
    })
    .controller('MainCtrl', function($scope, Question, User) {
      User.init();

      Question.getAll().success(function(data) {
        $scope.questions = data;
      }).catch(function(err) {
        console.error(err);
      });
    });
