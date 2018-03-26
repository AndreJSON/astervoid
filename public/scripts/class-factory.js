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
				return shooter.shoot(this.stats.mas, this.stats.mac, this.stats.mad, this.stats.mcc, this.stats.mcd, this.stats.mbs);
			};
			this.move = function () {
				this.pos = movement.nextPos(this.pos);
			};
		},
		part: function (pos,points,color) {
			this.pos = pos;
			this.points = points;
			this.color = color;
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