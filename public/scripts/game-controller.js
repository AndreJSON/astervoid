/*global angular, requestAnimationFrame*/

angular.module('app').controller('gameController', function ($scope, $log, $timeout, $window) {
	'use strict';
	var game = {};

	/**
	 * Loops over all functions needed to progress the game.
	 */
	game.loop = function () {
		if (Date.now() > game.global.nextFrame) {
			game.global.nextFrame += (1000 / game.global.fps);
			game.draw();
			$log.info("Drew background");
		}
		requestAnimationFrame(game.loop);
	};
	
	/**
	 * Redraws the screen and all its entities.
	 */
	game.draw = function () {
		game.drawBackground();
		for (var i = 0; i < game.global.entities.length; i++) {
			game.global.entities[i].draw();
		}
	};

	game.drawShip = function (context,x,y,colors) {
		var p = [[-50,-30], [50,-30], [50,30], [-50,30], [-50,26], [-60,30], [-60,5], [-50,9], [-50,-9], [-60,-5], [-60,-30], [-50,-26], [-50,-30]];
		context.beginPath();
		context.moveTo(x+0,y+0);
		for (var i = 0; i < p.length; i++) {
			context.lineTo(x+p[i][0],y+p[i][1]);
		}
		context.closePath();
		context.fillStyle = colors.ship1;
		context.fill();

		p = [[0,-30], [0,-33], [-10,-33], [-10,-45], [45,-45], [45,-33], [25,-33], [25,-30], [0,-30]];
		context.beginPath();
		context.moveTo(x+0,y+0);
		for (var i = 0; i < p.length; i++) {
			context.lineTo(x+p[i][0],y+p[i][1]);
		}
		context.closePath();
		context.fillStyle = colors.ship2;
		context.fill();

		p = [[0,30], [0,33], [-10,33], [-10,45], [45,45], [45,33], [25,33], [25,30], [0,30]];
		context.beginPath();
		context.moveTo(x+0,y+0);
		for (var i = 0; i < p.length; i++) {
			context.lineTo(x+p[i][0],y+p[i][1]);
		}
		context.closePath();
		context.fillStyle = colors.ship2;
		context.fill();
	}
	
	/**
	 * Subroutine to draw. Draws the background.
	 */
	game.drawBackground = function () {
		$scope.ctx.beginPath();
		$scope.ctx.rect(0, 0, game.global.windowWidth, game.global.windowHeight);
		$scope.ctx.fillStyle = game.global.colors.background;
		$scope.ctx.fill();
	};

	game.entity = function () {
		this.pos = [0,0];
		this.vel = [0,0];
		this.draw = function () {
			game.drawShip($scope.ctx,90,410,game.global.colors);
		};
	};
	
	//Keeps track of global game stuff.
	game.global = {
		fps: 30,
		nextFrame: undefined,
		colors: {
			background: "rgba(30,30,30,1)",
			ship1: "rgba(140,150,160,1)",
			ship2: "rgba(140,130,130,1)"
		},
		entities: []
	};
	
	/**
	 * Should be called to initialize the game.
	 */
	game.init = function () {
		game.loop();
		game.global.nextFrame = Date.now();
		game.global.entities.push(new game.entity());
	};
	
	/**
	 * Automatically called when page has loaded.
	 */
	$timeout(function () {
		game.global.windowWidth = $window.innerWidth;
		game.global.windowHeight = $window.innerHeight;
		game.init();
	});
});