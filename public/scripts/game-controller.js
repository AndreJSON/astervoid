/*global angular, requestAnimationFrame*/

angular.module('app').controller('gameController', function ($scope, $log, $timeout, $window, gameFactory) {
	'use strict';
	var game = {};

	/**
	 * Loops over all functions needed to progress the game.
	 */
	game.tickLoop = function () {
		if (Date.now() > game.global.nextTick) {
			game.global.nextTick += (1000 / game.global.tps);
			game.tick();
			$log.info("Ticked the game.");
		}
		$timeout(game.tickLoop, 10);
	};

	game.drawLoop = function () {
		game.global.nextFrame = Date.now() + (1000 / game.global.fps);
		game.draw($scope.ctx);
		$log.info("Drew background.");
		requestAnimationFrame(game.drawLoop);
	};

	game.tick = function () {
		for (var i = 0; i < game.global.entities.length; i++) {
			game.global.entities[i].move();
		}
	};
	
	/**
	 * Redraws the screen and all its entities.
	 */
	game.draw = function (context) {
		context.beginPath();
		context.rect(0, 0, game.global.windowWidth, game.global.windowHeight);
		context.fillStyle = game.global.colors.background;
		context.fill();
		for (var i = 0; i < game.global.entities.length; i++) {
			game.global.entities[i].draw(context);
		}
	};

	game.entity = function (pos,parts,movement) {
		this.pos = pos;
		this.parts = parts;
		this.movement = movement;
		this.draw = function (context) {
			for (var i = 0; i < this.parts.length; i++) {
				this.parts[i].draw(context, this.pos[0], this.pos[1]);
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
		this.draw = function (context,x,y) {
			x += this.pos[0];
			y += this.pos[1];
			context.beginPath();
			context.moveTo(x,y);
			for (var i = 0; i < this.points.length; i++) {
				context.lineTo(x+this.points[i][0],y+this.points[i][1]);
			}
			context.closePath();
			context.fillStyle = this.color;
			context.fill();
		};
	};

	game.movement = function() {
		this.nextPos = function(pos) {
			return pos;
		};
	};

	game.createStar = function () {
		var pos = [500,500];
		var body = new game.part([0,-20],game.global.utils.scale(game.global.parts.star1,3,3),game.global.colors.star1);
		var movement = new game.movement();
		return new game.entity(pos, [body], movement);
	};
	
	//Keeps track of global game stuff.
	game.global = {
		tps: 20,
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
		game.global.nextTick = Date.now();
		game.global.entities.push(new game.entity([90,420],[
			new game.part([-50,-10],game.global.parts.nozzle1,game.global.colors.ship3),
			new game.part([-50, 26],game.global.parts.nozzle1,game.global.colors.ship3),
			new game.part([0,-30],game.global.parts.gun1,game.global.colors.ship2),
			new game.part([0,30],game.global.utils.mirrorX(game.global.parts.gun1),game.global.colors.ship2),
			new game.part([-50,-30],game.global.parts.body1,game.global.colors.ship1)
		],new game.movement()));
		game.global.entities.push(game.createStar());
		game.drawLoop();
		game.tickLoop();
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