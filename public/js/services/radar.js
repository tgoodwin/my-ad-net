angular.module('radarService', [])

	.factory('Radar', ['$http',function($http) {
		return {
			get : function() {
				return $http.get('/api/geo');
			},
			find : function() {
				return $http.get('/api/geo/client');
			},
			getStats : function() {
				return $http.get('/api/stats');
			}

			// create : function(todoData) {
			// 	return $http.post('/api/todos', todoData);
			// },
			// delete : function(id) {
			// 	return $http.delete('/api/todos/' + id);
			// }
		}
	}]);