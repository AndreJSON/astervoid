angular.module('app').factory('gameFactory', function (classFactory) {
	part = classFactory.part;
	entity = classFactory.entity;
	movement = classFactory.movement;
	var data = {};
	data = {
		parts: {
			gun1: [[0,0], [0,-3], [-10,-3], [-10,-15], [45,-15], [45,-3], [25,-3], [25,0], [0,0]],
			nozzle1: [[0,0], [-10,4], [-10,-20], [0,-16], [0,0]],
			body1: [[0,0], [100,0], [100,60], [0,60], [0,0]],
			body2: [[0,0], [-100,30], [-100,-30], [0,0]],
			star1: [[0,0],[1,2],[3,3],[1,4],[0,6],[-1,4],[-3,3],[-1,2],[0,0]],
			throttle1: [[0,0], [0,20], [-0.9,20], [-0.9,0], [0,0]]
		},
		entityBuilder: {
			player: function () {
				return new entity(
					[90,420],
					{
						bhp: 10,
						mhp: 10,
						chp: 10
					},
					[
						new part([-60,-28],data.parts.throttle1,data.colors.fire1),
						new part([-60,8],data.parts.throttle1,data.colors.fire1),
						new part([-50,-10],data.parts.nozzle1,data.colors.ship3),
						new part([-50, 26],data.parts.nozzle1,data.colors.ship3),
						new part([0,-30],data.parts.gun1,data.colors.ship2),
						new part([0,30],data.utils.mirrorX(data.parts.gun1),data.colors.ship2),
						new part([-50,-30],data.parts.body1,data.colors.ship1)
					],
					undefined,
					new movement()
				);
			},
			enemy1: function () {
				return new entity(
					[1400,420],
					{
						bhp: 3,
						mhp: 3,
						chp: 3
					},
					[
						new part([15,-12],data.utils.mirrorY(data.parts.gun1),data.colors.ship2),
						new part([15,12],data.utils.mirrorX(data.utils.mirrorY(data.parts.gun1)),data.colors.ship2),
						new part([-50,0],data.utils.mirrorY(data.parts.body2),data.colors.ship3)
					],
					undefined,
					new movement()
				);
			}
		},
		colors: {
			background: "rgba(30,30,30,1)",
			ship1: "rgba(140,150,160,1)",
			ship2: "rgba(140,130,130,1)",
			ship3: "rgba(100,90,90,1)",
			star1: "rgba(255,255,255,0.85)",
			fire1: "rgba(255,120,0,1)"
		},
		utils: {
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
			}
		}
	}
	return data;
});