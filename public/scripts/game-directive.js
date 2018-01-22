/*global angular*/

angular.module('app').directive('gameDirective', function () {
	'use strict';
	return {
		restrict: 'E',
		template: '<canvas width="{{windowWidth}}" height="{{windowHeight}}"></canvas>',
		scope: {
			windowWidth: '=',
			windowHeight: '='
		},
		link: function (scope, element) {
			scope.ctx = element.find('canvas')[0].getContext('2d');
		},
		controller: 'gameController'
	};
});