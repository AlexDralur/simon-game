/**
 * @jest-environment jsdom
 */

const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require("../game");

jest.spyOn(window, 'alert').mockImplementation(() => {});

beforeAll(() => {
    let fs = require('fs');
    fileContents = fs.readFileSync('index.html', 'utf-8');
    document.open();
    document.write(fileContents);
    document.close();
});

describe('game object contains the correct keys', () => {
    test('score key exists', () => {
        expect('score' in game).toBe(true);
    });
    test('currentGame key exists', () => {
        expect('currentGame' in game).toBe(true);
    });
    test('playerMoves key exists', () => {
        expect('playerMoves' in game).toBe(true);
    });
    test('choices key exists', () => {
        expect('choices' in game).toBe(true);
    });
    test('turnNumber key exits', () => {
        expect('turnNumber' in game).toBe(true);
    })
    test('choices contain the correct ids', () => {
        expect(game.choices).toEqual(["button1", "button2", "button3", "button4"]);
    });
    test('check if turnInProgress exist in the game object', () => {
        expect('turnInProgress' in game).toBe(true);
    });
    test('check if lastButton exist in the game object', () => {
        expect('lastButton' in game).toBe(true);
    });
    test('check if lastButton exist in the game object', () => {
        expect(game.lastButton).toEqual('');
    });
});

describe('newGame works correctly', () => {
    beforeAll(() => {
        game.score = 5;
        game.playerMoves = ['button1', 'button3', 'button4', 'button4'];
        game.currentGame = ['button1', 'button3', 'button4', 'button3'];
        document.getElementById('score').innerText = '5';
        newGame();
    });

    test('should reset the game score to zero', () => {
        expect(game.score).toEqual(0);
    });
    test('should reset the playerMoves to empty', () => {
        expect(game.playerMoves.length).toEqual(0);
    });
    test("should be one move in the computer's game array", () => {
        expect(game.currentGame.length).toBe(1);
    });
    test('should display 0 for the element with id of score', () => {
        expect(document.getElementById('score').innerText).toEqual(0);
    });
    test('expect data-listener to be true', () => {
        const elements = document.getElementsByClassName('circle');
        for (element of elements){
            expect(element.getAttribute('data-listener')).toEqual('true');
        }
    });
    test('expect turnInProgress to be false', () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    });
    test('clicking during computer sequence should fail', () => {
        showTurns();
        game.lastButton = '';
        document.getElementById('button2').click();
        expect(game.lastButton).toEqual('');
    })
});

describe('gameplay works correctly', () => {

    beforeEach(() => {
        game.score = 0;
        game.playerMoves = [];
        game.currentGame = [];
        addTurn();
    });

    afterEach(() => {
        game.score = 0;
        game.playerMoves = [];
        game.currentGame = [];
    });

    test('addTurn adds a new turn to the game', () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });

    test('should add correct class to light up the buttons', () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain('light');
    });

    test('showTurns should update game.turnNumber', () => {
        game.turnNumber = 5;
        showTurns();
        expect(game.turnNumber).toBe(0);
    });

    test('should increment the score if the turn is correct', () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });

    test('should call an alert if the move is wrong', () => {
        game.playerMoves.push('wrong');
        playerTurn();
        expect(window.alert).toBeCalledWith('Wrong move!');
    });
});