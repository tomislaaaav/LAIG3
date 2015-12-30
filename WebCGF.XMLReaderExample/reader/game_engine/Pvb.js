/**
 * Class that handles PvB state machine
 * @constructor
 * @param game {Spangles} - game
 */
function Pvb(game){
    Object.call(this);

    this.game = game;
    
    this.currPlayer = 2;
    this.switchState("StartTurn");
    this.game.stopTimer();
};

/**
 * Stances that Pvb has the properties of a Object. 
 */
Pvb.prototype = Object.create(Object.prototype);

Pvb.prototype.update= function(action){
    switch(this.state){       
        case "Turn":
            switch(action){
                case "endTurn":
                    this.switchState("StartTurn");
                    break;
                case "sendRequest":
                    this.switchState("WaitResponse");
                    break;
                case "sendRequest":
                    console.log("Undo doesn't work against the bot");
                    break;
                default:
                    console.error("Action not recognized " + action);
                    break;                    
            }
            break;
        case "WaitResponse":
            switch(action){
                case "validPlay":
                    this.game.updateScore(this.currPlayer, this.game.score[this.currPlayer-1]+1);                
                    this.switchState("BoardCheck");
                    break;
                case "fail":
                    this.switchState("Turn");
                    break;
                case "undo":
                    console.log("Undo doesn't work while waiting a response from server");
                    break;
                default:
                    console.error("Action not recognized" + action);
                    break; 
            }
            break;
        case "BoardCheck":
            switch(action){
                case "won":
                    var message = "Player "+this.currPlayer+" has won this game. You will now see a recap of the game"; 
                    this.switchState("Finished");
                    console.log(message);
                    alert(message);
                    break;
                case "full":
                    var message = "There are no more empty cells. It's a tie. You will now see a recap of the game";
                    console.log(message);
                    this.switchState("Finished");
                    alert(message);
                    break;
                case "continue":
                    this.switchState("StartTurn");
                    break;
                case "undo":
                    console.log("Undo doesn't work while waiting a response from server");
                    break;
                default:
                    console.error("Action not recognized" + action);
                    break;
            }
            break;
        case "Finished":
            break;
        default:
            console.error("State not recognized "+this.state);
            break;
    }  
};

Pvb.prototype.switchState= function(state){
    switch(state){
        case "StartTurn":
            this.game.resetTimer();
            this.game.resetResults();
            if(this.currPlayer == 1){
                this.currPlayer = 2;
                console.log("Bot 2 now playing");
            }else{
                this.currPlayer = 1;
                console.log("Player 1 now playing");
            }
            this.switchState("Turn");
            break;        
        case "Turn":
            this.state = state;
            
            if(this.currPlayer == 2){
                this.game.picking = false;
                this.game.botMakePlay(this.currPlayer);
            }else{
                this.game.picking = true;
            }

            if(!this.game.timerActiv)
                this.game.resumeTimer();
                
            break;
        case "WaitResponse":
            this.state = state;
            this.game.stopTimer();
            this.game.picking = false;
            break;
        case "BoardCheck":
            this.game.startVerification();
            this.state = state;
            break;
        case "Finished":
            this.game.scoreBoard.stopClock();
            this.state = state;
            this.game.board.startRewind();
            this.game.stopTimer();
            this.game.picking = false;
            break;
        default:
            console.error("State change failed. Didn't expect state: "+state)
    }         
};