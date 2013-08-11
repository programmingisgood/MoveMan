
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
        this.offsetX = 0;
        this.offsetY = 0;
    },

    grid: function(offsetX, offsetY, gridWidth, gridHeight, tileWidth, tileHeight)
    {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    },

    setGridPos: function(tileX, tileY)
    {
        this.gridX = tileX;
        this.gridY = tileY;

        var newX = tileX * this.tileWidth + this.w / 2;
        var newY = tileY * this.tileHeight - this.tileHeight / 2
        this.attr({ x: newX + this.offsetX, y: newY + this.offsetY });
    },

    getGridPos: function()
    {
        return new Crafty.math.Vector2D(this.gridX, this.gridY);
    }
});

Crafty.c("TextEntry",
{
    init: function()
    {
        this.requires("Text");

        this.bind("KeyDown", this._keydown);
        this.textEntryData = "";
    },

    _keydown: function(e)
    {
        var code = e.keyCode;
        if (code == Crafty.keys.BACKSPACE)
        {
            //this.textEntryData
        }
        else if (code == Crafty.keys.ENTER)
        {
            this.trigger("OnTextEntered", this.textEntryData);
            this.textEntryData = "";
            return;
        }
        this.textEntryData += String.fromCharCode(code);
        this.text(this.textEntryData);
    }
})