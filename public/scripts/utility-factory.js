angular.module('app').factory('utilityFactory', function (classFactory, constFactory) {
	var classes = classFactory;
	var consts = constFactory;
	var data = {};
	data = {
		mirrorX: function (points) {
			res = [];
			for (var i = 0; i < points.length; i++) {
				res.push([points[i][0],-1*points[i][1]]);
			}
			return res;
		},
		mirrorY: function (points) {
			res = [];
			for (var i = 0; i < points.length; i++) {
				res.push([-1*points[i][0],points[i][1]]);
			}
			return res;
		},
		scale: function (points,changeX, changeY) {
			res = [];
			for (var i = 0; i < points.length; i++) {
				res.push([changeX*points[i][0],changeY*points[i][1]]);
			}
			return res;
		},
		drawPolygon: function (points,offset,color,context) {
			context.beginPath();
			context.moveTo(points[0][0]+offset[0],points[0][1]+offset[1]);
			for (var i = 1; i < points.length; i++) {
				context.lineTo(points[i][0]+offset[0],points[i][1]+offset[1]);
			}
			context.closePath();
			context.fillStyle = color;
			context.fill();
		},
		createStar: function () {
			var size = (2.5 * Math.random());
			var initPos = [1500+10,Math.random()*890];
			var body = new classes.part([0,-20],data.scale(consts.parts.star1,size,size),Math.random() > 0.5? consts.colors.star1 : consts.colors.star2);
			var movement = {nextPos: function (pos) {
				return [pos[0]-(0.3*size),pos[1]];
			}};
			return new classes.entity(consts.neutral, initPos, undefined, [body], undefined, new classes.shooter(), movement);
		},
		createPlayer: function (pos) {
			return new classes.entity(
				consts.square,
				pos,
				Object.assign({},consts.stats.player),
				[
					new classes.part([-60,-28],consts.parts.throttle1,consts.colors.fire1),
					new classes.part([-60,8],consts.parts.throttle1,consts.colors.fire1),
					new classes.part([-50,-10],consts.parts.nozzle1,consts.colors.ship3),
					new classes.part([-50, 26],consts.parts.nozzle1,consts.colors.ship3),
					new classes.part([0,-30],consts.parts.gun1,consts.colors.ship2),
					new classes.part([0,30],data.mirrorX(consts.parts.gun1),consts.colors.ship2),
					new classes.part([-50,-30],consts.parts.body1,consts.colors.ship1)
				],
				[],
				{
					muzzles: [[138,396],[138,474]],
					prevMuzzle: 0,
					accumulator: 0,
					shoot: function (as, ac, ad, cc, cd) {
						this.accumulator += as/consts.tps;
						if (this.accumulator > 1) {
							this.accumulator -= 1;
							this.prevMuzzle = (this.prevMuzzle+1)%this.muzzles.length;
							return data.createBullet(consts.square,this.muzzles[this.prevMuzzle], [1440,440], ac, ad, cc, cd);
						}
						return undefined;
					}
				},
				new classes.movement()
			);
		},
		createEnemy: function (pos) {
			return new classes.entity(
				consts.triangle,
				[1500+100,pos[1]],
				(function () {
					var stats = Object.assign({},consts.stats.enemy1);
					stats.mhp = stats.bhp;
					stats.chp = stats.mhp;
					stats.mad = stats.bad;
					stats.mrs = stats.brs;
					stats.mrp = stats.brp;
					stats.mas = stats.bas;
					stats.mac = stats.bac;
					stats.mcc = stats.bcc;
					stats.mcd = stats.bcd;
					return stats;
				})(),
				[
					new classes.part([15,-12],data.mirrorY(consts.parts.gun1),consts.colors.ship2),
					new classes.part([15,12],data.mirrorX(data.mirrorY(consts.parts.gun1)),consts.colors.ship2),
					new classes.part([-50,0],data.mirrorY(consts.parts.body2),consts.colors.ship3)
				],
				[],
				{
					muzzles: [[1400,414],[1400,456]],
					prevMuzzle: 0,
					accumulator: 0,
					shoot: function (as, ac, ad, cc, cd) {
						this.accumulator += as/consts.tps;
						if (this.accumulator > 1) {
							this.accumulator -= 1;
							this.prevMuzzle = (this.prevMuzzle+1)%this.muzzles.length;
							return data.createBullet(consts.triangle,this.muzzles[this.prevMuzzle], [90,440], ac, ad, cc, cd);
						}
						return undefined;
					}
				},
				{
					nextPos: function (cPos) {
						if (cPos[0] > pos[0])
							return [cPos[0]-3,cPos[1]]
						else
							return [cPos[0],cPos[1]];
					}
				}
			);
		},
		//Used by both sides.
		createBullet: function (team, startPos, targetPos, accuracy, damage, critChance, critDamage) {
			var square = team === consts.square; //If squares are shooting, this will be true.
			var crit = Math.random() < critChance;
			var bulletPart = square? consts.parts.bullet1 : data.mirrorY(consts.parts.bullet2);
			var bulletColor = square? (crit? consts.colors.bulletcrit1 : consts.colors.bullet1) : (crit? consts.colors.bulletcrit2 : consts.colors.bullet2);
			return new classes.entity(
				team,
				startPos,
				{damage: (crit? critDamage:1) * damage},
				[new classes.part([-3,-1], bulletPart, bulletColor)],
				undefined,
				new classes.shooter(),
				{
					vel: [(square? 1:-1)*Math.cos(Math.PI/3*(1-accuracy)*(Math.random()-Math.random())+Math.atan((targetPos[1]-startPos[1])/(targetPos[0]-startPos[0])))*5,(square? 1:-1) * Math.sin(Math.PI/3*(1-accuracy)*(Math.random()-Math.random())+Math.atan((targetPos[1]-startPos[1])/(targetPos[0]-startPos[0])))*5],
					nextPos: function (pos) {
						return [pos[0] + this.vel[0], pos[1] + this.vel[1]];
					}
				}
			);
		},
		updateStats: function (entity) {
			var stats = entity.stats;
			var modules = entity.modules;
			stats.mhp = stats.bhp;
			if(stats.chp === undefined)
				stats.chp = stats.mhp;
			stats.mad = stats.bad;
			stats.mrs = stats.brs;
			stats.mrp = stats.brp;
			stats.mas = stats.bas;
			stats.mac = stats.bac;
			stats.mcc = stats.bcc;
			stats.mcd = stats.bcd;
		},
		applyCollisionEffects: function (ship, bullet) {
			ship.stats.chp -= bullet.stats.damage;
		}
	};
	return data;
});