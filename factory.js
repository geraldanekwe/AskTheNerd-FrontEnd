app.factory('User', function($http, ATN, $state, $rootScope) {
    return {
      init: function() {
        ATN.fbRef.onAuth(function(authData) {
          if (authData) {
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
        console.log('whathappened?');
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
      editQuestion: function() {

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
