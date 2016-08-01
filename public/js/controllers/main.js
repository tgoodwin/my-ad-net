angular.module('radarController', ['topo'])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','Radar', 'topo', function($scope, $http, Radar, topo) {
		$scope.formData = {};
		$scope.loading = true;
		//$scope.options = { width: 4000 height: 5000 etc}
		$scope.selection = {};
		
		$scope.hovered = function(d) {
			$scope.selection = d;
			$scope.hovering = !!d;
			$scope.$apply();
		}

		$scope.showInfo = false;
		$scope.infoLabel = 'info';
		$scope.toggleInfo = function() {
			$scope.showInfo = $scope.showInfo ? false : true;
			$scope.infoLabel = $scope.showInfo ? 'close' : 'info';
		}

		// GET =====================================================================
		Radar.get()
			.success(function(data) {
				$scope.todos = data;
				$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {

			// if form is empty, nothing will happen
			if ($scope.formData.text != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Radar.create($scope.formData)

					// if successful creation, call our get function to get all the new todos
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.todos = data; // assign our new list of todos
					});
			}
		};

		// DELETE ==================================================================
		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			$scope.loading = true;

			Radar.delete(id)
				// if successful creation, call our get function to get all the new todos
				.success(function(data) {
					$scope.loading = false;
					$scope.todos = data; // assign our new list of todos
				});
		};
	}]);