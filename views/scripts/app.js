'use strict';

/**
 * @ngdoc overview
 * @name sampleApp
 * @description
 * # sampleApp
 *
 * Main module of the application.
 */
angular
  .module('sampleApp', [
    'ngResource',
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap',
    'ngMessages',
    'ui-notification'
   ])

  .config(function($stateProvider, $locationProvider, $urlRouterProvider) {
    $urlRouterProvider
    .otherwise('/login');

    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'views/account/login.html',
      controller: 'AccountCtrl'
    })
  .state('dashboard', {
    url: '/dashboard/:id',
    templateUrl: 'views/user/dashboard.html',
    controller: 'dashboardCtrl'
  })
    //  $locationProvider.html5Mode(true);
  }).run(function($rootScope,  $state, $stateParams, $http, $uibModal, $uibModalStack, $cookies, Notification, $window) {

    $rootScope.hasElementClosed = false;
                  $rootScope.successCart = function() {
                      Notification.success({
                          message: 'login succesfully',
                          delay: 5000,
                          });
                  };
                  $rootScope.errorCart = function(description) {
                      Notification.warning({
                          message: description,
                          delay: 5000,
                          });
                  };
                  $rootScope.dealsincart = function() {
                      Notification.warning({
                          message: ' welcome',
                          delay: 10000
                          });
                  };

        // logout method
        $rootScope.logout = function(){
          var url = window.remote + 'api/spaye_users/logout?access_token='+ $rootScope.user.accessToken;
          $http.post(url).then(function(){
            window.location=window.remote+"#!/main/home";
              $cookies.remove('shopaye_token');
              $cookies.remove('shopaye_id');
              delete $rootScope.user;
              $rootScope.close();
              window.location=window.remote+'#!/main/home';
          }, function(err){
            if(err){
              $rootScope.errorMessage = err.data.error;
            }
          });
        };

    });
