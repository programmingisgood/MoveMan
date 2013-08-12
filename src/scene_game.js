
var gameGraphics = [ "assets/moveman.png", "assets/tile_blank.png", "assets/tile_start.png", "assets/tile_arrow.png", "assets/tile_exit.png",
                     "assets/spider.png" ];
var tileGraphics = { B: "assets/tile_blank.png", S: "assets/tile_start.png", A: "assets/tile_arrow.png", E: "assets/tile_exit.png" };

var kTileLogics = { }
kTileLogics.A = {
    OnEnter: function(level, tile, ent) {
        if (ent.has("moveman"))
        {
            ent.SetDir(tile.dirX, tile.dirY);
        }
    },
    OnCommand: function(level, tile, command) {
        if (command == "left")
        {
            tile.dirX = -1;
            tile.dirY = 0;
            tile.rotation = -90;
        }
        else if (command == "right")
        {
            tile.dirX = 1;
            tile.dirY = 0;
            tile.rotation = 90;
        }
        else if (command == "up")
        {
            tile.dirX = 0;
            tile.dirY = -1;
            tile.rotation = 0;
        }
        else if (command == "down")
        {
            tile.dirX = 0;
            tile.dirY = 1;
            tile.rotation = 180;
        }
    },
    OnHints: function(level, tile) {
        return "up, down, left, right";
    } };

kTileLogics.E = {
    OnEnter: function(level, tile, ent) {
        if (ent.has("moveman"))
        {
            LoadLevel(level.index + 1);
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

function GetTile(tileX, tileY)
{
    return this.tiles[tileY * this.height + tileX];
}

function GetTileAt(level, x, y)
{
    var atTileX = Math.floor((x - level.offsetX) / kTileWidth);
    var atTileY = Math.floor((y - level.offsetY) / kTileHeight);
    var numDown = level.height;
    return level.tiles[numDown * atTileY + atTileX];
}

function ParseLevel(level, moveman)
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
        var tile = Crafty.e("2D, Canvas, Image, Tint")
                   .attr({ x: x, y: y, z: 0, w: kTileWidth, h: kTileHeight })
                   .image(tileGraphics[tileType])
                   .origin("center");

        tile.logic = kTileLogics[tileType];
        tile.gridX = t % width;
        tile.gridY = Math.floor(t / width);
        if (tileType == "S")
        {
            moveman.setGridPos(tile.gridX, tile.gridY);
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
    return { width: level.width, height: level.height,
             offsetX: offsetX, offsetY: offsetY, tiles: tiles,
             tileWidth: kTileWidth, tileHeight: kTileHeight,
             GetTile: GetTile };
}

function SpawnEntities(ents, level)
{
    /*for (var e = 0; e < ents.length; e++)
    {
        var entData = ents[e];
        var ent = Crafty.e("2D, Canvas, Delay, Grid, Image")
                           .attr({ x: 0, y: 0, z: 1 })
                           .image("assets/" + entData.type + ".png");

        ent.grid(level.offsetX, level.offsetY, level.width, level.height, kTileWidth, kTileHeight)
        ent.setGridPos(entData.x, entData.y);
    }*/
}

function LoadLevel(levelIndex)
{
    var ents = Crafty("*");
    for (var i = 0; i < ents.length; i++)
    {
        Crafty(ents[i]).destroy();
    }

    var currentLevel = null;

    var moveman = Crafty.e("2D, Canvas, Collision, Delay, Grid, moveman")
                  .attr({ x: Game.width() / 2, y: Game.height() / 2, z: 1, w: kMovemanWidth, h: kMovemanHeight })
                  .collision();

    moveman.SetDir = function(dirX, dirY)
    {
        if (dirY == 1)
        {
            this.sprite(0, 0, kMovemanWidth, kMovemanHeight);
        }
        else if (dirY == -1)
        {
            this.sprite(kMovemanWidth, 0, kMovemanWidth, kMovemanHeight);
        }
        else if (dirX == 1)
        {
            this.sprite(kMovemanWidth * 2, 0, kMovemanWidth, kMovemanHeight);
        }
        else if (dirX == -1)
        {
            this.sprite(kMovemanWidth * 3, 0, kMovemanWidth, kMovemanHeight);
        }
        this.dirX = dirX;
        this.dirY = dirY;
    }
    moveman.SetDir(1, 0);

    moveman.bind("EnterFrame",
        function()
        {
            var gridPos = this.getGridPos();
            if (gridPos.x < 0 || gridPos.x >= currentLevel.width)
            {
                LoadLevel(currentLevel.index);
            }
            else if (gridPos.y < 0 || gridPos.y >= currentLevel.height)
            {
                LoadLevel(currentLevel.index);
            }
        });

    moveman.delay(function()
        {
            var gridPos = this.getGridPos();
            gridPos.x += this.dirX;
            gridPos.y += this.dirY;
            this.setGridPos(gridPos.x, gridPos.y);
            var enterTile = currentLevel.GetTile(gridPos.x, gridPos.y);
            if (enterTile && enterTile.logic)
            {
                enterTile.logic.OnEnter(currentLevel, enterTile, this);
            }
        }, 2000, -1);

    if (!levels[levelIndex])
    {
        levelIndex = 0;
    }
    currentLevel = ParseLevel(levels[levelIndex], moveman);
    SpawnEntities(levels[levelIndex].ents, currentLevel);
    currentLevel.index = levelIndex;
    GenerateCoordLabels(currentLevel);
    InitUI(currentLevel);
}

function GenerateCoordLabels(level)
{
    level.labels = new Array();
    var x = level.offsetX;
    var y = level.offsetY;

    var characters = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P" ];
    for (var i = 0; i < level.width; i++)
    {
        var label = Crafty.e("2D, Canvas, Text")
                    .attr({ x: x + kTileWidth / 2, y: y - 4 })
                    .text(characters[i])
                    .textColor('#FFFFFF');
        level.labels.push(label);
        x += kTileWidth;
    }

    x = level.offsetX;
    var number = 1;
    for (var i = 0; i < level.height; i++)
    {
        var label = Crafty.e("2D, Canvas, Text")
                    .attr({ x: x - 14, y: y + kTileHeight / 2 })
                    .text(number)
                    .textColor('#FFFFFF');
        level.labels.push(label);
        y += kTileHeight;
        number++;
    }
}

Crafty.scene('Game', function()
{
    Crafty.background("rgb(80, 80, 80)");

    Crafty.load(gameGraphics, function() {

        Crafty.sprite("assets/moveman.png", { moveman: [ 0, 0, 64, 32 ] } );

        LoadLevel(0);

    });
});