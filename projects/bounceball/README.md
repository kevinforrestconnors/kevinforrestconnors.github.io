Bounceball
==========

Bounceball is a locally-multiplayer arcade/action game that makes use of the Gamepad API.  
It _requires_ a gamepad, such as xBox or Playstation controllers.  
The game is not suited for keyboard controls.

Browser performance:
* Firefox - best performance
* Chrome - finicky performance
* Safari - does not work because the Gamepad API is not supported
* IE - haha no

##Gameplay

Each player is a circular being with an arrow and a shield.  
The arrow signifies the direction you are pointing.  
The shield is used to block projectiles that players fire.
Players fire bullets at each other, trying to hit the other.  If it hits your shield, it bounces off and you remain unharmed.
If it hits the rest of your body, you take a hit.  Players can take up to 10 hits before dying, and your HP is shown by the red circle (initially full).  The last player alive wins!

There is a special move, called the Big Shot, which can only be used when your player is flashing green.  Press the left trigger or "A" button to fire a bullet that is four times as large!

##Controls

Controls vary by controller.  On the xBox controller, which is what I use to test, the controls are as follows:

* __Shoot:__ Right Trigger
* __Big Shot:__ A __or__ Left Trigger
* __Move:__ Left Joystick
* __Aim:__ Right Joystick
* __Change Color:__ Left Button
* __Stop Moving:__ Left Joystick Click

Controls should be similar on other controllers, though not exactly the same.  
If you use one and the controls seem especially weird, please contact me and I'll code different controls for that controller.

##Tech Support

If the game doesn't work, there are a few possible reasons why.  It's always a good idea to refresh, first.

If no controllers are being detected, the most common reason is that you haven't pressed any buttons yet! 
It's possible that your browser does not implement the Gamepad API or your brand of gamepad is not supported by your browser.
If you are using Chrome, there is a known bug (with Chrome, not my code) where a restart of Chrome is necessary.

If the game doesn't show at all, you're likely using a browser that doesn't even support the HTML5 Canvas!  Get with the times!

You can always contact me with more complicated issues.

## Notes

Since I only own 2 controllers, I have only tested the game with 2 players.  Please test it with 3 or 4!


----


Thanks for playing Bounceball!
