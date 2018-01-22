angular.module('app').factory('gameFactory', function () {
	var data = {
		parts: {
			gun1: [[0,0], [0,-3], [-10,-3], [-10,-15], [45,-15], [45,-3], [25,-3], [25,0], [0,0]],
			nozzle1: [[0,0], [-10,4], [-10,-20], [0,-16], [0,0]],
			body1: [[0,0], [100,0], [100,60], [0,60], [0,0]]
		},
		utils: {
			mirrorX: function (points) {
				res = [];
				for (var i = 0; i < points.length; i++) {
					res.push([points[i][0],-1*points[i][1]]);
				}
				return res;
			}
		}
	}
	return data;
});