Game =
{
    width: function()
    {
        return 800;
    },
    
    height: function()
    {
        return 600;
    },
    
    start: function()
    {
        Crafty.init(Game.width(), Game.height());
        Crafty.background("rgb(255, 255, 255)");
        
        Crafty.scene("Game");
    }
}

$center_text_css = { 'text-align': 'center' }