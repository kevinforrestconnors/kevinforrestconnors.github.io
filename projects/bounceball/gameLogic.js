// general functions

function cloneGamepads(controller) {

    if (controller) {

        var result = {};

        result.buttons = [];

        for (var i = 0; i < controller.buttons.length; i++) {
            result.buttons.push({
                pressed: controller.buttons[i].pressed,
                value: controller.buttons[i].value || 0
            });
        }

        result.axes = [];

        for (var i = 0; i < controller.axes.length; i++) {
            result.axes.push(controller.axes[i]);
        }

        result.id = controller.id;
        result.index = controller.index;

        return result;

    } else {
        return undefined; // null is a null OBJECT so we use undefined to avoid the for in loop looking at null values
    }

}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rgb(r, g, b) {
    return "rgb(" + r + "," + g + "," + b + ")";
}

function randomRGB() {
    return "rgb(" + randomInt(0, 255) + "," + randomInt(0, 255) + "," + randomInt(0, 255) + ")";
}

function rgbStringToArray(str) {
    var r, g, b;
    r = str.substring(str.indexOf("(") + 1, str.indexOf(","));
    str = str.substring(str.indexOf(",") + 1);
    g = str.substring(0, str.indexOf(","));
    str = str.substring(str.indexOf(",") + 1);
    b = str.substring(0, str.indexOf(")"));
    return [parseInt(r), parseInt(g), parseInt(b)];
}

function lightenRGB(array) {
    var r1 = Math.floor(array[0] * 1.2);
    var g1 = Math.floor(array[1] * 1.2);
    var b1 = Math.floor(array[2] * 1.2);
    if (r1 > 255) {r1 = 255}
    if (g1 > 255) {g1 = 255}
    if (b1 > 255) {b1 = 255}
    return "rgb(" + r1 + "," + g1 + "," + b1 + ")";
}

function darkenRGB(array) {
    var r1 = Math.floor(array[0] / 1.2);
    var g1 = Math.floor(array[1] / 1.2);
    var b1 = Math.floor(array[2] / 1.2);
    if (r1 < 0) {r1 = 0}
    if (g1 < 0) {g1 = 0}
    if (b1 < 0) {b1 = 0}
    return "rgb(" + r1 + "," + g1 + "," + b1 + ")";
}

function rgbToRGBA(str, opacity) {
    return "rgba" + str.substring(str.indexOf("("), str.indexOf(")")) + "," + opacity + ")";
}

function sameSign(n1, n2) {
    return (n1 > 0 && n2 > 0) || (n1 < 0 && n2 < 0);
}

function quadratic(a, b, c) {
    var side1 = -1 * b;
    var side2 = Math.sqrt(b*b - 4*a*c);
    return [(side1 + side2) / (2 * a), (side1 - side2) / (2 * a)];
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}

function circlesTouching(c1x, c1y, c1r, c2x, c2y, c2r) {
    return distance(c1x, c1y, c2x, c2y) < c1r + c2r; // the distance between centers is less than the sum of their radii
}

function Vector(u1, u2) {
    this.x = u1;
    this.y = u2;
}

function addVectors(v1, v2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    }
}

function subtractVectors(v1, v2) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y
    }
}

function scaleVector(v1, scalar) {
    return {
        x: v1.x * scalar,
        y: v1.y * scalar
    }
}

function dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
}

function vectorMagnitude(v1) {
    return Math.sqrt(v1.x * v1.x + v1.y * v1.y);
}

function playerIntialPosition(index) {

    if (index === 0) {
        return {x: 50, y: 50}
    } else if (index === 1) {
        return {x: map.width - 50, y: 50}
    } else if (index === 2) {
        return {x: 50, y: map.height - 50}
    } else if (index === 3) {
        return {x: map.width - 50, y: map.height - 50}
    } else {
        return {x: 0, y: 0}
    }

}



// map

var map = {
    width: 1000,
    height: 1000
};

// players

var players = {};
var numPlayers = 0;

