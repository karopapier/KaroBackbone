/**
 * Map object
 */
function Map()
{
}

Map.prototype.hydrate=function(data)
{
	for (var prop in data) {
		this[prop]=data[prop];
	}
}

Map.prototype.code2matrix=function()
{
	this.matrix=[];
	var lines=this.mapcode.split('\n');
	this.rowCount=lines.length;
	for (var l=0;l<this.rowCount;l++) {
		var line=lines[l];
		this.matrix[l]=[];
		var chars=line.split('');
		this.colCount=chars.length;
		for (var c=0;c<this.colCount;c++) {
			this.matrix[l][c]=line[c];
		}
	}
}

Map.prototype.render=function()
{
	this.mapImage=new MapImage(this);
	this.mapImage.size=gv.size;
	this.mapImage.border=gv.border;
	if (typeof this.matrix == "undefined") {
		this.code2matrix();
	}
	this.mapImage.render($('#map'));
}
