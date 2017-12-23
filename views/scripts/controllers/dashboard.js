'use strict';
/**
 * @ngdoc function
 * @name sampleApp.controller:dashboardCtrl
 * @description
 * # MainCtrl
 * Controller of the sampleApp
 */
angular.module('sampleApp')
  .controller('dashboardCtrl', function ($scope,$state,$stateParams,$rootScope,$uibModal,$uibModalStack,$http,$cookies,Notification) {
console.log($stateParams);
$scope.id=$stateParams.id;
      $rootScope.productStatus = ['Active', 'Inactive'];
      $scope.update = function() {
          Notification.primary({
              message: 'Your Session Expired!',
              delay: 5000,

          });
      };
      $scope.filter = 'date_added' ;
      $rootScope.filterBy = [{'label':'Recent Projects', 'value': 'date_added'}, {'label': 'Category Name', 'value': 'category_name'},{'label': 'Username', 'value': 'username'},{'label': 'Project Title','value':'project_title'}];

//$rootScope.status = {'Recent Projects':'Recent Projects', 'Category Name':'category', 'Username':'username'};

 $rootScope.user={
   count:5,pages:1,limit:2
 }
$rootScope.userid=1;
$scope.countProducts = function(filter){
  //$rootScope.pages=1;
  console.log(filter);
   $scope.skip = ($rootScope.user.pages - 1) * $rootScope.user.limit;
  console.log("fdfdffdff",$scope.skip);
  var data = {
      headers: {
        "userid":$scope.id,
        "status":filter ,
        "skip":$scope.skip,
        "limit":$rootScope.user.limit
      }
    };
  var query = JSON.stringify(data)
  console.log(data);
  var url = window.remote + 'api/getUserData';
  $http.get(url,data).then(function(res){
    if (res.data) {
    $rootScope.userdata=res.data.result;
    $rootScope.user.count=res.data.count[0].count;
    console.log(res.data.count[0].count,$rootScope.user.count);
  }else if (res.data.login || res.data.login===false){
    //$scope.update();
    $state.go('login');
  }
  }, function(err){
    $scope.error = err;
  });
};
$scope.countProducts($scope.filter);
// $rootScope.isAuthenticate = function(){
//   $http.get( window.remote + 'api/AuthenticationUser' ).then(function(res){
//           if (res.data.login===true) {
//             console.log("welcomeeeeee",res.data.login);
//             $scope.countProducts();
//           }else if (res.data.login===false) {
//             $state.go('login');
//               console.log("welcomeeeeee",res.data);
//           }
//       }, function(err){
//     });
// }
// $rootScope.isAuthenticate();

});