function Player(id, index) {

    this.id = id; // stuff to determine which player is which
    this.index = index;
    this.active = true;
    this.score = 0;

    this.color = randomRGB();
    this.ringColorChange = null;
    this.aad = 20; // aim arrow distance

    this.HP = 200 * 60;
    this.maxHP = 200 * 60;
    this.restitution = 0.5;
    this.speed = 0.5;
    this.shotSize = 10;

    this.joySticks = {

        leftJS: {
            x: 0,
            y: 0,
            mag: function() {
                return (this.x * this.x) + (this.y * this.y);
            },
            angle: function() {

                var result = Math.atan(Math.abs(this.y) / Math.abs(this.x)); // only do the calculation once, determine quadrant and adjust for that

                if (this.x === 0) { // straight up or straight down, causes problems with dividing (Y / 0)
                    if (this.y >= 0) {
                        return Math.PI * 1.5;
                    } else {
                        return Math.PI / 2;
                    }
                }

                if (this.x > 0 && this.y < 0) { // 1st quadrant
                    return result;
                } else if (this.x < 0 && this.y < 0) { // 2nd quadrant
                    return Math.PI - result;
                } else if (this.x < 0 && this.y > 0) { // 3rd quadrant
                    return Math.PI + result;
                } else { // 4th quadrant
                    return (Math.PI * 2) - result;
                }

            } // end angle
        },
        rightJS: {
            x: 0,
            y: 0,
            mag: function() {
                return (this.x * this.x) + (this.y * this.y);
            },
            angle: function() {

                var result = Math.atan(Math.abs(this.y) / Math.abs(this.x)); // only do the calculation once, determine quadrant and adjust for that

                if (this.x === 0) { // straight up or straight down, causes problems with dividing (Y / 0)
                    if (this.y >= 0) {
                        return Math.PI * 1.5;
                    } else {
                        return Math.PI / 2;
                    }
                }

                if (this.x > 0 && this.y < 0) { // 1st quadrant
                    return result;
                } else if (this.x < 0 && this.y < 0) { // 2nd quadrant
                    return Math.PI - result;
                } else if (this.x < 0 && this.y > 0) { // 3rd quadrant
                    return Math.PI + result;
                } else { // 4th quadrant
                    return (Math.PI * 2) - result;
                }

            } // end angle
        }
    };

    this.direction = 0;
    this.aimDirection = 0;
    this.radius = 50;

    this.pos = playerIntialPosition(this.index);

    this.vel = {
        x: 0,
        y: 0
    };

    this.bullet = {
        active: false,
        numBounces: 0,
        maxBounces: 4,
        radius: 10,
        speed: 10 + (10 * numPlayers), // 30 / 40 / 50
        restitution: 0.82 + (0.04 * numPlayers), // 0.9 / 0.94 / 0.98
        pos: {
            x: 0,
            y: 0
        },
        vel: {
            x: 0,
            y: 0
        },
        direction: function() {
            return Math.atan(this.vel.y / this.vel.x);
        },
        destroySelf: function() {
            this.numBounces = 0;
            this.active = false;
            this.radius = 10; // in case it was a big shot
            this.restitution = 0.9; // in case it was a big shot
        }
    };

    this.die = function() {
        this.active = false;
        this.pos = {
            x: -500,
            y: -500
        };
        this.vel = {
            x: 0,
            y: 0
        };
        this.bullet.active = false;
    };

    var contextThis = this;

    this.shotSmall = {
        current: 0,
        max: 30,
        action: function() {
            if (!contextThis.bullet.active) {
                contextThis.bullet.active = true;
                contextThis.bullet.pos.x = contextThis.pos.x + ((contextThis.radius + contextThis.aad) * Math.cos(contextThis.aimDirection));
                contextThis.bullet.pos.y = contextThis.pos.y - ((contextThis.radius + contextThis.aad) * Math.sin(contextThis.aimDirection));
                contextThis.bullet.vel.x = contextThis.bullet.speed * Math.cos(contextThis.aimDirection);
                contextThis.bullet.vel.y = -1 * contextThis.bullet.speed * Math.sin(contextThis.aimDirection);
            }
        },
        cooldown: function() {

        },
        notOffCooldown: function() {
        }
    };

    this.shotBig = {
        current: 450,
        max: 450,
        redCircleActive: false,
        action: function() {
            contextThis.bullet.active = false;
            contextThis.bullet.numBounces = 0; // reset bounces in case a small ball is active
            contextThis.bullet.radius = 40;
            contextThis.bullet.restitution = 1;
            contextThis.shotSmall.action();
        },
        cooldown: function() {
            var thisTemp = this;
            if (!thisTemp.redCircleActive) {
                thisTemp.redCircleActive = true;
                setTimeout(function() {contextThis.ringColorChange = "rgb(0, 255, 0)"}, 50);
                setTimeout(function() {contextThis.ringColorChange = "rgba(0, 255, 0, 0.9)"}, 100);
                setTimeout(function() {contextThis.ringColorChange = "rgba(0, 255, 0, 0.8)"}, 150);
                setTimeout(function() {contextThis.ringColorChange = "rgba(0, 255, 0, 0.7)"}, 200);
                setTimeout(function() {contextThis.ringColorChange = "rgba(0, 255, 0, 0.6)"}, 250);
                setTimeout(function() {contextThis.ringColorChange = "rgba(0, 255, 0, 0.5)"}, 300);
                setTimeout(function() {contextThis.ringColorChange = "rgba(0, 255, 0, 0.4)"}, 350);
                setTimeout(function() {contextThis.ringColorChange = "rgba(0, 255, 0, 0.3)"}, 400);
                setTimeout(function() {contextThis.ringColorChange = "rgba(0, 255, 0, 0.2)"}, 450);
                setTimeout(function() {contextThis.ringColorChange = "rgba(0, 255, 0, 0.1)"}, 500);
                setTimeout(function() {contextThis.ringColorChange = false; thisTemp.redCircleActive = false}, 550);
            }

        },
        notOffCooldown: function() {
            var thisTemp = this;
            if (!thisTemp.redCircleActive) {
                thisTemp.redCircleActive = true;
                setTimeout(function() {contextThis.ringColorChange = "rgb(255, 0, 0)"}, 50);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.9)"}, 100);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.8)"}, 150);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.7)"}, 200);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.6)"}, 250);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.5)"}, 300);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.4)"}, 350);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.3)"}, 400);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.2)"}, 450);
                setTimeout(function() {contextThis.ringColorChange = "rgba(255, 0, 0, 0.1)"}, 500);
                setTimeout(function() {contextThis.ringColorChange = false; thisTemp.redCircleActive = false}, 550);
            }
        }
    };

    this.invisBody = {
        current: 900,
        max: 900,
        action: function() {},
        cooldown: function() {},
        notOffCooldown: function() {}
    };

    this.invisArrow = {
        current: 300,
        max: 300,
        action: function() {},
        cooldown: function() {},
        notOffCooldown: function() {}
    };

    this.speedBoost = {
        current: 900,
        max: 900,
        action: function() {},
        cooldown: function() {},
        notOffCooldown: function() {}
    };

    this.spells = {
        shoot: this.shotSmall,
        bigShoot: this.shotBig,
        invisBody: this.invisBody,
        invisArrow:this.invisArrow,
        speed: this.speedBoost
    };

    this.cooldown = function() {
        for (var spell in this.spells) {
            if (this.spells[spell].current >= 0) {
                this.spells[spell].current--;
            }
            if (this.spells[spell].current == -1) {
                this.spells[spell].cooldown();
            }
        }
    };

    this.castSpell = function(spell) {
        if (this.spells[spell].current < 0) { // off cooldown
            this.spells[spell].current = this.spells[spell].max;
            this.spells[spell].action();
        } else {
            this.spells[spell].notOffCooldown();
        }
    };

}


