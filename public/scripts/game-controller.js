/*global angular, requestAnimationFrame*/

angular.module('app').controller('gameController', function ($scope, $log, $timeout, $window, gameFactory) {
	'use strict';
	var game = {};

	/**
	 * Loops over all functions needed to progress the game.
	 */
	game.loop = function () {
		if (Date.now() > game.global.nextFrame) {
			game.global.nextFrame += (1000 / game.global.fps);
			game.draw();
			$log.info("Drew background.");
		}
		if (Date.now() > game.global.nextTick) {
			game.global.nextTick += (1000 / game.global.tps);
			game.tick();
			$log.info("Ticked the game.");
		}
		requestAnimationFrame(game.loop);
	};

	game.tick = function () {
		for (var i = 0; i < game.global.entities.length; i++) {
			game.global.entities[i].move();
		}
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

	game.drawPart = function (x,y,points,color) {
		var context = $scope.ctx;
		context.beginPath();
		context.moveTo(x,y);
		for (var i = 0; i < points.length; i++) {
			context.lineTo(x+points[i][0],y+points[i][1]);
		}
		context.closePath();
		context.fillStyle = color;
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

	game.entity = function (pos,parts,movement) {
		this.pos = pos;
		this.parts = parts;
		this.movement = movement;
		this.draw = function () {
			for (var i = 0; i < this.parts.length; i++) {
				this.parts[i].draw(this.pos[0], this.pos[1]);
			}
		};
		this.move = function () {
			pos = movement.nextPos(pos);
		};
	};

	game.part = function (pos,points,color) {
		this.pos = pos;
		this.points = points;
		this.color = color;
		this.draw = function (x,y) {
			game.drawPart(x+this.pos[0],y+this.pos[1],this.points,this.color);
		}
	};

	game.movement = function() {
		this.nextPos = function(pos) {
			return pos;
		};
	}
	
	//Keeps track of global game stuff.
	game.global = {
		fps: 30,
		tps: 3,
		nextFrame: undefined,
		nextTick: undefined,
		colors: gameFactory.colors,
		parts: gameFactory.parts,
		utils: gameFactory.utils,
		entities: []
	};
	
	/**
	 * Should be called to initialize the game.
	 */
	game.init = function () {
		game.loop();
		game.global.nextFrame = Date.now();
		game.global.nextTick = Date.now();
		game.global.entities.push(new game.entity([90,420],[
			new game.part([-50,-10],game.global.parts.nozzle1,game.global.colors.ship3),
			new game.part([-50, 26],game.global.parts.nozzle1,game.global.colors.ship3),
			new game.part([0,-30],game.global.parts.gun1,game.global.colors.ship2),
			new game.part([0,30],game.global.utils.mirrorX(game.global.parts.gun1),game.global.colors.ship2),
			new game.part([-50,-30],game.global.parts.body1,game.global.colors.ship1)
		],new game.movement()));
		game.global.entities.push(new game.entity([500,500],[
			new game.part([0,-20],game.global.utils.scale(game.global.parts.star1,3,3),game.global.colors.star1)
		],new game.movement()));
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