/*global angular, requestAnimationFrame*/

angular.module('app').controller('gameController', function ($scope, $log, $timeout, $window, gameFactory, classFactory) {
	'use strict';
	var game = {};

	/**
	 * Loops over all functions needed to progress the game.
	 */
	game.tickLoop = function () {
		if (Date.now() > game.global.nextTick) {
			game.global.nextTick += (1000 / game.global.tps);
			game.tick();
			//$log.info("Ticked the game.");
		}
		$timeout(game.tickLoop, 10);
	};

	game.drawLoop = function () {
		game.global.nextFrame = Date.now() + (1000 / game.global.fps);
		game.draw($scope.ctx);
		//$log.info("Drew background.");
		requestAnimationFrame(game.drawLoop);
	};

	game.tick = function () {
		game.move();
		game.remove();
		if (Math.random() < game.global.starDensity) {
			game.global.stars.push(game.createStar());
		}
	};

	game.move = function () {
		for (var i = 0; i < game.global.stars.length; i++) {
			game.global.stars[i].move();
		}
		for (var i = 0; i < game.global.entities.length; i++) {
			game.global.entities[i].move();
		}
	};

	game.remove = function () {
		var entity;
		for (var i = game.global.stars.length-1; i >= 0; i--) {
			entity = game.global.stars[i];
			if (entity.pos[0] > 1500 + 100 ||
				entity.pos[0] < -100 ||
				entity.pos[1] > game.global.windowHeight + 100 ||
				entity.pos[1] < -100
			) {
				game.global.stars.splice(i,1);
			}
		}
		for (var i = game.global.entities.length-1; i >= 0; i--) {
			entity = game.global.entities[i];
			if (entity.pos[0] > 1500 + 100 ||
				entity.pos[0] < -100 ||
				entity.pos[1] > game.global.windowHeight + 100 ||
				entity.pos[1] < -100
			) {
				game.global.entities.splice(i,1);
			}
		}
	};
	
	/**
	 * Redraws the screen and all its entities.
	 */
	game.draw = function (context) {
		context.beginPath();
		context.rect(0, 0, 1500, game.global.windowHeight);
		context.fillStyle = game.global.colors.background;
		context.fill();
		for (var i = 0; i < game.global.stars.length; i++) {
			game.global.stars[i].draw(context);
		}
		for (var i = 0; i < game.global.entities.length; i++) {
			game.global.entities[i].draw(context);
		}
		game.drawBar(context);
	};

	game.drawBar = function (context) {
		var p = [[0,0],[650,0],[695,45],[650,90],[0,90],[0,0]];
		game.utils.drawPolygon(p,[0,0],game.global.colors.bar1,context);
		game.utils.drawPolygon(game.utils.mirrorY(p),[1500,0],game.global.colors.bar1,context);
		context.beginPath();
		context.font = "bold 30px Arial";
		context.fillStyle = game.global.colors.star1;
		context.fillText("1",741,27);
		context.fillText("Solar",712,56);
		context.fillText("System",697,84);
		context.strokeStyle = game.global.colors.star1;
		context.strokeRect(22,47,120,24);
		context.fillStyle = "rgba(140,0,0,1)";
		context.fillRect(23,48,118*(game.global.entities[0].stats.chp/game.global.entities[0].stats.mhp),22);
		context.fillStyle = game.global.colors.star1;
		context.font = "bold 18px Arial";
		context.fillText("10/10",60,38);
		context.fillText("damage",160,20);
		context.fillText("att. speed",160,48);
		context.fillText("resistance",160,76);
		context.fillText("crit chance",400,20);
		context.fillText("crit damage",400,48);
		context.fillText("regeneration",400,76);
	};

	game.createStar = function () {
		var size = (2.5 * Math.random());
		var initPos = [1500+10,Math.random()*game.global.windowHeight];
		var body = new game.part([0,-20],game.utils.scale(game.global.parts.star1,size,size),game.global.colors.star1);
		var movement = {nextPos: function (pos) {
			return [pos[0]-(0.3*size),pos[1]];
		}};
		return new game.entity(initPos, undefined, [body], undefined, movement);
	};
	
	//Keeps track of global game stuff.
	game.global = {
		tps: 50,
		nextTick: undefined,
		colors: gameFactory.colors,
		parts: gameFactory.parts,
		entityBuilder: gameFactory.entityBuilder,
		entities: [],
		stars: [],
		starDensity: 0.04
	};
	
	/**
	 * Should be called to initialize the game.
	 */
	game.init = function () {
		game.entity = classFactory.entity;
		game.part = classFactory.part;
		game.movement = classFactory.movement;
		game.utils = gameFactory.utils;
		game.global.nextTick = Date.now();
		game.global.entities.push(game.global.entityBuilder.player());
		game.global.entities.push(game.global.entityBuilder.enemy1());
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