function gameLoop() {

    background();

    var numAlivePlayers = 0;

    for (var player in players) {

        if (players[player].active) {

            numAlivePlayers++;

            var p = players[player];

            p.pos.x += p.vel.x;
            p.pos.y += p.vel.y;

            // collision test
            if (p.pos.x > map.width - p.radius) {
                p.pos.x = map.width - p.radius;
                p.vel.x *= (p.restitution * -1);
                p.pos.x += p.vel.x * 2;
            } else if (p.pos.x < p.radius) {
                p.pos.x = p.radius;
                p.vel.x *= (p.restitution * -1);
                p.pos.x += p.vel.x * 2;
            }

            if (p.pos.y > map.height - p.radius) {
                p.pos.y = map.height - p.radius;
                p.vel.y *= (p.restitution * -1);
                p.pos.y += p.vel.y * 2;
            } else if (p.pos.y < p.radius) {
                p.pos.y = p.radius;
                p.vel.y *= (p.restitution * -1);
                p.pos.y += p.vel.y * 2;
            }

            // change velocity
            p.vel.x += p.joySticks.leftJS.mag() * Math.cos(p.joySticks.leftJS.angle()) * p.speed;
            p.vel.y -= p.joySticks.leftJS.mag() * Math.sin(p.joySticks.leftJS.angle()) * p.speed;

            // draw player
            circle(p.pos.x, p.pos.y, p.radius, p.color);

            // draw blood (lol puns)
            circle(p.pos.x, p.pos.y, p.radius - 14, "rgba(230, 30, 15, 0.8)");
            // draw empty part
            var percentHPremaining = (p.HP * 2 / p.maxHP) - 1;
            var arcHeight = -1 * Math.asin(percentHPremaining);

            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, p.radius - 14, arcHeight, Math.PI + arcHeight * -1, true);
            ctx.closePath();
            ctx.fill();

            // draw lighter ring
            ctx.lineWidth = 14;
            ctx.strokeStyle = rgbToRGBA(lightenRGB(rgbStringToArray(p.color)), 0.5);
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, p.radius - 7, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.lineWidth = 2;

            if (p.ringColorChange) {
                ctx.lineWidth = 14;
                ctx.strokeStyle = p.ringColorChange;
                ctx.beginPath();
                ctx.arc(p.pos.x, p.pos.y, p.radius - 7, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();
                ctx.lineWidth = 2;
            }

            // aim arrow vars
            var aimAngle = p.aimDirection;
            var adjX = p.pos.x + ((p.radius + p.aad) * Math.cos(aimAngle)); // adjusted X, xi + L*cos0
            var adjY = p.pos.y - ((p.radius + p.aad) * Math.sin(aimAngle)); // adjusted Y, yi + L*sin0
            var ctrX = p.pos.x + ((p.radius + p.aad / 2) * Math.cos(aimAngle));
            var ctrY = p.pos.y - ((p.radius + p.aad / 2) * Math.sin(aimAngle));
            var lineToLeftX = p.pos.x + ((p.radius + p.aad / 2) * Math.cos(aimAngle - Math.PI / 8));
            var lineToLeftY = p.pos.y - ((p.radius + p.aad / 2) * Math.sin(aimAngle - Math.PI / 8));
            var lineToRightX = p.pos.x + ((p.radius + p.aad / 2) * Math.cos(aimAngle + Math.PI / 8));
            var lineToRightY = p.pos.y - ((p.radius + p.aad / 2) * Math.sin(aimAngle + Math.PI / 8));

            // shield vars
            var shieldLeftX = p.pos.x - Math.cos(aimAngle + Math.PI / 3) * (p.radius + 10);
            var shieldLeftY = p.pos.y + Math.sin(aimAngle + Math.PI / 3) * (p.radius + 10);
            var shieldMiddleX = p.pos.x - Math.cos(aimAngle) * (p.radius + p.aad + 10);
            var shieldMiddleY = p.pos.y + Math.sin(aimAngle) * (p.radius + p.aad + 10);
            var shieldRightX = p.pos.x - Math.cos(aimAngle - Math.PI / 3) * (p.radius + 10);
            var shieldRightY = p.pos.y + Math.sin(aimAngle - Math.PI / 3) * (p.radius + 10);

            // draw arrow
            ctx.beginPath();
            ctx.moveTo(adjX, adjY);
            ctx.lineTo(lineToRightX, lineToRightY);
            ctx.lineTo(ctrX, ctrY);
            ctx.lineTo(lineToLeftX, lineToLeftY);
            ctx.lineTo(adjX, adjY);
            ctx.closePath();
            ctx.fillStyle = darkenRGB(rgbStringToArray(p.color));
            ctx.strokeStyle = p.color;
            ctx.fill();
            ctx.stroke();

            // draw shield
            ctx.beginPath();
            ctx.moveTo(shieldLeftX, shieldLeftY);
            ctx.quadraticCurveTo(shieldMiddleX, shieldMiddleY, shieldRightX, shieldRightY);
            ctx.lineTo(shieldMiddleX + Math.cos(aimAngle) * p.aad * 1.5, shieldMiddleY - Math.sin(aimAngle) * p.aad * 1.5);
            ctx.closePath();
            ctx.fillStyle = darkenRGB(rgbStringToArray(p.color));
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fill();

            circle(shieldLeftX, shieldLeftY, 2, p.color);
            circle(shieldRightX, shieldRightY, 2, p.color);

            // move, collision test, and then draw bullets

            p.bullet.pos.x += p.bullet.vel.x;
            p.bullet.pos.y += p.bullet.vel.y;

            if (p.bullet.active) {

                // test if bullet has collided with any players and if so, remove the bullet and decrement that player's HP by 5% of their max
                for (var lp in players) {

                    var c1 = p.bullet;
                    var c2 = players[lp];

                    var dist = distance(c1.pos.x, c1.pos.y, c2.pos.x + c2.radius * Math.cos(c2.aimDirection + Math.PI), c2.pos.y - c2.radius * Math.sin(c2.aimDirection + Math.PI));

                    if (circlesTouching(c1.pos.x, c1.pos.y, c1.radius + 10, c2.pos.x, c2.pos.y, c2.radius + 10)) { // shield is about 10 from player

                        if (circlesTouching(c1.pos.x, c1.pos.y, c1.radius, c2.pos.x, c2.pos.y, c2.radius) && dist > c2.radius) { // didn't hit shield

                            var A = c1.radius * c1.radius * Math.PI; // define mass as the area
                            var B = c2.radius * c2.radius * Math.PI;

                            var v1 = new Vector(c1.vel.x, c1.vel.y); // velocity vector for bullet
                            var v2 = new Vector(c2.vel.x, c2.vel.y); // velocity vector for player

                            // get the collision normal vector
                            var normalVector = subtractVectors(c1.pos, c2.pos);
                            var normalVectorMag = vectorMagnitude(normalVector);
                            normalVector.x /= normalVectorMag;
                            normalVector.y /= normalVectorMag;

                            var a1 = dotProduct(normalVector, v1);
                            var a2 = dotProduct(normalVector, v2);

                            var optimizedP = (2 * (a1 - a2)) / (A + B);

                            var oP2 = scaleVector(normalVector, optimizedP * A);

                            var v2f = addVectors(v2, oP2);

                            // exchange momentum

                            c2.vel.x = v2f.x;
                            c2.vel.y = v2f.y;

                            c1.destroySelf();
                            c2.HP -= (c2.maxHP / 20); // player takes damage equal to 10% of max HP
                            if (c2.HP <= 0) {
                                c2.die();
                            }


                        } else {

                            if (dist < c2.radius) { // hit shield

                                var A = c1.radius * c1.radius * Math.PI; // define mass as the area
                                var B = c2.radius * c2.radius * Math.PI;

                                var v1 = new Vector(c1.vel.x, c1.vel.y); // velocity vector for bullet
                                var v2 = new Vector(c2.vel.x, c2.vel.y); // velocity vector for player

                                // get the collision normal vector
                                var normalVector = subtractVectors(c1.pos, c2.pos);
                                var normalVectorMag = vectorMagnitude(normalVector);
                                normalVector.x /= normalVectorMag;
                                normalVector.y /= normalVectorMag;

                                var a1 = dotProduct(normalVector, v1);
                                var a2 = dotProduct(normalVector, v2);

                                var optimizedP = (2 * (a1 - a2)) / (A + B);

                                var oP1 = scaleVector(normalVector, optimizedP * B);
                                var oP2 = scaleVector(normalVector, optimizedP * A);

                                var v1f = subtractVectors(v1, oP1);
                                var v2f = addVectors(v2, oP2);

                                // exchange momentum
                                c1.vel.x = v1f.x;
                                c1.vel.y = v1f.y;

                                c2.vel.x = v2f.x;
                                c2.vel.y = v2f.y;

                                while (circlesTouching(c1.pos.x, c1.pos.y, c1.radius, c2.pos.x, c2.pos.y, c2.radius)) { // move apart
                                    c1.pos.x += c1.vel.x / 100;
                                    c1.pos.y += c1.vel.y / 100;
                                    c2.pos.x += c2.vel.x / 100;
                                    c2.pos.y += c2.vel.y / 100;
                                }

                                c1.numBounces++;

                            } // end if dist < c2.radius

                        } // end else

                    } // end if collision < 10

                } // end player loop


                circle(p.bullet.pos.x, p.bullet.pos.y, p.bullet.radius, darkenRGB(rgbStringToArray(darkenRGB(rgbStringToArray(p.color))))); // draw bullet

                if (p.bullet.pos.x > map.width - p.bullet.radius) {
                    p.bullet.numBounces++;
                    if (p.bullet.numBounces > p.bullet.maxBounces) { // destroy bullet after it bounces 4 times
                        p.bullet.destroySelf();
                    }
                    p.bullet.pos.x = map.width - p.bullet.radius;
                    p.bullet.vel.x *= (p.bullet.restitution * -1);
                    p.bullet.pos.x += p.bullet.vel.x * 2;
                } else if (p.bullet.pos.x < p.bullet.radius) {
                    p.bullet.numBounces++;
                    if (p.bullet.numBounces > p.bullet.maxBounces) { // destroy bullet after it bounces 4 times
                        p.bullet.destroySelf();
                    }
                    p.bullet.pos.x = p.bullet.radius;
                    p.bullet.vel.x *= (p.bullet.restitution * -1);
                    p.bullet.pos.x += p.bullet.vel.x * 2;
                }

                if (p.bullet.pos.y > map.height - p.bullet.radius) {
                    p.bullet.numBounces++;
                    if (p.bullet.numBounces > p.bullet.maxBounces) { // destroy bullet after it bounces 4 times
                        p.bullet.destroySelf();
                    }
                    p.bullet.pos.y = map.height - p.bullet.radius;
                    p.bullet.vel.y *= (p.bullet.restitution * -1);
                    p.bullet.pos.y += p.bullet.vel.y * 2;
                } else if (p.bullet.pos.y < p.bullet.radius) {
                    p.bullet.numBounces++;
                    if (p.bullet.numBounces > p.bullet.maxBounces) { // destroy bullet after it bounces 4 times
                        p.bullet.destroySelf();
                    }
                    p.bullet.pos.y = p.bullet.radius;
                    p.bullet.vel.y *= (p.bullet.restitution * -1);
                    p.bullet.pos.y += p.bullet.vel.y * 2;
                }

            } // end if bullet active

            c1 = p;

            for (var bp in players) {

                c2 = players[bp];

                if (c1 != c2 && circlesTouching(c1.pos.x, c1.pos.y, c1.radius + 5, c2.pos.x, c2.pos.y, c2.radius + 5)) {

                    A = c1.radius * c1.radius * Math.PI; // define mass as the area
                    B = c2.radius * c2.radius * Math.PI;

                    v1 = new Vector(c1.vel.x, c1.vel.y);
                    v2 = new Vector(c2.vel.x, c2.vel.y);

                    // get the collision normal vector
                    normalVector = subtractVectors(c1.pos, c2.pos);
                    normalVectorMag = vectorMagnitude(normalVector);
                    normalVector.x /= normalVectorMag + 0.001;
                    normalVector.y /= normalVectorMag + 0.001;

                    a1 = dotProduct(normalVector, v1);
                    a2 = dotProduct(normalVector, v2);

                    optimizedP = (2 * (a1 - a2)) / (A + B);

                    oP1 = scaleVector(normalVector, optimizedP * B);
                    oP2 = scaleVector(normalVector, optimizedP * A);

                    v1f = subtractVectors(v1, oP1);
                    v2f = addVectors(v2, oP2);

                    c1.vel.x = v1f.x;
                    c1.vel.y = v1f.y;

                    c2.vel.x = v2f.x;
                    c2.vel.y = v2f.y;

                    while (circlesTouching(c1.pos.x, c1.pos.y, c1.radius + 5, c2.pos.x, c2.pos.y, c2.radius + 5)) {
                        c1.pos.x += c1.vel.x / 100;
                        c1.pos.y += c1.vel.y / 100;
                        c2.pos.x += c2.vel.x / 100;
                        c2.pos.y += c2.vel.y / 100;
                    }

                } // end if player touching other player test

            }


            p.HP--; // to prevent turtling, players lose 1 HP / tick

            if (p.HP <= 0) {
                p.die();
            }


            p.cooldown();


        }

    }

    if (numAlivePlayers <= 1 && gameState.state != "gui") {
        gameState.gameOver();
    }

} // end gameLoop

function init() {

    gameState.drawGui();

    gameState.resizeGame();

    window.onresize = gameState.resizeGame;

    window.onmousemove = function(e) {
        var element = $('#gui');
        gameState.mousePosition.x = e.pageX - element.offset().left;
        gameState.mousePosition.y = e.pageY - element.offset().top;
    };

    $('.triangle').click(function() {

        $(this).toggleClass('triangle-left');
        $(this).toggleClass('triangle-right');

        if ($('.howToPlay').is(':visible')) {
            $('.howToPlay').hide();
            $('.canvasLayers').css({'margin-left': '30px'})
        } else {
            $('.howToPlay').show();
            $('.canvasLayers').css({'margin-left': '0'})
        }

        gameState.resizeGame();

    });

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



    if (navigator.getGamepads) {
        gameState.selectPlayers();
        gamepadController.startPolling();
    } else {
        gameState.gamepadsNotSupported();
    }

} // end init


window.onload = init;