angular.module('radarController', ['topo'])

	.controller('mainController', ['$scope','$http','Radar', 'topo', function($scope, $http, Radar, topo) {
		$scope.formData = {};
		$scope.loading = true;
		$scope.selection = {};
		
		$scope.hovered = function(d) {
			$scope.selection = d;
			$scope.hovering = !!d;
			$scope.$apply();
		}

		$scope.showInfo = false;
		$scope.infoLabel = 'what is this?';
		$scope.toggleInfo = function() {
			$scope.showInfo = $scope.showInfo ? false : true;
			$scope.infoLabel = $scope.showInfo ? 'close' : 'info';
		}

		Radar.get()
			.success(function(data) {
				$scope.coords = data;
				$scope.loading = false;
			});

		Radar.find()
			.success(function(data) {
				$scope.client = data;
			});
			
		Radar.getStats()
			.success(function(data) {
				$scope.stats = data;
			})
	}]);