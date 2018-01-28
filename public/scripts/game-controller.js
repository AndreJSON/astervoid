/*global angular, requestAnimationFrame*/

angular.module('app').controller('gameController', function ($scope, $log, $timeout, $window, classFactory, constFactory, utilityFactory) {
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
		game.utils.updateStats(game.global.entities[0].stats);
		game.move();
		game.remove();
		if (Math.random() < game.global.starDensity) {
			game.global.stars.push(game.utils.createStar());
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
				entity.pos[1] > 890 + 100 ||
				entity.pos[1] < -100
			) {
				game.global.stars.splice(i,1);
			}
		}
		for (var i = game.global.entities.length-1; i >= 0; i--) {
			entity = game.global.entities[i];
			if (entity.pos[0] > 1500 + 100 ||
				entity.pos[0] < -100 ||
				entity.pos[1] > 890 + 100 ||
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
		context.rect(0, 0, 1500, 890);
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
		context.strokeRect(1358,47,120,24);
		context.fillStyle = "rgba(140,0,0,1)";
		context.fillRect(23,48,118*(game.global.entities[0].stats.chp/game.global.entities[0].stats.mhp),22);
		context.fillRect(1359,48,118*(game.global.entities[1].stats.chp/game.global.entities[1].stats.mhp),22);
		context.fillStyle = game.global.colors.star1;
		context.font = "bold 18px Arial";
		context.textAlign = "center";
		context.fillText(game.global.entities[0].stats.chp+"/"+game.global.entities[0].stats.mhp,83,38);
		context.fillText(game.global.entities[1].stats.chp+"/"+game.global.entities[1].stats.mhp,1419,38);
		context.textAlign = "left";
		context.fillText("damage:",160,20);
		context.fillText("damage:",870,20);
		context.fillText("resistance:",160,48);
		context.fillText("resistance:",870,48);
		context.fillText("reparation:",160,76);
		context.fillText("reparation:",870,76);
		context.fillText("att. speed:",430,20);
		context.fillText("att. speed:",1140,20);
		context.fillText("crit chance:",430,48);
		context.fillText("crit chance:",1140,48);
		context.fillText("crit damage:",430,76);
		context.fillText("crit damage:",1140,76);
		context.fillStyle = game.global.colors.star2;
		context.fillText(game.global.entities[0].stats.md,262,20);
		context.fillText(game.global.entities[1].stats.md,972,20);
		context.fillText(game.global.entities[0].stats.mrs + "%",262,48);
		context.fillText(game.global.entities[1].stats.mrs + "%",972,48);
		context.fillText(game.global.entities[0].stats.mrp + "/sec",262,76);
		context.fillText(game.global.entities[1].stats.mrp + "/sec",972,76);
		context.fillText(game.global.entities[0].stats.ma,543,20);
		context.fillText(game.global.entities[1].stats.ma,1253,20);
		context.fillText(game.global.entities[0].stats.mcc + "%",543,48);
		context.fillText(game.global.entities[1].stats.mcc + "%",1253,48);
		context.fillText(game.global.entities[0].stats.mcd + "%",543,76);
		context.fillText(game.global.entities[1].stats.mcd + "%",1253,76);
	};
	
	//Keeps track of global game stuff.
	game.global = {
		tps: 50,
		nextTick: undefined,
		starDensity: 0.04,
		colors: constFactory.colors,
		entities: [],
		stars: []
	};
	
	/**
	 * Should be called to initialize the game.
	 */
	game.init = function () {
		game.entity = classFactory.entity;
		game.part = classFactory.part;
		game.movement = classFactory.movement;
		game.utils = utilityFactory;
		game.global.nextTick = Date.now();
		game.global.entities.push(game.utils.entityBuilder.player([90,440]));
		game.global.entities.push(game.utils.entityBuilder.enemy([1400,440]));
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