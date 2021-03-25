function playerConsole() {

    this.console = document.getElementById('playerConsoleId');

    this.text = this.console.value

    this.updateText = function(text) {
        this.text = this.text + text + '\n';
        this.console.value = this.text
        document.getElementById('playerConsoleId').scrollTo(0,Number.MAX_SAFE_INTEGER); 
    }

    this.clearText = function() {
        this.text = ''
        this.console.value = this.text
    }
}
typeMap.set('playerConsole', playerConsole)

var playCons = new playerConsole();

function addTextToConsole(string, playConsol = playCons) {
    playConsol.updateText(string);
}

function clearText(playConsol = playCons) {
    playConsol.clearText();
}