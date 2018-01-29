angular.module('app').factory('classFactory', function () {
	var data = {};
	data = {
		entity: function (pos,stats,parts,modules,shooter,movement) {
			this.pos = pos;
			this.stats = stats;
			this.parts = parts;
			this.modules = modules;
			this.shooter = shooter;
			this.movement = movement;
			this.shoot = function () {
				return shooter.shoot(this.stats.mas);
			};
			this.move = function () {
				this.pos = movement.nextPos(this.pos);
			};
			this.draw = function (context) {
				for (var i = 0; i < this.parts.length; i++) {
					this.parts[i].draw(context, this.pos[0], this.pos[1]);
				}
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