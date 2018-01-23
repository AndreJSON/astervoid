angular.module('app').factory('gameFactory', function () {
	var data = {
		parts: {
			gun1: [[0,0], [0,-3], [-10,-3], [-10,-15], [45,-15], [45,-3], [25,-3], [25,0], [0,0]],
			nozzle1: [[0,0], [-10,4], [-10,-20], [0,-16], [0,0]],
			body1: [[0,0], [100,0], [100,60], [0,60], [0,0]],
			star1: [[0,0],[1,2],[3,3],[1,4],[0,6],[-1,4],[-3,3],[-1,2],[0,0]]
		},
		colors: {
			background: "rgba(30,30,30,1)",
			ship1: "rgba(140,150,160,1)",
			ship2: "rgba(140,130,130,1)",
			ship3: "rgba(100,90,90,1)",
			star1: "rgba(255,255,255,0.8)"
		},
		utils: {
			mirrorX: function (points) {
				res = [];
				for (var i = 0; i < points.length; i++) {
					res.push([points[i][0],-1*points[i][1]]);
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