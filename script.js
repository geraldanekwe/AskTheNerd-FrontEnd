'use strict';

var app = angular.module('heimdall', ['ui.router']);

app.constant("ATN", {
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
  .directive('entryForm', function() {
    return {
      restrict: 'E',
      template: '<form class="form-horizontal" accept-charset="UTF-8" method="post" ng-submit="askQuestion()"> <div class="form-group"> <label for="inputEmail" class="col-sm-2 control-label">Email</label> <div class="col-sm-10"> <p>{{question.email}}</p> </div> </div> <div class="form-group"> <label for="inputQuestion" class="col-sm-2 control-label">Question</label> <div class="col-sm-10"> <textarea class="form-control" ng-model="question.body" id="inputQuestion" placeholder="What would you like to know" required></textarea> </div> </div> <div class="form-group"> <div class="col-sm-10 col-sm-offset-2"> <button type="submit" ng-disabled="activeUser()" class="btn btn-primary">Submit</button> </div> </div> </form>'
    };
  })
  .filter("dateInWords", function() {
    return function(input) {
      return moment(input).utc().fromNow();
    }
  });
