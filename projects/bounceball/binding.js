var buttonBindings = {

    0: {
        onPress: function(id) {
            players[id].castSpell("bigShoot");
        },
        onHold: function() {
        },
        onRelease: function() {
        },
        onIdle: function() {
        }
    },

    1: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    2: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    3: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    4: {
        timesHeld: 0,
        onPress: function(id) {
            players[id].color = randomRGB();
        },
        onHold: function(id) {
            this.timesHeld++;
            if (this.timesHeld > 30) {
                players[id].color = randomRGB();
            }
        },
        onRelease: function() {
            this.timesHeld = 0;
        }
    },

    5: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    6: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    7: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    8: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    9: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    10: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    11: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    12: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    13: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    14: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    15: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    16: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    17: {
        onPress: function() {
        },
        onHold: function() {
        },
        onRelease: function() {
        }
    },

    leftTrigger: {
        onPress: function(id) {
            players[id].castSpell("bigShoot");
        },
        onHold: function() {

        },
        onRelease: function() {
        }
    },

    rightTrigger: {
        onPress: function(id) {
            players[id].castSpell("shoot");
        },
        onHold: function() {

        },
        onRelease: function() {

        }
    },

    leftJoyStickClick: function(id) {
        players[id].vel = {
            x: 0,
            y: 0
        }
    }

};

