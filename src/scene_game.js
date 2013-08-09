
var gameGraphics = [ "assets/moveman.png", "assets/tile_blank.png", "assets/tile_start.png" ];
var tileGraphics = { B: "assets/tile_blank.png", S: "assets/tile_start.png", A: "assets/tile_start.png" };

var kTileLogics = { }
kTileLogics.A = {
    OnEnter: function(tile, ent) {

        if (ent.has("moveman"))
        {
            ent.dirX = tile.dirX;
            ent.dirY = tile.dirY;
        }
    } };

levels = new Array();

var kMovemanWidth = 16;
var kMovemanHeight = 32;
var kTileWidth = 32;
var kTileHeight = 32;

function GetTileAt(level, x, y)
{
    var atTileX = Math.floor(x / kTileWidth);
    var atTileY = Math.floor(y / kTileHeight);
    var numDown = level.height;
    return level.tiles[numDown * atTileY + atTileX];
}

function LoadLevel(level, moveman)
{
    var width = level.width;
    var height = level.height;
    var x = 0;
    var y = 0;
    var tiles = new Array();
    for (var t = 0; t < level.tiles.length; t++)
    {
        var tileType = level.tiles[t];
        var tile = Crafty.e("2D, Canvas, Image")
                   .attr({ x: x, y: y, z: 0, w: kTileWidth, h: kTileHeight })
                   .image(tileGraphics[tileType])

        tile.logic = kTileLogics[tileType];
        if (tileType == "S")
        {
            moveman.attr({ x: x + moveman.w / 2, y: y - kTileHeight / 2 });
        }
        else if (tileType == "A")
        {
            tile.dirX = 0;
            tile.dirY = 0;
            var leftRight = Math.random() > 0.5;
            if (leftRight)
            {
                var left = Math.random() > 0.5;
                if (left)
                    tile.dirX = -1
                else
                    tile.dirX = 1;
            }
            else
            {
                var up = Math.random() > 0.5;
                if (up)
                    tile.dirY = 1;
                else
                    tile.dirY = -1;
            }
        }

        x += kTileWidth;
        if (t > 0 && (t + 1) % width == 0)
        {
            x = 0;
            y += kTileHeight;
        }
        tiles.push(tile);
    }
    return { width: level.width, height: level.height, tiles: tiles };
}

Crafty.scene('Game', function()
{
    Crafty.background("rgb(80, 80, 80)");

    Crafty.load(gameGraphics);

    var currentLevel = null;

    Crafty.sprite("assets/moveman.png", { moveman: [ 0, 0, 64, 32 ] } );

    var moveman = Crafty.e("2D, Canvas, Collision, Delay, moveman")
                  .attr({ x: Game.width() / 2, y: Game.height() / 2, z: 1, w: kMovemanWidth, h: kMovemanHeight })
                  .collision();

    moveman.sprite(0, 0, 16, 32);
    moveman.dirX = 1;
    moveman.dirY = 0;

    moveman.bind("EnterFrame",
        function()
        {
            if (this.x < 0)
            {
                this.x = 0;
            }
            if (this.x > Game.width() - this.w)
            {
                this.x = Game.width() - this.w;
            }
        });

    moveman.delay(function()
        {
            var x = kTileWidth * this.dirX;
            var y = kTileHeight * this.dirY;
            this.shift(x, y);
            var translatedX = this.x - this.w / 2;
            var translatedY = this.y + kTileHeight / 2; 
            var enterTile = GetTileAt(currentLevel, translatedX, translatedY);
            if (enterTile && enterTile.logic)
            {
                enterTile.logic.OnEnter(enterTile, this);
            }
        }, 1000, -1);

    currentLevel = LoadLevel(levels[0], moveman);
});