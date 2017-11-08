var gameState = {

    mousePosition: {
        x: 0,
        y: 0
    },

    score: {
        0: 0,
        1: 0,
        2: 0,
        3: 0
    },

    scoreGuiPositions: {
        0: [300, 400, 610, 400, 590, 400],
        1: [300, 480, 610, 480, 590, 480],
        2: [300, 560, 610, 560, 590, 560],
        3: [300, 640, 610, 640, 590, 640]
    },

    state: 'gui',

    gameOverScore: function() {

        for (var p in players) {
            guiCtx.fillText(players[p].score, gameState.scoreGuiPositions[players[p].index][2], gameState.scoreGuiPositions[players[p].index][3]);
            guiCtx.fillStyle = darkenRGB(rgbStringToArray(darkenRGB(rgbStringToArray(players[p].color))));
            guiCtx.fillText("Player " + (players[p].index + 1) + ":", gameState.scoreGuiPositions[players[p].index][0], gameState.scoreGuiPositions[players[p].index][1]);
            guiCtx.fillStyle = "rgb(120,120,120)";
        }

    },

    winner: 0,

    paneHovered: 0,
    paneColor: function(p) {
        if (p === gameState.paneHovered) {
            return 0.1;
        } else {
            return 0;
        }
    },

    resizeGame: function() {
        $('#game').width(1).height(1);
        $('#gui').width(1).height(1);
        $('.howToPlay') .height(1);
        var s = $(document).height() - 40;
        $('#game').width(s).height(s);
        $('#gui').width(s).height(s);
        $('.howToPlay').height(s);
        $('.triangle-left').css({
            top: ((s / 2) - 40) + "px",
            left: "-30px"
        });
        $('.triangle-right').css({
            top: ((s / 2) - 40) + "px",
            left: "-40px"
        });
    },

    checkRecommendedNumPlayers: function(n) {
        if (n <= gamepadController.numControllersConnected()) {
            guiCtx.fillStyle = "#EBE976";
        } else {
            guiCtx.fillStyle = "#777";
        }
    },

    drawGui: function() {


        guiCtx.fillStyle = "#000";

        guiCtx.font = 'bold 60pt Baskerville';
        guiCtx.fillText('Bounceball', 395, 680);

        guiCtx.font = 'bold 15pt Baskerville';
        guiCtx.fillText('A game by Kevin Connors', 465, 710); // +80 + 30

        guiCtx.fillStyle = "#CC1100";
        if (gamepadController.numControllersConnected() > 1) {
            guiCtx.fillStyle = "#7FFF00"; // good to go
        }
        guiCtx.font = 'bold 17pt Copperplate';
        guiCtx.fillText('Controllers connected: ' + gamepadController.numControllersConnected(), 360, 300);
        guiCtx.fillStyle = "#000";

        guiCtx.font = 'bold 100pt Copperplate';
        gameState.checkRecommendedNumPlayers(2);
        guiCtx.fillText('2', 140, 460);
        gameState.checkRecommendedNumPlayers(3);
        guiCtx.fillText('3', 465, 460);
        gameState.checkRecommendedNumPlayers(4);
        guiCtx.fillText('4', 790, 460);

        guiCtx.font = 'bold 25pt Baskerville';
        gameState.checkRecommendedNumPlayers(2);
        guiCtx.fillText('Players', 120, 500);
        gameState.checkRecommendedNumPlayers(3);
        guiCtx.fillText('Players', 445, 500);
        gameState.checkRecommendedNumPlayers(4);
        guiCtx.fillText('Players', 770, 500);

        guiCtx.fillStyle = "#FFF";
        guiCtx.strokeStyle = "#777";
        guiCtx.beginPath();
        guiCtx.moveTo(0, 0);
        guiCtx.lineTo(280, 0);
        guiCtx.quadraticCurveTo(260, 150, 0, 140);
        guiCtx.lineTo(0, 0);
        guiCtx.fill();
        guiCtx.stroke();
        guiCtx.closePath();
        guiCtx.fillStyle = "#000";

        guiCtx.font = 'bold 20pt Baskerville';
        guiCtx.fillText('• Connect gamepads', 10, 30);
        guiCtx.fillText('• Click # of Players', 10, 65);
        guiCtx.fillText('• Play ball!', 10, 100);


        guiCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
        guiCtx.fillRect(0, 0, guiCanvas.width, guiCanvas.height / 3);

        guiCtx.fillStyle = "rgba(0, 0, 0," + (0.15 + gameState.paneColor(2)) + ")";
        guiCtx.fillRect(0, guiCanvas.height / 3, guiCanvas.width / 3, guiCanvas.height * (2/3)); // 2 player pane

        guiCtx.fillStyle = "rgba(0, 0, 0," + (0.2 + gameState.paneColor(3)) + ")";
        guiCtx.fillRect(guiCanvas.width / 3, guiCanvas.height / 3, guiCanvas.width / 3, guiCanvas.height * (2/3)); // 3 player pane

        guiCtx.fillStyle = "rgba(0, 0, 0," + (0.15 + gameState.paneColor(4)) + ")";
        guiCtx.fillRect(guiCanvas.width * (2/3), guiCanvas.height / 3, guiCanvas.width / 3, guiCanvas.height * (2/3)); // 4 player pane



    },

    selectPlayers: function() {

        $("#gui").click(function() {}).mousemove(function() {});

        gameState.drawGui();

        $("#gui").click(function(e) {

            var w = $(this).width();
            var h = $(this).height();
            var posX = $(this).offset().left;
            var posY = $(this).offset().top;
            var relativeClickX = e.pageX - posX;
            var relativeClickY = e.pageY - posY;

            if (relativeClickY > h / 3) {

                if (relativeClickX > w * (2/3)) {
                    numPlayers = 4;
                } else if (relativeClickX > w / 3) {
                    numPlayers = 3;
                } else {
                    numPlayers = 2;
                }

                if (numPlayers === gamepadController.numControllersConnected()) {
                    map.width = numPlayers * 500;
                    map.height = numPlayers * 500;
                    gameState.playingGame();
                    $("#gui").click(function() {}).mousemove(function() {});
                }

            }

        });

        $("#gui").mousemove(function(e) {

            var w = $(this).width();
            var h = $(this).height();
            var posX = $(this).offset().left;
            var posY = $(this).offset().top;
            var relativePosX = e.pageX - posX;
            var relativePosY = e.pageY - posY;

            if (relativePosY > h / 3) {

                if (relativePosX > w * (2/3)) {
                    gameState.paneHovered = 4;
                } else if (relativePosX > w / 3) {
                    gameState.paneHovered = 3;
                } else {
                    gameState.paneHovered = 2;
                }

            } else {
                gameState.paneHovered = 0;
            }

        });

        $("#gui").mouseleave(function() {
            gameState.paneHovered = 0;
        });

    },

    playingGame: function() {

        gameState.state = 'game';
        guiCanvas.width = guiCanvas.width; // clear canvas

        background();

        var compareGamepads = function(a,b) {
            return a.id - b.id;
        };

        players = {};

        var pn = 0;

        while (pn < numPlayers) {

            if (navigator.getGamepads()[pn]) {
                var fixedName = "a" + navigator.getGamepads()[pn].id.trim() + navigator.getGamepads()[pn].index; // a added to beginning in case the ID starts with a number
                players[fixedName] = new Player(navigator.getGamepads()[pn].id, navigator.getGamepads()[pn].index);
            }

            pn++;

            if (pn >= 4) {
                if (players.length != numPlayers) {
                    alert("Something went wrong, please refresh the page!");
                }
                break;
            }

        }

    },

    gamePaused: function() {

        if (resumeclicked) {
            guiCanvas.width = guiCanvas.width; // clear canvas
        } else if (restartClicked) {
            players = [];
            gameState.selectPlayers();
        }

    },

    gameOverGui: function() {

        background();

        guiCtx.fillStyle = "rgba(200,200,200,0.9)";
        guiCtx.fillRect(250, 150, 500, 100);
        guiCtx.fillRect(250, 750, 500, 100);

        guiCtx.fillStyle = "rgba(220,220,220,0.8)";
        guiCtx.fillRect(250, 250, 500, 500);

        guiCtx.fillStyle = "rgb(120,120,120)";
        guiCtx.font = "bold 25pt Baskerville";
        guiCtx.fillText("Game Over!  Player " + (gameState.winner + 1) + " Wins!", 280, 210);
        guiCtx.fillText("Scores:", 440, 300);

        guiCtx.font = "bold 30pt Baskerville";
        guiCtx.fillText("Play Again", 280, 810);
        guiCtx.font = "bold 35pt Baskerville";
        guiCtx.fillText("Menu", 560, 815);
        guiCtx.font = "bold 25pt Baskerville";

        gameState.gameOverScore();

        guiCtx.beginPath();
        guiCtx.rect(250, 150, 500, 700);
        guiCtx.rect(250, 750, 260, 100); // Play Again Buttons
        guiCtx.rect(510, 750, 240, 100); // Menu Button
        guiCtx.stroke();
        guiCtx.closePath();

        guiCtx.strokeStyle = "rgba(0,0,0,0.2)";
        guiCtx.beginPath();
        guiCtx.moveTo(510, 340);
        guiCtx.lineTo(510, 700);
        guiCtx.stroke();
        guiCtx.closePath();

    },

    gameOver: function() {

        gameState.state = "gameover";

        for (var p in players) {
            if (players[p].active) {
                players[p].score++;
                players[p].active = false;
                gameState.winner = players[p].index;
            }
        }

        map.width = 1000;
        map.height = 1000;

        $("#gui").click(function (e) {

            var w = $(this).width();
            var h = $(this).height();
            var posX = $(this).offset().left;
            var posY = $(this).offset().top;
            var relativeClickX = e.pageX - posX;
            var relativeClickY = e.pageY - posY;

            if (relativeClickY > 0.75 * h && relativeClickY < 0.85 * h) {

                console.log(1);

                if (relativeClickX > 0.25 * w && relativeClickX < 0.51 * w) {

                    for (var p in players) {
                        players[p].active = true;
                        players[p].HP = players[p].maxHP; // Heal up
                        players[p].pos = playerIntialPosition(players[p].index);
                    }

                    gameState.state = "game";

                    $("gui").click(function () {});

                } else if (relativeClickX > 0.51 * w && relativeClickX < 0.75 * w) {

                    players = {};

                    players.mainScreenDemoPlayer = new Player();
                    players.mainScreenDemoPlayer.pos = {
                        x: 500,
                        y: 500
                    };
                    players.mainScreenDemoPlayer.vel = {
                        x: randomInt(5, 7),
                        y: randomInt(5, 7)
                    };
                    players.mainScreenDemoPlayer.restitution = 0.97;
                    players.mainScreenDemoPlayer.bullet.speed = 40;

                    gameState.state = "gui";

                    $("gui").click(function () {});

                }

            } // end if

        });

    },

    gamepadsNotSupported: function() {
        alert("Looks like your browser or OS does not support the Gamepad API.  This unfortunately means you cannot play Bounceball :(");
    }

};

