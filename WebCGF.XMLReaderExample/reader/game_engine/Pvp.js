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
        case "Turn":
            switch(action){
                case "endTurn":
                    this.switchState("StartTurn");
                    break;
                case "sendRequest":
                    this.switchState("WaitResponse");
                    break;
                default:
                    console.error("Action not recognized " + action);
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
        default:
            console.error("State not recognized "+this.state);
            break;
    }  
};

Pvp.prototype.switchState= function(state){
    switch(state){
        case "StartTurn":
            this.game.resetTimer();
            if(this.currPlayer == 1){
                this.currPlayer = 2;
                console.log("Player 2 now playing");
            }else{
                this.currPlayer = 1;
                console.log("Player 1 now playing");
            }
            this.switchState("Turn");
            break;        
        case "Turn":
            this.state = state;
            this.game.picking = true;
            if(!this.game.timerActiv)
                this.game.resumeTime();
            break;
        case "WaitResponse":
            this.state = state;
            this.game.stopTimer();
            this.game.picking = false;
            break;
        default:
            console.error("State change failed. Didn't expect state: "+state)
    }         
};