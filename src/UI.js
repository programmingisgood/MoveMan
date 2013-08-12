
function ParseRow(command)
{
    if (command && command.length > 0)
    {
        var splitCommand = command.split(" ");
        var coordStr = splitCommand[0];
        var row = coordStr.match(/\d+\.?\d*/g);
        row = parseInt(row);
        if (row)
        {
            return row - 1;
        }
    }
    return undefined;
}

function ParseCol(command)
{
    if (command && command.length > 0)
    {
        var splitCommand = command.split(" ");
        var coordStr = splitCommand[0];
        var col = coordStr.match(/[A-z]/g);
        if (col)
        {
            col = col[0];
            col.toLowerCase()
            col = col.charCodeAt(0) - 97;
            return col
        }
    }
    return undefined;
}

function ParseCoord(command)
{
    var row = ParseRow(command);
    var col = ParseCol(command);
    if (row != undefined && col != undefined)
    {
        return { row: row, col: col };
    }
    return undefined;
}

function ParseAction(command)
{
    var splitCommand = command.split(" ");
    return splitCommand[1];
}

function ProcessCommand(command, level)
{
    var coord = ParseCoord(command);
    var action = ParseAction(command);

    if (coord && action)
    {
        var tile = level.GetTile(coord.col, coord.row);
        if (tile && tile.logic && tile.logic.OnCommand)
        {
            tile.logic.OnCommand(level, tile, action);
        }
    }
}

function ClearRowColHighlights(level)
{
    for (var i = 0; i < level.tiles.length; i++)
    {
        level.tiles[i].tint("#000000", 0.0);
    }
}

function SyntaxHighlight(command, level)
{
    ClearRowColHighlights(level);

    var row = ParseRow(command);
    for (var i = 0; i < level.tiles.length; i++)
    {
        var tile = level.tiles[i];
        if (tile.gridY == row)
        {
            level.tiles[i].tint("#00FF00", 0.5);
        }
    }

    var col = ParseCol(command);
    for (var i = 0; i < level.tiles.length; i++)
    {
        var tile = level.tiles[i];
        if (tile.gridX == col)
        {
            level.tiles[i].tint("#00FF00", 0.5);
        }
    }

    if (row != undefined && col != undefined)
    {
        var tile = level.GetTile(col, row);
        if (tile && tile.logic && tile.logic.OnHints)
        {
            var hints = tile.logic.OnHints(level, tile);
            $("#hints").val(hints);
        }
    }
}

function InitUI(level)
{
    $("#commands").focus(function()
    {
        if ($(this).val() == $(this).attr("title"))
        {
            $(this).val("");
        }
    }).blur(function()
    {
        if ($(this).val() == "")
        {
            $(this).val($(this).attr("title"));
        }
    });

    $("#commands").unbind("keyup");
    $("#commands").keyup(function(e)
    {
        if (e.keyCode == 13)
        {
            ProcessCommand($("#commands").val(), level);
            $("#commands").val("");
            $("#hints").val("");
            ClearRowColHighlights(level);
        }
        else
        {
            $("#hints").val("");
            SyntaxHighlight($("#commands").val(), level);
        }
    });

    $("#commands").focus();

    $("#hints").val("");
}