angular.module('radarService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Radar', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/geo');
			},
			create : function(todoData) {
				return $http.post('/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete('/api/todos/' + id);
			}
		}
	}]);