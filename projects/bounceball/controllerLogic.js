var gamepadController = {



    numControllersConnected: function() {
        var num = 0;
        if (navigator.getGamepads) {
            if (navigator.getGamepads()[0]) {num++}
            if (navigator.getGamepads()[1]) {num++}
            if (navigator.getGamepads()[2]) {num++}
            if (navigator.getGamepads()[3]) {num++}
        }
        return num;
    },

    ANALOGUE_BUTTON_THRESHOLD: 0.25, // we don't want analogue buttons to trigger too early from not enough pressure, or to not trigger at all because it isn't pressed down all the way

    previousControllerState: undefined,
    controllers: {},
    ticking: false,

    startPolling: function() {
        // Don't accidentally start a second loop, man.
        if (!gamepadController.ticking) {
            gamepadController.ticking = true;
            gamepadController.tick();
        }
    },

    stopPolling: function() {
        gamepadController.ticking = false;
    },

    tick: function() {

        gameLoop();

        if (gameState.state == 'gui') {

            gameState.drawGui();

            var scale = 1000 / $('#gui').height();

            var y = players.mainScreenDemoPlayer.pos.y / scale - gameState.mousePosition.y;
            var x = players.mainScreenDemoPlayer.pos.x / scale - gameState.mousePosition.x;

            if (x > 0 && y < 0) { // 1st quadrant
                players.mainScreenDemoPlayer.aimDirection = Math.PI + Math.atan(Math.abs(y) / Math.abs(x));
            } else if (x < 0 && y < 0) { // 2nd quadrant
                players.mainScreenDemoPlayer.aimDirection = (Math.PI * 2) - Math.atan(Math.abs(y) / Math.abs(x));
            } else if (x < 0 && y > 0) { // 3rd quadrant
                players.mainScreenDemoPlayer.aimDirection = Math.atan(Math.abs(y) / Math.abs(x));
            } else { // 4th quadrant
                players.mainScreenDemoPlayer.aimDirection = Math.PI - Math.atan(Math.abs(y) / Math.abs(x));
            }

            if (Math.random() > 0.95) {
                players.mainScreenDemoPlayer.castSpell('shoot');
            }

            if (Math.random() > 0.999) {
                players.mainScreenDemoPlayer.castSpell('bigShoot');
            }

        } else if (gameState.state == 'game') {

            gamepadController.pollStatus();

        } else if (gameState.state == 'gameover') {

            gameState.gameOverGui();

        }

        gamepadController.scheduleNextTick();
    },

    scheduleNextTick: function() {
        // Only schedule the next frame if we haven't decided to stop via
        // stopPolling() before.
        if (gamepadController.ticking) {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(gamepadController.tick);
            } else if (window.mozRequestAnimationFrame) {
                window.mozRequestAnimationFrame(gamepadController.tick);
            } else if (window.webkitRequestAnimationFrame) {
                window.webkitRequestAnimationFrame(gamepadController.tick);
            }
            // Note lack of setTimeout since all the browsers that support
            // Gamepad API are already supporting requestAnimationFrame().
        }
    },

    pollStatus: function() {

        if (!gamepadController.previousControllerState) { // define it the first time
            gamepadController.previousControllerState = {
                0: cloneGamepads(navigator.getGamepads()[0]),
                1: cloneGamepads(navigator.getGamepads()[1]),
                2: cloneGamepads(navigator.getGamepads()[2]),
                3: cloneGamepads(navigator.getGamepads()[3])
            };
        }

        // retrieve current state
        gamepadController.controllers = {
            0: cloneGamepads(navigator.getGamepads()[0]),
            1: cloneGamepads(navigator.getGamepads()[1]),
            2: cloneGamepads(navigator.getGamepads()[2]),
            3: cloneGamepads(navigator.getGamepads()[3])
        };

        for (var p in players) { // for each player

            var playerID = "a" + players[p].id.trim() + players[p].index;
            var playerIndex = players[p].index;

            var buttons = [];
            var axes = [];

            var prevButtons = [];
            var prevAxes = [];

            for (var b = 0; b < gamepadController.controllers[playerIndex].buttons.length; b++) { // current buttons
                buttons.push(gamepadController.controllers[playerIndex].buttons[b]);
            }
            for (var a = 0; a < gamepadController.controllers[playerIndex].axes.length; a++) { // current axes
                axes.push(gamepadController.controllers[playerIndex].axes[a]);
            }

            for (var pb = 0; pb < gamepadController.previousControllerState[playerIndex].buttons.length; pb++) { // previous buttons
                prevButtons.push(gamepadController.previousControllerState[playerIndex].buttons[pb]);
            }
            for (var pa = 0; pa < gamepadController.previousControllerState[playerIndex].axes.length; pa++) { // previous axes
                prevAxes.push(gamepadController.previousControllerState[playerIndex].axes[pa]);
            }

            // HANDLE JOYSTICKS

            players[p].joySticks.leftJS.x = axes[0];
            players[p].joySticks.leftJS.y = axes[1];

            players[p].joySticks.rightJS.x = axes[2];
            players[p].joySticks.rightJS.y = axes[3];

            if (players[p].joySticks.leftJS.mag() > gamepadController.ANALOGUE_BUTTON_THRESHOLD) {
                players[p].direction = players[p].joySticks.leftJS.angle()
            }

            if (players[p].joySticks.rightJS.mag() > gamepadController.ANALOGUE_BUTTON_THRESHOLD) {
                players[p].aimDirection = players[p].joySticks.rightJS.angle();
            }

            var leftTrigger, rightTrigger, prevLeftTrigger, prevRightTrigger, currentTriggers, previousTriggers, mappings, leftJoystickClick;

            // In Firefox, the left joystick click is button 6, in Chrome it is 10

            if (buttons.length == 17) { // chrome (0 to 1 on triggers)

                leftTrigger = buttons[6].value;
                rightTrigger = buttons[7].value;
                prevLeftTrigger = prevButtons[6].value;
                prevRightTrigger = prevButtons[7].value;
                leftJoystickClick = buttons[10];

            } else if (buttons.length == 15) { // firefox (uses -1 to 1 on triggers)

                leftTrigger = (axes[4] + 1) / 2;
                rightTrigger = (axes[5] + 1) / 2;
                prevLeftTrigger = (prevAxes[4] + 1) / 2;
                prevRightTrigger = (prevAxes[5] + 1) / 2;
                leftJoystickClick = buttons[6];

            } else {
                alert("Sorry, your browser is not currently supported!");
                gamepadController.stopPolling();
                break;
            }

            currentTriggers = [leftTrigger, rightTrigger];
            previousTriggers = [prevLeftTrigger, prevRightTrigger];
            mappings = [buttonBindings.leftTrigger, buttonBindings.rightTrigger];

            // Handle leftJoyStickClick, which is mapped differently between FF and Chrome

            if (leftJoystickClick.pressed) {
                buttonBindings.leftJoyStickClick(playerID);
            }


            // Handle binary buttons

            for (var j = 0; j < buttons.length; j++) {

                if (buttons[j].pressed) { // currently pressed

                    if (prevButtons[j].pressed) { // was pressed last tick too, so trigger onHold
                        buttonBindings[j].onHold(playerID);
                    } else { // was not pressed last tick, so trigger onPress
                        buttonBindings[j].onPress(playerID);
                    }

                } else { // not pressed

                    if (prevButtons[j].pressed) { // was pressed last tick, but isn't anymore, so trigger onRelease
                        buttonBindings[j].onRelease(playerID);
                    } else {
                        if (buttonBindings[j].onIdle) { // if it does something when not pressed continuously
                            buttonBindings[j].onIdle(playerID);
                        }
                    }

                } // end if-else

            } // end loop for buttons


            // Handle analogue buttons

            for (var k = 0; k < 2; k++) {

                if (currentTriggers[k] > gamepadController.ANALOGUE_BUTTON_THRESHOLD) { // currently pressed

                    if (previousTriggers[k] > gamepadController.ANALOGUE_BUTTON_THRESHOLD) { // was pressed last tick too, so trigger onHold
                        mappings[k].onHold(playerID);
                    } else { // was not pressed last tick, so trigger onPress
                        mappings[k].onPress(playerID);
                    }

                } else { // not pressed

                    if (previousTriggers[k] > gamepadController.ANALOGUE_BUTTON_THRESHOLD) { // was pressed last tick, but isn't anymore, so trigger onRelease
                        mappings[k].onRelease(playerID);
                    } else {
                        if (mappings[k].onIdle) { // if it does something when not pressed continuously
                            mappings[k].onIdle(playerID);
                        }
                    }

                } // end if-else

            } // end for loop for triggers


        } // end loop for players


        // store previous state
        gamepadController.previousControllerState = {
            0: cloneGamepads(navigator.getGamepads()[0]),
            1: cloneGamepads(navigator.getGamepads()[1]),
            2: cloneGamepads(navigator.getGamepads()[2]),
            3: cloneGamepads(navigator.getGamepads()[3])
        };

    },

    onGamepadConnect: function(e) {
        console.log("Controller connected");
    },

    onGamepadDisconnect: function(e) {
        console.log("Controller disconnected");
    }

};


window.addEventListener('gamepadconnected', gamepadController.onGamepadConnect, false);
window.addEventListener('gamepaddisconnected', gamepadController.onGamepadDisconnect, false);

