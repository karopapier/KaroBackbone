var MapPalette={
	'road': "128,128,128",
	'roadspecle': "100,100,100",
	'offroad': "0,200,0",
	'offroadspecle': "0,180,0",
	'offroadsand': "230,230,115",
	'offroadsandspecle': "200,200,100",
	'offroadmud': "100,70,0",
	'offroadmudspecle': "90,60,0",
	'offroadmountain': "100,100,100",
	'offroadmountainspecle': "0,0,0",
	'offroadwater': "0,60,200",
	'offroadwaterspecle': "0,30,100",
	'start1': "200,200,200",
	'start2': "100,100,100",
	'finish1': "255,255,255",
	'finish2': "0,0,0",
	'checkpoint1': "000,102,255", //Checkpoint 1
	'checkpoint2': "000,100,200", //Checkpoint 2
	'checkpoint3': "000,255,102", //Checkpoint 3
	'checkpoint4': "000,200,000", //Checkpoint 4
	'checkpoint5': "255,255,000", //Checkpoint 5
	'checkpoint6': "200,200,000", //Checkpoint 6
	'checkpoint7': "255,000,000", //Checkpoint 7
	'checkpoint8': "200,000,000", //Checkpoint 8
	'checkpoint9': "255,000,255", //Checkpoint 9
	'checkpointBgOdd': "0,0,0",
	'checkpointBgEven': "255,255,255",
	'fog': "0,0,0",
	'fogspecle': "0,0,0",
	'parc': "200,200,200"
}
MapPalette['O']=MapPalette['road'];
MapPalette['Ospecle']=MapPalette['roadspecle'];
MapPalette['V']=MapPalette['offroadmountain'];
MapPalette['Vspecle']=MapPalette['offroadmountainspecle'];
MapPalette['W']=MapPalette['offroadwater'];
MapPalette['Wspecle']=MapPalette['offroadwaterspecle'];
MapPalette['X']=MapPalette['offroad'];
MapPalette['Xspecle']=MapPalette['offroadspecle'];
MapPalette['Y']=MapPalette['offroadsand'];
MapPalette['Yspecle']=MapPalette['offroadsandspecle'];
MapPalette['Z']=MapPalette['offroadmud'];
MapPalette['Zspecle']=MapPalette['offroadmudspecle'];
MapPalette['.']=MapPalette['fog'];
MapPalette['.specle']=MapPalette['fogspecle'];


function MapImage(map)
{
	this.map=map;
	this.size=12;
	this.border=1;
	//******* DEPENDENCY
        this.specles=gv.specles;
	this.borderfill=gv.borderfill;
}

MapImage.prototype.render=function(container)
{
	this.container=container;
	this.init();

	var img=new Image();
	//http://reloaded.karopapier.de/map/125.png?size=12&border=1
	img.src="http://reloaded.karopapier.de/map/"+this.map.id+".png?size="+this.size+"&border="+this.border;
	$(img).load(function(){
		$('#mapCanvas').remove();
		$('#map').append(img);
	});

	for (var r=0;r<this.map.rowCount;r++) {
		for (var c=0;c<this.map.colCount;c++) {
			this.drawField(r,c,this.map.matrix[r][c]);
		}
	}

}

MapImage.prototype.init=function()
{
	$(this.container).empty();
    if (this.size<=5) this.border=0;
	this.w=this.map.colCount*(this.size+this.border);
	this.h=this.map.rowCount*(this.size+this.border);
	this.canvas=document.createElement('canvas');
	this.canvas.setAttribute('id',"mapCanvas");
	this.canvas.setAttribute('height',this.h);
	this.canvas.setAttribute('width',this.w);
	this.canvas.style.position="absolute";
	this.canvas.style.top=0;
	this.canvas.style.left=0;
	//$('<canvas id="mapCanvas" height="'+this.h+'" width="'+this.w+'" style="position: absolute; top:0;left:0;"></canvas>');
	if (exCanvasLoaded ) {
		//this.canvas=G_vmlCanvasManager.initElement(this.canvas); 
		G_vmlCanvasManager.initElement(this.canvas); 
	}
	$(this.container).append(this.canvas);
	this.ctx=document.getElementById('mapCanvas').getContext("2d");
	if (this.map.id>=1000){
		this.ctx.fillStyle="rgb(0,0,0)";
	} else {
		this.ctx.fillStyle="rgb(0,180,0)";
	}
	this.ctx.beginPath();
	this.ctx.rect(0,0,this.w,this.h);
	this.ctx.fill();
}

