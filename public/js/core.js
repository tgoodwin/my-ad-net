var app = angular.module('myAdNet', [
	'radarController',
	'radarService'
	]);

app.directive('superMap', ['topo', function(topo) {
	return {
		restrict: 'E',
		replace: false,
		scope: {
			id: '@',
			coords: '=',
			stats: '=',
			hovered: '&'
		},

		link: function(scope, element, attr) {
			var map_width, map_height;
			var projection = d3.geo.albersUsa();
			var path = d3.geo.path();

			var project = function(d) {
				//coords stored as lat,long
				var coords = d.coordinate.split(',');
				return projection([+coords[1], +coords[0]]);
			};

			var size = function() {
				var rect = d3.select('.map-container').node().getBoundingClientRect();
				if (rect.width > 1150) {
					var aspect_ratio = rect.height / rect.width;
					map_width = 1150;
					map_height = 1150 * aspect_ratio;
				} else {
					map_width = rect.width;
					map_height = rect.height;
				}
			}
			size();

			var voronoi = d3.geom.voronoi()
				.x(function(d) { return project(d) ? project(d)[0] : null; })
				.y(function(d) { return project(d) ? project(d)[1] : null; })
				.clipExtent([[0,0], [map_width, map_height]]);

			var updateProjection = function() {
				projection.scale(map_width)
					.translate([map_width / 2, map_height / 2]);
				path.projection(projection);
			};
			updateProjection();
			
			var svg = d3.select('.map-container')
				.append('svg');

			// re-render d3 canvas on resize
			window.onresize = function() {
				size();
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
				svg
					.attr('width', map_width)
					.attr('height', map_height);

				svg.selectAll('*').remove();
				svg.insert('path', '.graticule')
					.datum(topojson.feature(topo, topo.objects.land))
					.attr('d', path);

				svg.insert('path', '.graticule')
					.datum(topojson.mesh(topo, topo.objects.states, function(a, b) { return a !== b }))
					.attr('class', 'state-boundary')
					.attr('stroke', "#fefefe")
					.attr('d', path);

				var servers = svg.selectAll('circle')
					.data(data)
					.enter()
					.append('circle')
					.classed('ad-point', true)
					.attr('unique-ip', function(d) { return d.ip; })
					.attr('cx', function (d) { return project(d) ? project(d)[0] : 0; })
					.attr('cy', function (d) { return project(d) ? project(d)[1] : 0; })
					.attr('r', function(d) { return project(d) ? 3 : 0});

				// build voronoi tesselation
				voronoi(data).forEach(function(cell) {
					var path = d3.svg.line()
						.x(function(d) { return d[0]; })
						.y(function(d) { return d[1]; });

					var selection = svg.selectAll('.ad-point').filter(function() {
						return d3.select(this).attr('unique-ip') == cell.point.ip.toString();
					});
					svg.append('path')
						.attr('d', path(cell))
						.style('fill', 'none')
						.style('pointer-events', 'all')
						.datum(selection);
				});

				// set voronoi mouseovers
				d3.selectAll('path').on('mouseover', function(d) {
					d3.select(d.node()).classed('hover', true);
					scope.hovered({ args:d.data()[0] });
				}).on('mouseout', function(d) {
					d3.select(d.node()).classed('hover', false);
					scope.hovered({ args: false });
				});
			};
		}
	}
}]);

app.directive('serverInfo', function() {
	return {
		restrict: 'E',
		template: '<div>' +
			'</br >city: {{ selection.city }}' +
			'</br >location: {{ selection.coordinate }}' +
			'</br >most recent domain: <span class="hot">{{ selection.domain }}</span>' + 
			'</br >most recent ip: <span class="hot">{{ selection.ip }}</span>' +
			'</br >total servers identified at location: <span class="hot">{{stats.adsPerLocation[selection.coordinate]}}</span>' +
			'</div>'
	}
});

app.directive('infoPane', function() {
	return {
		restrict: 'E',
		template: '<div>' +
			'ads logged to date: <span class="hot">{{stats.totalAds}}</span> |' + 
			' ad servers located: <span class="hot">{{stats.totalServers}}</span> |' +
			' locations mapped: <span class="hot">{{stats.totalLocations}}</span>' +
			'</div>'
		}
});
