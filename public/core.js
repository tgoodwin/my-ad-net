var adRadar = angular.module('adRadar', []);

function mainController($scope, $http) {

	$scope.formData = {}; //wont need, probably

	$http.get('/api/todos') // change to api/geo
		.success(function(data) {
			//bind JSON from API to $scope.todos
			$scope.todos = data;
			console.log(todos);
			//call mapbuilder on data
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	$scope.createTodo = function() { //clientside todo creation
     	$http.post('/api/todos', $scope.formData)
    		.success(function(data) {
    			$scope.formData = {}; // clear the form so our user is ready to enter another
    			$scope.todos = data;
    			console.log(data);
    		})
    		.error(function(data) {
    			console.log('Error: ' + data);
    		});
	};

    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
   		$http.delete('/api/todos/' + id)
    		.success(function(data) {
    			$scope.todos = data;
    			console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};
}