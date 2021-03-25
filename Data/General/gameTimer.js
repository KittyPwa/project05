function gameTimer(duration, timerInc) {
	
	this.totalDuration = duration;
	
	this.nowSec = 0;
	
	this.nowMin = 0;
	
	this.nowHour = 0;
	
	this.timeRemaining = duration;
	
	this.timerInc = timerInc;
}
typeMap.set('gameTimer', gameTimer)

function launchTimer(timer) {
	return setInterval(function() {
		timer.nowSec ++;
		if (timer.nowSec == 60) {
			timer.nowSec = 0;
			timer.nowMin++;
			if (timer.nowMin == 60) {
				timer.nowHour++;
				timer.nowMin = 0;
			}
		}
		drawGlobalTimer(timer);
	},1000)
}
	
function timer(timer) {
	return setInterval(function() {
		thitimers.now += timer.timerInc;
		timer.timeRemaining = timer.totalDuration - timer.now;
		if (timer.now >= timer.totalDuration) {
			clearTimeout(timer.timer);
		}
	},this.timerInc);
}