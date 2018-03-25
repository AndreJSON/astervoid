angular.module('app').factory('classFactory', function () {
	var data = {};
	data = {
		entity: function (team,pos,stats,parts,modules,shooter,movement) {
			this.team = team;
			this.pos = pos;
			this.stats = stats;
			this.parts = parts;
			this.modules = modules;
			this.shooter = shooter;
			this.movement = movement;
			this.shoot = function () {
				return shooter.shoot(this.stats.mas, this.stats.mac, this.stats.mad, this.stats.mcc, this.stats.mcd);
			};
			this.move = function () {
				this.pos = movement.nextPos(this.pos);
			};
			this.draw = function (context) {
				for (var i = 0; i < this.parts.length; i++) {
					this.parts[i].draw(context, this.pos[0], this.pos[1]);
				}
			};
			this.checkCollision = function (entity) {
				if(entity.team === this.team)
					return;
				if (Math.abs(entity.pos[0] - this.pos[0]) > 1150) //Might need to become more elaborate later.
					return;
				for (var i = 0; i < this.parts.length; i++) {
					if (this.checkCollisionPart(this.parts[i], this.pos, entity.parts[0], entity.pos)) {
						return true;
					}
				}
				return false;
			};
			/**
			 * Perform collision detection through counting the number of intersected sides
			 * of one polygon drawing a line straight out to the right from each corner of
			 * the other polygon. 
			 */
			this.checkCollisionPart = function(part,pos,ePart,ePos) {
				var points = [], ePoints = [];
				for (var i = 0; i < part.points.length; i++) {
					points.push([part.points[i][0] + part.pos[0] + pos[0], part.points[i][1] + part.pos[1] + pos[1]]);
				}
				for (var i = 0; i < ePart.points.length; i++) {
					ePoints.push([ePart.points[i][0] + ePart.pos[0] + ePos[0], ePart.points[i][1] + ePart.pos[1] + ePos[1]]);
				}
				for (var i = 0; i < ePoints.length; i++) {
					var inside = false;
					for (var j = 0; j < points.length-1; j++) {
						var e = ePoints[i], p1 = points[j], p2 = points[j+1];
						if ((e[1] > p1[1] && e[1] > p2[1]) || (e[1] < p1[1] && e[1] < p2[1])) //Line is entirely above or below entity.
							continue;
						var scale = Math.abs((e[1]-p1[1])/(p2[1]-p1[1]));
						if (scale === Infinity)
							continue;
						if ( e[0] < (p1[0] + scale * (p2[0] - p1[0])))
							inside = !inside;
					}
					if(inside)
						return true;
				}
				return false;
			};
		},
		part: function (pos,points,color) {
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
		},
		shooter: function () {
			this.shoot = function() {} // Does nothing per default.
		},
		movement: function () {
			this.nextPos = function(pos) {
				return pos;
			};
		}
	};
	return data;
});