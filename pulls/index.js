(function() {

app.controller('MainCtrl',function($scope, $rootScope, $timeout, $controller) {


    $scope.singlePull = function() {
		
        $scope.getElementById("demo").innerHTML = "pull result: " + random;
    };

})();
