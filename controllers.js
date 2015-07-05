  app.controller('NavbarCtrl', function($scope, $rootScope, $state, User) {
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
          $scope.isEditClicked = true;
          $scope.isLoggedInUser = $rootScope.activeUser === $scope.question.email;
          $scope.activateEditOrDelete = function() {
            var noAnswers = $scope.question.answers.length === 0;
            return $scope.isLoggedInUser && noAnswers;
          };
          $scope.isUser = function() {
            return $scope.isLoggedInUser;
          };
        }).catch(function(err) {
          console.error(err);
          $state.go("404");
        });

      $scope.activeUser = function() {
        return User.activeUser();
      };
      $scope.editQuestion = function() {
        Question.editQuestion();
        // $scope.isEditClicked === false ? $scope.isEditClicked === false: $scope.isEditClicked === true;
        console.log($scope.isEditClicked);
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
