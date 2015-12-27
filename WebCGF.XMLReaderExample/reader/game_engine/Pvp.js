/**
 * Class that handles PvP state machine
 * @constructor
 * @param scene {CGFScene} - scene 
 * @param game {Spangles} - game
 */
function Pvp(game){
    Object.call(this);

    this.game = game;
    
    this.currPlayer = 2;
    this.switchState("StartTurn");
    this.game.stopTimer();
};

/**
 * Stances that Pvp has the properties of a Object. 
 */
Pvp.prototype = Object.create(Object.prototype);

Pvp.prototype.update= function(action){
    switch(this.state){
        case "StartTurn":
            this.switchState("Turn");
            this.update(action);
            break;        
        case "Turn":
            switch(action){
                case "endTurn":
                    this.switchState("StartTurn");
                    break;
                case "sendRequest":
                    this.switchState("WaitResponse");
                    break;
                default:
                    console.error("Action not recognized");
                    break;                    
            }
            break;
        case "WaitResponse":
            switch(action){
                case "validPlay":
                    this.switchState("StartTurn");
                    break;
                case "fail":
                    this.switchState("Turn");
                    break;
                default:
                    console.error("Action not recognized");
                    break; 
            }
            break;
    }  
};

Pvp.prototype.switchState= function(state){
    switch(state){
        case "StartTurn":
            this.game.resetTimer();
            this.currState = "Turn";
            if(this.currPlayer == 1){
                this.currPlayer = 2;
                console.log("Player 2 now playing");
            }else{
                this.currPlayer = 1;
                console.log("Player 1 now playing");
            }
            break;        
        case "Turn":
            this.game.picking = true;
            if(!this.game.timerActiv)
                this.game.resumeTime();
            break;
        case "WaitResponse":
            this.game.stopTimer();
            this.game.picking = false;
            break;
    }         
};