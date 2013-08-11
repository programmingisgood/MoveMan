
function InitUI(level)
{
	var offsetX = level.offsetX;
	var offsetY = level.offsetY;
	var width = level.width * level.tileWidth;
	var height = level.height * level.tileHeight;

	var elements = { };

	var x = offsetX;
	var y = offsetY + height + 4;
	var commandBox = Crafty.e("2D, Canvas, Color")
                    .attr({ x: x, y: y, z: 0, w: width, h: 48 })
                    .color("DDDDDD");
    elements.commandBox = commandBox;

    var commandText = Crafty.e("2D, Canvas, Text, TextEntry")
    				  .attr({ x: x + 10, y: y + 4, z: 1, w: width - 20, h: 40 })
    				  .text("Start typing...")
                      .textColor('#555555');
    elements.commandText = commandText;

	return elements;
}