
Crafty.c("DestroyOnCollision",
{
    init: function()
    {
        this.requires("2D", "Collision");
        var self = this;
        this.onHit("Collision",
	        function(hitEnts)
	        {
                self.trigger("CollisionDestroy");
	            self.destroy();
	        });
    }
});