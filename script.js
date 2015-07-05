'use strict';

var app = angular.module('heimdall', ['ui.router']);

app.constant("ATN", {
    "API_URL": "https://pure-sands-8046.herokuapp.com/",
    "fbRef": new Firebase("https://askthenerd.firebaseio.com/")
  })
  .run(function(User) {

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
        url: "/login",
        templateUrl: "login.html",
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
      templateUrl: 'entryform.html'
    };
  })
  .directive('navigationBar', function() {
    return {
      restrict: 'E',
      templateUrl: 'navbar.html'
    };
  })
  .filter("dateInWords", function() {
    return function(input) {
      return moment(input).utc().fromNow();
    }
  });
