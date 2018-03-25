/*global angular, requestAnimationFrame*/

angular.module('app').controller('gameController', function ($scope, $log, $timeout, $window, classFactory, constFactory, utilityFactory) {
	'use strict';
	var game = {};

	/**
	 * Loops over all functions needed to progress the game.
	 */
	game.tickLoop = function (count) {
		if (Date.now() > game.global.nextTick) {
			game.global.nextTick += (1000 / game.global.atps);
			game.tick(count);
			count++;
		}
		$timeout(function(){game.tickLoop(count);}, 10);
	};

	game.drawLoop = function (count) {
		game.global.nextFrame = Date.now() + (1000 / game.global.fps);
		game.draw($scope.ctx);
		requestAnimationFrame(function(){game.drawLoop(count+1);});
	};

	game.tick = function (count) {
		if(count % game.global.tps === 0) {
			game.utils.updateStats(game.global.entities[0]);
			game.utils.updateStats(game.global.entities[1]);
		}
		game.move();
		game.checkCollisions();
		game.remove();
		for (var i = 0; i < game.global.entities.length; i++) {
			var bullets = game.global.entities[i].shoot();
			if (bullets !== undefined) {
				game.global.entities = game.global.entities.concat(bullets);
			}
		}
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

	game.checkCollisions = function () {
		for (var i = 2; i < game.global.entities.length; i++) {
			if (game.global.entities[0].checkCollision(game.global.entities[i])) {
				game.utils.applyCollisionEffects(game.global.entities[0],game.global.entities[i]);
				game.global.entities.splice(i,1);
			}
			if (game.global.entities[1].checkCollision(game.global.entities[i])) {
				game.utils.applyCollisionEffects(game.global.entities[1],game.global.entities[i]);
				game.global.entities.splice(i,1);
			}
		}
	};

	game.remove = function () {
		var entity;
		for (var i = game.global.stars.length-1; i >= 0; i--) {
			entity = game.global.stars[i];
			if (entity.pos[0] > 1500 + 20 ||
				entity.pos[0] < -20 ||
				entity.pos[1] > 890 + 20 ||
				entity.pos[1] < -20
			) {
				game.global.stars.splice(i,1);
			}
		}
		for (var i = game.global.entities.length-1; i >= 0; i--) {
			entity = game.global.entities[i];
			if (entity.pos[0] > 1500 + 101 ||
				entity.pos[0] < -101 ||
				entity.pos[1] > 890 + 101 ||
				entity.pos[1] < -101
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
		context.strokeRect(22,31,120,24);
		context.strokeRect(1358,31,120,24);
		context.fillStyle = "rgba(140,0,0,1)";
		context.fillRect(23,32,118*(Math.max(0,game.global.entities[0].stats.chp/game.global.entities[0].stats.mhp)),22);
		context.fillRect(1359,32,118*(Math.max(0,game.global.entities[1].stats.chp/game.global.entities[1].stats.mhp)),22);
		context.fillStyle = game.global.colors.star1;
		context.font = "bold 18px Arial";
		context.textAlign = "center";
		context.fillText(game.global.entities[0].stats.chp+"/"+game.global.entities[0].stats.mhp,83,21);
		context.fillText(game.global.entities[1].stats.chp+"/"+game.global.entities[1].stats.mhp,1419,21);
		context.fillText("+" + game.global.entities[0].stats.mrp + " hp/sec",83,77);
		context.fillText("+" + game.global.entities[1].stats.mrp + " hp/sec",1419,77);
		context.textAlign = "left";
		context.fillText("damage:",160,21);
		context.fillText("damage:",870,21);
		context.fillText("accuracy:",160,49);
		context.fillText("accuracy:",870,49);
		context.fillText("resistance:",160,77);
		context.fillText("resistance:",870,77);
		context.fillText("att. speed:",430,21);
		context.fillText("att. speed:",1140,21);
		context.fillText("crit chance:",430,49);
		context.fillText("crit chance:",1140,49);
		context.fillText("crit damage:",430,77);
		context.fillText("crit damage:",1140,77);
		context.fillStyle = game.global.colors.star2;
		context.fillText(game.global.entities[0].stats.mad,262,21);
		context.fillText(game.global.entities[1].stats.mad,972,21);
		context.fillText((game.global.entities[0].stats.mac * 100) + "%",262,49);
		context.fillText((game.global.entities[1].stats.mac * 100) + "%",972,49);
		context.fillText(game.global.entities[0].stats.mrs + "%",262,77);
		context.fillText(game.global.entities[1].stats.mrs + "%",972,77);
		context.fillText(game.global.entities[0].stats.mas,543,21);
		context.fillText(game.global.entities[1].stats.mas,1253,21);
		context.fillText((game.global.entities[0].stats.mcc * 100) + "%",543,49);
		context.fillText((game.global.entities[1].stats.mcc * 100) + "%",1253,49);
		context.fillText((game.global.entities[0].stats.mcd * 100) + "%",543,77);
		context.fillText((game.global.entities[1].stats.mcd * 100) + "%",1253,77);
	};
	
	//Keeps track of global game stuff.
	game.global = {
		tps: constFactory.tps,
		atps: constFactory.atps,
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
		game.global.entities.push(game.utils.createPlayer([90,440]));
		game.global.entities.push(game.utils.createEnemy([1400,440]));
		game.drawLoop(0);
		game.tickLoop(0);
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