var app = angular.module('scotchTodo', [
	'todoController',
	'radarService'
	]);

app.directive('superMap', ['topo', function(topo) {
	return {
		restrict: 'E',
		replace: false,
		scope: {
			id: '@',
			coords: '=todos',
			hovered: '&hovered'
		},

		link: function(scope, element, attr) {
			var inner_width = angular.element(window)[0].innerWidth;
			var map_width = inner_width * 0.8;
			var inner_height = angular.element(window)[0].innerHeight;
			var map_height = inner_height - 20; // calibrated for default padding

			var projection = d3.geo.albersUsa();
			var path = d3.geo.path();

			var updateProjection = function() {
				projection.scale(map_width * 1.25)
					.translate([map_width / 2, map_height / 2]);
				path.projection(projection);
			};
			updateProjection();
			
			var svg = d3.select('.map-container')
				.append('svg');

			// re-render d3 canvas on resize
			window.onresize = function() {
				map_width = angular.element(window)[0].innerWidth * 0.8;
				map_height = angular.element(window)[0].innerHeight - 20;
				updateProjection();
				if (scope.coords)
					scope.render(scope.coords);
				return scope.$apply;
			};

			scope.$watch(function() {
			}, function() {
				if (scope.coords)
					return scope.render(scope.coords);
			});

			scope.$watch('coords', function(newVal, oldVal) {
				if (!!newVal)
					return scope.render(newVal);
			}, true);

			scope.render = function(data) {
				// var voronoi = d3.voronoi();
				svg
					.attr('width', map_width)
					.attr('height', map_height);

				svg.selectAll('*').remove();
				svg.insert('path', '.graticule')
					.datum(topojson.feature(topo, topo.objects.land))
					.attr('d', path);

				// state borders
				svg.insert('path', '.graticule')
					.datum(topojson.mesh(topo, topo.objects.states, function(a, b) { return a !== b }))
					.attr('class', 'state-boundary')
					.attr('stroke', "#fefefe")
					.attr('d', path);

				var project = function(d) {
					return projection([+d.lonf, +d.latf]);
				};

				svg.selectAll('circle')
					.data(data)
					.enter()
					.append('circle')
					.classed('ad-point', true)
					.attr('cx', function (d) { return project(d) ? project(d)[0] : 0; })
					.attr('cy', function (d) { return project(d) ? project(d)[1] : 0; })
					.attr('city', function(d) { return d.city; })
					.attr('r', function(d) { return project(d) ? 4 : 0});

				d3.selectAll('.ad-point').on('mouseover', function(d) {
					scope.hovered({ args:d });
				}).on('mouseout', function(d) {
					scope.hovered({ args: false });
				});
			};
		}
	}
}]);

app.directive('serverInfo', function() {
	return {
		restrict: 'E',
		template: '<div class="container">' +
			'domain: {{ selection.domain }}' + 
			'</br >ip: {{ selection.ip }}' +
			'</br >city: {{ selection.city }}' +
			'</br >region: {{ selection.country }}' +
			'</br >location: {{ selection.latf}} , {{ selection.lonf }}' +
			'</div>'
	}
});
