var app = angular.module('scotchTodo', [
	'todoController',
	'todoService'
	]);

app.directive('supermap', ['topo', function(topo) {
	return {
		restrict: 'E',
		replace: false,
		scope: {
			id: '@',
			topo: '=mapData',
			coords: '=todos'
		},
		link: function(scope, element, attr) {
			var width = 900;
			var height = 500;
			var projection = d3.geo.albersUsa();
			var path = d3.geo.path().projection(projection);

			var svg = d3.select(element[0])
				.append('svg')
				.attr('width', '100%')
				.attr('height', 500);

			// re-render d3 canvas on resize
			window.onresize = function() {
				return scope.$apply;
			};
			scope.$watch(function() {
				return angular.element(window)[0].innerWidth;
			}, function() {
				return scope.render(scope.coords);
			});

			scope.$watch('coords', function(newVal, oldVal) {
				if (!!newVal)
					return scope.render(newVal);
			}, true);

			// d3 map drawing code here. -------
			scope.render = function(data) {

				svg.selectAll('*').remove();
				svg.insert('path', '.graticule')
					.datum(topojson.feature(topo, topo.objects.land))
					.attr('d', path);

				svg.insert('path', '.graticule')
					.datum(topojson.mesh(topo, topo.objects.states, function(a, b) { return a !== b }))
					.attr('class', 'state-boundary')
					.attr('stroke', "#fff")
					.attr('d', path);

				svg.selectAll('circle')
					.data(data)
					.enter()
					.append('circle')
					.attr('cx', function (d) { return projection(parseInt(d.latf)); })
					.attr('cy', function (d) { return projection(parseInt(d.lonf)); })
					.attr('ip-address', function(d) { return d.ip; })
					.attr('r', 8)
					.attr('fill', 'red');
				// });
			};
		},
		template: '<div class="chart">Here I am to save the day</div>'
	}
}]);
