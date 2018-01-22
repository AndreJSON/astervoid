/*global angular */

angular.module('app', ['ngMaterial', 'ngMdIcons'])
	.config(function ($mdThemingProvider) {
		'use strict';
		$mdThemingProvider.theme('default')
			.primaryPalette('teal', {
				'default': '500',
				'hue-1': '100',
				'hue-2': '600',
				'hue-3': 'A100'
			})
			.accentPalette('purple', {
				'default': '400'
			});
	});