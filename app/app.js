'use strict';

/**
 * @ngdoc overview
 * @name angularfireSlackApp
 * @description
 * # angularfireSlackApp
 *
 * Main module of the application.
 */
angular
  .module('angularfireSlackApp', [
    'firebase',
    'angular-md5',
    'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home/home.html',
        resolve: {
          requireNoAuth: function($state, Auth){
            console.log('Invoked home\nState:', $state);
            return Auth.$requireAuth().then(function(auth){
              console.log('At home\nAuth:', auth);
              window.mullu = $state;
              $state.go('channels');
            }, function(error){
                console.log('Home locked:', error);
                return;
            });
          }
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'auth/login.html',
        controller: 'AuthCtrl as authCtrl',
        resolve: {
          requireNoAuth: function($state, Auth){
            return Auth.$requireAuth().then(function(auth){
              $state.go('home');
            }, function(error){
                return;
            });
          }
        }
      })
      .state('register', {
        url: '/register',
        templateUrl: 'auth/register.html',
        controller: 'AuthCtrl as authCtrl',
        resolve: {
          requireNoAuth: function($state, Auth) {
            console.log('requireNoAuth');
            return Auth.$requireAuth().then(function(auth){
              console.log('Navigating home');
              $state.go('home');
            }, function(error){
                console.log('Error', error);
                return;
            });
          }
        }
      })
      .state('profile', {
          url:'/profile',
          controller: 'ProfileCtrl as profileCtrl',
          templateUrl: 'users/profile.html',
          resolve: {
            auth: function($state, Users, Auth){
              return Auth.$requireAuth().catch(function(){
                $state.go('home');
              });
            },
            profile: function(Users, Auth){
              return Auth.$requireAuth().then(function(auth){
                return Users.getProfile(auth.uid).$loaded();
              });
            }
          }
        })
        .state('channels', {
          url: '/channels',
          controller: 'ChannelsCtrl as channelsCtrl',
          templateUrl: 'channels/index.html',
          resolve: {
            channels: function(Channels){
              return Channels.$loaded();
            },
          
            profile: function($state, Auth, Users){
              console.log('State:', $state, '\nUsers:', Users, '\nAuth:', Auth.$requireAuth);
              return Auth.$requireAuth().then(function(auth){
                console.log("SEETHIS:", auth);
                return Users.getProfile(auth.uid).$loaded().then(function(profile){
                  console.log("WOAH");
                  if(profile.displayName){
                    console.log('If worked', profile);
                    return profile;
                  } else {
                    console.log('Else :)))', profile);
                    $state.go('profile');
                  }
                });
              }, function(error){
                console.log('ERROR: For Auth.requireAuth promise', error);
                $state.go('home');
              });
            }
          }
        })
        .state('channels.create', {
          url:'/create',
          templateUrl: 'channels/create.html',
          controller: 'ChannelsCtrl as channelsCtrl'
        })

    $urlRouterProvider.otherwise('/');
  })
  .constant('FirebaseUrl', 'https://slack.firebaseio.com/');
