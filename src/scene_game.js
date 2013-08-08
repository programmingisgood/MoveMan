
var gameGraphics = [ "assets/moveman.png", "assets/tile_blank.png", "assets/tile_start.png" ];
var tileGraphics = { B: "assets/tile_blank.png", S: "assets/tile_start.png" };
levels = new Array();

var kTileWidth = 32;
var kTileHeight = 32;

function LoadLevel(level, moveman)
{
    var width = level.width;
    var height = level.height;
    var x = 0;
    var y = 0;
    for (var t = 0; t < level.tiles.length; t++)
    {
        var tileType = level.tiles[t];
        var tile = Crafty.e("2D, Canvas, Image")
                   .attr({ x: x, y: y, z: 0, w: kTileWidth, h: kTileHeight })
                   .image(tileGraphics[tileType])

        if (tileType == "S")
        {
            moveman.attr({ x: x + moveman.w / 2, y: y - kTileHeight / 2});
        }

        x += kTileWidth;
        if (t > 0 && (t + 1) % width == 0)
        {
            x = 0;
            y += kTileHeight;
        }
    }
}

Crafty.scene('Game', function()
{
    Crafty.background("rgb(190, 190, 190)");

    Crafty.load(gameGraphics);

    Crafty.sprite("assets/moveman.png", { moveman: [ 0, 0, 64, 32 ] } );

    var moveman = Crafty.e("2D, Canvas, Collision, Delay, moveman")
                  .attr({ x: Game.width() / 2, y: Game.height() / 2, z: 1, w: 16, h: 32 })
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
        }, 1000, -1);

    LoadLevel(levels[0], moveman);
});