
var gameGraphics = [ "assets/moveman.png", "assets/tile_blank.png", "assets/tile_start.png", "assets/tile_arrow.png" ];
var tileGraphics = { B: "assets/tile_blank.png", S: "assets/tile_start.png", A: "assets/tile_arrow.png" };

var kTileLogics = { }
kTileLogics.A = {
    OnEnter: function(tile, ent) {

        if (ent.has("moveman"))
        {
            ent.dirX = tile.dirX;
            ent.dirY = tile.dirY;
        }
    } };

function InitArrow(tile)
{
    tile.dirX = 0;
    tile.dirY = 0;
    var dirArray = [ "left", "right", "up", "down" ];

    tile.setDir = function(dirString)
    {
        if (dirString == "left")
        {
            this.dirX = -1;
            this.dirY = 0;
            this.rotation = -90;
        }
        else if (dirString == "right")
        {
            this.dirX = 1;
            this.dirY = 0;
            this.rotation = 90;
        }
        else if (dirString == "up")
        {
            this.dirX = 0;
            this.dirY = -1;
            this.rotation = 0;
        }
        else if (dirString == "down")
        {
            this.dirX = 0;
            this.dirY = 1;
            this.rotation = 180;
        }
    }
    tile.setDir(dirArray[Math.floor(Math.random() * dirArray.length)])
}

levels = new Array();

var kMovemanWidth = 16;
var kMovemanHeight = 32;
var kTileWidth = 32;
var kTileHeight = 32;

function GetTile(level, tileX, tileY)
{
    return level.tiles[tileY * level.height + tileX];
}

function GetTileAt(level, x, y)
{
    var atTileX = Math.floor((x - level.offsetX) / kTileWidth);
    var atTileY = Math.floor((y - level.offsetY) / kTileHeight);
    var numDown = level.height;
    return level.tiles[numDown * atTileY + atTileX];
}

function LoadLevel(level, moveman)
{
    var width = level.width;
    var height = level.height;
    var offsetX = Game.width() / 2 - width * kTileWidth / 2;
    var offsetY = Game.height() / 2 - height * kTileHeight / 2;
    var x = offsetX;
    var y = offsetY;
    moveman.grid(offsetX, offsetY, level.width, level.height, kTileWidth, kTileHeight);
    var tiles = new Array();
    for (var t = 0; t < level.tiles.length; t++)
    {
        var tileType = level.tiles[t];
        var tile = Crafty.e("2D, Canvas, Image")
                   .attr({ x: x, y: y, z: 0, w: kTileWidth, h: kTileHeight })
                   .image(tileGraphics[tileType])
                   .origin("center");

        tile.logic = kTileLogics[tileType];
        if (tileType == "S")
        {
            moveman.setGridPos(t % width, Math.floor(t / width));
        }
        else if (tileType == "A")
        {
            InitArrow(tile);
        }

        x += kTileWidth;
        if (t > 0 && (t + 1) % width == 0)
        {
            x = offsetX;
            y += kTileHeight;
        }
        tiles.push(tile);
    }
    return { width: level.width, height: level.height, offsetX: offsetX, offsetY: offsetY, tiles: tiles };
}

function GenerateCoordLabels(level)
{
    Crafty.e("2D, Canvas, Text")
    .attr({ x: 100, y: 100 })
    .text("A")
    .textColor('#FFFFFF');
}

Crafty.scene('Game', function()
{
    Crafty.background("rgb(80, 80, 80)");

    Crafty.load(gameGraphics);

    var currentLevel = null;

    Crafty.sprite("assets/moveman.png", { moveman: [ 0, 0, 64, 32 ] } );

    var moveman = Crafty.e("2D, Canvas, Collision, Delay, Grid, moveman")
                  .attr({ x: Game.width() / 2, y: Game.height() / 2, z: 1, w: kMovemanWidth, h: kMovemanHeight })
                  .collision();

    moveman.sprite(0, 0, kMovemanWidth, kMovemanHeight);
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
            var gridPos = this.getGridPos();
            gridPos.x += this.dirX;
            gridPos.y += this.dirY;
            this.setGridPos(gridPos.x, gridPos.y);
            var enterTile = GetTile(currentLevel, gridPos.x, gridPos.y);
            if (enterTile && enterTile.logic)
            {
                enterTile.logic.OnEnter(enterTile, this);
            }
        }, 1000, -1);

    currentLevel = LoadLevel(levels[0], moveman);
    GenerateCoordLabels(currentLevel);
});