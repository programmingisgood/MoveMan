
Crafty.c("Grid",
{
    init: function()
    {
        this.requires("2D");
        this.gridX = 0;
        this.gridY = 0;
        this.gridWidth = 0;
        this.gridHeight = 0;
        this.tileWidth = 0;
        this.tileHeight = 0;
    },

    grid: function(gridWidth, gridHeight, tileWidth, tileHeight)
    {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    },

    setGridPos: function(tileX, tileY)
    {
        this.gridX = tileX;
        this.gridY = tileY;

    }
});