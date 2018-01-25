Racing.Home = CLASS({
	
	preset : () => {
		return VIEW;
	},
	
	init : (inner) => {
		
		let idle1Sound = SOUND({
			wav : Racing.R('idle.wav'),
			isLoop : true,
			volume : 1
		});
		
		idle1Sound.play();
		
		let gear1Sound = SOUND({
			wav : Racing.R('gear1.wav'),
			isLoop : true,
			volume : 0
		});
		
		gear1Sound.play();
		
		let gear2Sound = SOUND({
			wav : Racing.R('gear2.wav'),
			isLoop : true,
			volume : 0
		});
		
		gear2Sound.play();
		
		let speed = 0;
		let maxSpeed = 200;
		
		let speedPanel;
		let rootNode = SkyEngine.Node({
			c : [SkyEngine.Node({
				y : -100,
				dom : speedPanel = DIV({
					style : {
						fontSize : 30
					},
					c : '속도'
				})
			}), SkyEngine.Image({
				src : Racing.R('car.png')
			})]
		}).appendTo(SkyEngine.Screen);
		
		let speedUpInterval;
		let speedDownInterval;
		
		let setSpeed = (_speed) => {
			speed = _speed;
			
			speedPanel.empty();
			speedPanel.append(speed);
			
			let x = (20 - speed) / 20;
			if (x < 0) {
				x = 0;
			} else if (x > 1) {
				x = 1;
			}
			
			idle1Sound.setVolume(Math.cos((1 - x) * 0.5 * Math.PI));
			gear1Sound.setVolume(Math.cos(x * 0.5 * Math.PI));
			
			let x2 = (100 - (speed - 50)) / 100;
			if (x2 < 0) {
				x2 = 0;
			} else if (x2 > 1) {
				x2 = 1;
			}
			
			gear1Sound.setPlaybackRate((speed + 20) / 120);
			gear2Sound.setPlaybackRate(speed / 160);
			
			gear1Sound.setVolume(x2 === 1 ? Math.cos(x * 0.5 * Math.PI) : Math.cos((1 - x2) * 0.5 * Math.PI));
			gear2Sound.setVolume(Math.cos(x2 * 0.5 * Math.PI));
		};
		
		// 키를 눌렀다.
		let keydownEvent = EVENT('keydown', (e) => {
			
			if (e.getKey() === ' ') {
				if (speedUpInterval !== undefined) {
					speedUpInterval.remove();
				}
				if (speedDownInterval !== undefined) {
					speedDownInterval.remove();
				}
				
				speedUpInterval = SkyEngine.Interval(0.02, () => {
					setSpeed(speed + 1);
					
					if (speed >= maxSpeed) {
						speed = maxSpeed;
						speedUpInterval.remove();
						speedUpInterval = undefined;
					}
				});
			}
		});
		
		// 키를 뗐다.
		let keyupEvent = EVENT('keyup', (e) => {
			
			if (e.getKey() === ' ') {
				if (speedUpInterval !== undefined) {
					speedUpInterval.remove();
				}
				if (speedDownInterval !== undefined) {
					speedDownInterval.remove();
				}
				speedDownInterval = SkyEngine.Interval(0.05, () => {
					setSpeed(speed - 1);
					
					if (speed <= 0) {
						speed = 0;
						speedDownInterval.remove();
						speedDownInterval = undefined;
					}
				});
			}
		});
		
		inner.on('close', () => {
			idle1Sound.stop();
			idle1Sound = undefined;
			
			gear1Sound.stop();
			gear1Sound = undefined;
			
			gear2Sound.stop();
			gear2Sound = undefined;
			
			rootNode.remove();
			
			keydownEvent.remove();
			keyupEvent.remove();
		});
	}
});
