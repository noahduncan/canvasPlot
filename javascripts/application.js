Array.prototype.max = function() {
  return Math.max.apply(null, this)
}

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

Array.prototype.first = function() {
	return this[0];
}

Array.prototype.last = function() {
	return this[this.length-1];
}

var Plot = function(c_id, ctxt){
	var self = this;
	var c=document.getElementById(c_id);
	var ctx=c.getContext(ctxt);
	var plotInfo = {};
	var data = {
							x: false,
						  y: false,
							t: false,
						  length: function(){
						 		if(this.x.length == this.y.length)
						 			return this.x.length
						 		else
						 			throw new Error("x and y arrays are not equal length");
						 	}
						}

	this.drawBoard = function(options){
		options = options || {};
		preset = options.preset || 'inset';
		margin = options.margin || {t:20,r:20,b:30,l:30};
		colors = options.colors || {bg:"#CCCCCC",plotArea:"#EEEEEE",axes:"#444444"};
		border = options.border || 3;
		switch(preset)
		{
			case "inset":
				ctx.save();
				ctx.fillStyle=colors.bg;
				ctx.fillRect(0,0,c.width,c.height);
				
				p_width = c.width-margin.r-margin.l;
				p_height = c.height-margin.t-margin.b;
				inset_width = border;  // TODO Figure out how to set this argument
				
				// draw plot area and inset
				ctx.translate(margin.l,margin.t);
				ctx.fillStyle=colors.plotArea;
				ctx.fillRect(0,0,p_width,p_height);
				ctx.fillStyle=colors.axes;
				ctx.beginPath();
				ctx.moveTo(0,p_height);
				ctx.lineTo(0,0);
				ctx.lineTo(p_width,0);
				ctx.lineTo(p_width-inset_width,inset_width);
				ctx.lineTo(inset_width,inset_width);
				ctx.lineTo(inset_width,p_height-inset_width);
				ctx.closePath();
				ctx.fill();
				ctx.restore(); // back to 0,0
				break;
			case "flat":
				break;
			default:
				throw new Error("drawBoard(): Uknown drawBoard style");
				break;
		}
		plotInfo={translate:{x:margin.l+inset_width, y:margin.t+inset_width}, dims:{w:p_width-inset_width*2, h:p_height-inset_width*2}};
		// TODO Add gridlines??
	}
		
	this.plotData = function(options){
		// TODO create workable interface between plotData and drawBoard (dims, insets, etc.)
		options = options || {};
		lineStyle = options.lineStyle || "#336633";
		
		ctx.fillStyle="Black"
		ctx.fillText("Time", c.width / 2 - 10, c.height - 2);
		ctx.translate(plotInfo.translate.x, plotInfo.translate.y);  // 
		ctx.save();
		ctx.fillText(data.t.first(), 0, plotInfo.dims.h + 12);
		ctx.fillText(data.t[Math.ceil(data.t.length/2)], (plotInfo.dims.w/2-20), plotInfo.dims.h + 12);
		ctx.fillText(data.t.last(), plotInfo.dims.w-40, plotInfo.dims.h + 12);
		
		x_min = data.x.min();
		x_max = data.x.max();
		y_min = data.y.min();
		y_max = data.y.max();
		
		// ctx.translate(5,3);
		ctx.strokeStyle=lineStyle;
		ctx.beginPath();
		for(i=0;i<data.length();i++)
		{
			x = (data.x[i]-x_min)*(plotInfo.dims.w/(x_max - x_min));
			y = (data.y[i]-y_max)*(-plotInfo.dims.h/(y_max - y_min));		
			if(i==0){
				ctx.moveTo(x,y);
				continue;
			}
			ctx.lineTo(x,y);
		}
		ctx.stroke();
		
		// ctx.restore();
		ctx.rotate(-Math.PI/2);
		ctx.fillStyle=lineStyle;
		ctx.fillText("uGals", -plotInfo.dims.h/2-15, -24);
		ctx.fillText(y_max,-y_max.toString().length*5,-4);
		ctx.fillText(y_min,-plotInfo.dims.h+3,-4);
		ctx.restore(); // back to 0,0
	}
	
	this.clearCanvas = function(){
		ctx.setTransform(1,0,0,1,0,0);
		ctx.clearRect(0,0,c.width,c.height);
	}
	
	this.updateData = function(){
		for(i=0;i<data.addTo_x.length;i++){
			data.x.shift();
			data.x.push(data.addTo_x[i]);
			data.y.shift();
			data.y.push(data.addTo_y[i]);
			data.t.shift();
			data.t.push(data.addTo_t[i]);
		}
		// data.addTo_x.delete();
		// data.addTo_y.delete();
	}
	
	this.retrieveData = function(url){
		data.x != false ? params="?since="+data.x.last() : params = "";
		var plotAjax = new Ajax.Request(url+params,{
			onFailure: function(response){
				throw new Error("retrieveData failed: " + response.status);
			},
			onSuccess: function(response){
				eval(response.responseText);
				self.clearCanvas();
				self.drawBoard();
				self.plotData();
			}
		});
	}
}
