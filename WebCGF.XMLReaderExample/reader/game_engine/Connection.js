/**
 * Class responsible for handling the connection to the prolog. 
 * @constructor
 */
function Connection(game,port){
    Object.call(this);
    
    this.port = port;
    this.game = game;
    this.establishConnection();
};

/**
 * Stances that Connection has the properties of a Object. 
 */
Connection.prototype = Object.create(Object.prototype);

/**
 * Creates a Connection.
 */
Connection.prototype.constructor = Connection;

/**
 * Establishes a connection with the prolog server
 */
Connection.prototype.establishConnection= function(){
    this.getPrologRequest('handshake',connectionSuccessful,null,this.port);
};

Connection.prototype.createBoard = function(x,y){
    this.getPrologRequest('createBoard('+x+','+y+')',this.sendBoardToGame,null,this.port);
};

Connection.prototype.sendBoardToGame = function(data){
    var response = data.target.response;
    if(response == "Bad Request" || response == "Syntax Error"){
        console.error(response);
        this.connection.game.failResponse();
        return;
    }
    this.connection.game.currPrologState = response;
};

Connection.prototype.verifyWinner= function(board){
    this.getPrologRequest('checkWinner('+board+ ')',this.receiveWinner,null,this.port);
};

Connection.prototype.receiveWinner = function(data){
    var response = data.target.response;
    if(response == "Syntax Error"){
        console.error(response);
        return;
    }

    if(response == "Bad Request"){
        this.connection.game.receiveWinner(false);
    }else{
        this.connection.game.receiveWinner(response);
    }
};

Connection.prototype.hasAvailableCells= function(board){
    this.getPrologRequest('hasAvailableCells('+board+ ')',this.receiveHasAvailabeCells,null,this.port);
};

Connection.prototype.receiveHasAvailabeCells= function(data){
    var response = data.target.response;
    if(response == "Syntax Error"){
        console.error(response);
        return;
    }

    if(response == "Bad Request"){
        this.connection.game.receiveHasAvailabeCells(false);
    }else{
        this.connection.game.receiveHasAvailabeCells(true);
    }
};

Connection.prototype.playerMakeMove = function(board, player, x,y,type){
    var request = 'playerMakeMove('+board+','+player+','+(x-1)+','+(y-1)+','+type+')';
    this.getPrologRequest(request, this.sendResponseToGame, null, this.port);
};

Connection.prototype.sendResponseToGame= function(data){
    var response = data.target.response;
    if(response == "Bad Request" || response == "Syntax Error"){
        console.error(response);
        this.connection.game.failResponse();
        return;
    }
    this.connection.game.receiveBoard(response);
};

function connectionSuccessful(data){
    if(data.target.response == "handshake")
        console.log('Connection succsessful!');
    else
        console.error("Error establishing a connection. Received " + data.target.response);
};

Connection.prototype.getPrologRequest= function(requestString, onSuccess, onError, port){
    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);
    request['connection'] = this;
    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response"); return false;};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
};