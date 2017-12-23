'use strict';

/**
* @ngdoc function
* @name sampleApp.controller:AccountCtrl
* @description
* # MainCtrl
* Controller of the sampleApp
*/
angular.module('sampleApp')
 .controller('AccountCtrl', function ($scope, $rootScope, $uibModal, $uibModalStack, $cookies, $http,Notification, $state) {
                 $scope.success = function() {
                     Notification.success({
                         message: ' Login Successful',
                         delay: 5000,
                         });
                 };

                 $scope.update = function() {
                     Notification.primary({
                         message: 'Logout succesfully',
                         delay: 5000,

                     });
                 };
                 $scope.warning= function() {
                     Notification.warning({
                         message: 'Invalid username or Password',
                         delay: 5000,

                     });
                 };


  // login ajax method
  $rootScope.loginUser = function(user){
  //  console.log(user);
    var data={email:user.email,password:user.password} ;
    //console.log( window.remote);
    $http.post( window.remote + 'api/login', data ).then(function(res){
      if(res.data){
        $rootScope.user=res.data;
        $rootScope.userid=res.data[0].user_id;
        console.log($rootScope.userid);
        $scope.success();
        $state.go('dashboard',{'id': $rootScope.userid});
      }
    }, function(err){
  });
};
$rootScope.logout = function(){
  $http.post( window.remote + 'api/logout' ).then(function(res){
    if(res.data){
       $scope.update();
      $state.go('login');
    }
  }, function(err){
});
};

 });