function getRGB(field)
{
	return "rgb("+MapPalette[field]+")";
}

MapImage.prototype.drawField=function(r,c,field)
  {
    x=c*(this.size+this.border);
    y=r*(this.size+this.border);

    //faster than 1x1 rect
    //this.specle=this.ctx.getImageData(0,0,1,1);

    if ((field=="X") || (field=="Y") || (field=="Z") || (field=="O") || (field=="V") || (field=="W")  || (field=="."))
    {
      fillColor=getRGB(field);
      specleColor=getRGB(field+"specle");
	  this.drawStandardField(x, y, fillColor, specleColor);
    }

    //finish
    if (field=="F")
    {
      this.drawFlagField(x, y, getRGB('finish1'), getRGB('finish2'));
    }

    //checkpoint
    if ((parseInt(field)==field)) {
      //if (this.cpEnabled)
      if (1==1)
      {
        var fg=getRGB('checkpoint'+field);

        if (field%2)
        {
          var bg=getRGB('checkpointBgOdd');
        } else {
          var bg=getRGB('checkpointBgEven');
        }
        this.drawFlagField(x, y, fg, bg);
      } else {
        this.drawField(r, c, "O");
      }
    }

    //Start
    if (field=="S")
    {
      this.drawStartField(x,y,getRGB('start1'),getRGB('start2'));
    }

    //Parc ferme
    if (field=="P")
    {
      this.drawStandardField(x, y, getRGB('parc'), getRGB('roadspecle'),false); //no specles
    }
  }

MapImage.prototype.drawStandardField=function(x,y,fg,specle)
{
	this.ctx.fillStyle = fg;
	this.ctx.beginPath();
	this.ctx.rect(x,y,this.size,this.size);
	this.ctx.fill();

	//check optional param to force "no specles"
	var drawSpecles=this.specles;
	if (arguments[4]===false) {
		drawSpecles=false;
	}

	this.drawBorder(x,y,specle)
	if (drawSpecles) {
		this.ctx.fillStyle = specle;
		for (var i=0;i<this.size;i++) {
			this.ctx.beginPath();
			var xr=Math.round(Math.random()*(this.size-1));
			var yr=Math.round(Math.random()*(this.size-1));
			this.ctx.rect(x+xr,y+yr,1,1);
			this.ctx.fill();
		}
	}
}

MapImage.prototype.drawBorder=function(x,y,specle)
{
	if (this.borderfill) {
		this.ctx.lineWidth=this.border;
		this.ctx.strokeStyle = specle;
		this.ctx.beginPath();
		this.ctx.moveTo(x+this.size+.5,y);
		this.ctx.lineTo(x+this.size+.5,y+this.size+.5);
		this.ctx.lineTo(x,y+this.size+.5);
		this.ctx.stroke();
		this.ctx.closePath();
	}
}

MapImage.prototype.drawFlagField=function(x,y,c1,c2)
{
    this.ctx.fillStyle = c2;
    this.ctx.beginPath();
    this.ctx.rect(x,y,this.size,this.size);
    this.ctx.fill();

    var factor=Math.round(this.size/4);
    var sende=this.size/factor;

    for (var m=0;m<sende;m++) {
        for (var n=0;n<sende;n++) {
            if ((m+n)%2==1) {
                this.ctx.fillStyle = c1;
                this.ctx.beginPath();
                var xm=Math.round(x+m*factor);
                var yn=Math.round(y+n*factor);
                this.ctx.rect(xm,yn,factor,factor);
                this.ctx.fill();
            }
        }
    }
    this.drawBorder(x,y,getRGB('roadspecle'));
}

MapImage.prototype.drawStartField=function(x,y)
{
    this.ctx.fillStyle = getRGB('start2');
    this.ctx.beginPath();
    //this.ctx.rect(x,y,this.size,this.size); //instead of border make larger
    var newSize=this.size+this.border;
    this.ctx.rect(x,y,newSize,newSize);
    this.ctx.fill();

    //fg square
    this.ctx.strokeStyle = getRGB('start1');
    this.ctx.beginPath();
    this.ctx.rect(x+0.3*newSize,y+0.3*newSize,0.4*newSize,0.4*newSize);
    this.ctx.stroke();

    //imagerectangle($this->image, $x+0.3*$this->this.size, $y+0.3*$this->this.size, $x+0.7*($this->this.size+border), $y+0.7*($this->this.size+border), $c1);

    //add border
        //$this->drawBorder($x,$y,$this->MapPalette['roadspecle']);

}
