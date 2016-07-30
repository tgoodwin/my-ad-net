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
			var width = 960;
			var height = 500;
			var projection = d3.geo.albers()
				.scale(1000)
				.translate([width / 2, height / 2]);

			var path = d3.geo.path().projection(projection);
			var svg = d3.select(element[0])
				.append('svg')
				.attr('width', width)
				.attr('height', height);

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

				// state borders
				svg.insert('path', '.graticule')
					.datum(topojson.mesh(topo, topo.objects.states, function(a, b) { return a !== b }))
					.attr('class', 'state-boundary')
					.attr('stroke', "#fff")
					.attr('d', path);

				svg.selectAll('circle')
					.data(data)
					.enter()
					.append('circle')
					.attr('cx', function (d) { return projection([+d.lonf, +d.latf])[0]; })
					.attr('cy', function (d) { return projection([+d.lonf, +d.latf])[1]; })
					.attr('city', function(d) { return d.city; })
					.attr('r', 4)
					.attr('stroke', 'red')
					.attr('stroke-width', 1);
			};
		}
	}
}]);
