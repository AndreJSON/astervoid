angular.module('app').factory('constFactory', function () {
	var data = {};
	data = {
		tps: 60,
		parts: {
			gun1: [[0,0], [0,-3], [-10,-3], [-10,-15], [45,-15], [45,-3], [25,-3], [25,0], [0,0]],
			nozzle1: [[0,0], [-10,4], [-10,-20], [0,-16], [0,0]],
			body1: [[0,0], [100,0], [100,60], [0,60], [0,0]],
			body2: [[0,0], [-100,30], [-100,-30], [0,0]],
			star1: [[0,0],[1,2],[3,3],[1,4],[0,6],[-1,4],[-3,3],[-1,2],[0,0]],
			throttle1: [[0,0], [0,20], [-0.9,20], [-0.9,0], [0,0]],
			bullet1: [[0,0], [12,0], [12,12], [0,12], [0,0]],
			bullet2: [[0,0], [16,6], [0,12], [0,0]]
		},
		colors: {
			background: "rgba(30,30,30,1)",
			ship1: "rgba(140,150,160,1)",
			ship2: "rgba(140,130,130,1)",
			ship3: "rgba(100,90,90,1)",
			fire1: "rgba(255,120,0,1)",
			bullet1: "rgba(120,130,170,1)",
			bullet2: "rgba(120,130,255,1)",
			bullet3: "rgba(170,130,120,1)",
			bullet4: "rgba(255,130,120,1)",
			star1: "rgba(255,255,255,0.81)",
			star2: "rgba(255,255,255,0.93)",
			bar1:  "rgba(60,60,60,1)"
		},
		stats: {
			player: {
				bhp: 10,	//Base hitpoints.
				bad: 1,		//Base attack damage.
				brs: 0,		//Base resistance.
				brp: 1,		//Base reparation.
				bas: 1,		//Base attack speed.
				bac: 0.95,	//Base accuracy.
				bcc: 0.01,	//Base crit chance.
				bcd: 2		//Base crit damage multiplier.
			},
			enemy1: {
				bhp: 5,
				bad: 1,
				brs: 0,
				brp: 0,
				bas: 0.25,
				bac: 0.95,
				bcc: 0.00,
				bcd: 2
			}
		}
	};
	return data;
});