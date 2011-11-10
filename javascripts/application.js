Array.prototype.max = function() {
  return Math.max.apply(null, this)
}

Array.prototype.min = function() {
  return Math.min.apply(null, this)
}

var Plot = function(c_id, ctxt){
	var c=document.getElementById(c_id);
	var ctx=c.getContext(ctxt);
	var data = {
							x: new Array(86280,86281,86282,86283,86284,86285,86286,86287,86288,86289,86290,86291,86292,86293,86294,
												 86295,86296,86297,86298,86299,86300,86301,86302,86303,86304,86305,86306,86307,86308,86309,
												 86310,86311,86312,86313,86314,86315,86316,86317,86318,86319,86320,86321,86322,86323,86324,
												 86325,86326,86327,86328,86329,86330,86331,86332,86333,86334,86335,86336,86337,86338,86339,
												 86340,86341,86342,86343,86344,86345,86346,86347,86348,86349,86350,86351,86352,86353,86354,
												 86355,86356,86357,86358,86359,86360,86361,86362,86363,86364,86365,86366,86367,86368,86369,
												 86370,86371,86372,86373,86374,86375,86376,86377,86378,86379,86380,86381,86382,86383,86384,
												 86385,86386,86387,86388,86389,86390,86391,86392,86393,86394,86395,86396,86397,86398,86399),
						  y: new Array(-1806.92,-1827.01,-1896.62,-1878.67,-1843.98,-1835.31,-1843.42,-1874.23,-1847.22,
												 -1855.47,-1867.72,-1879.07,-1832.14,-1814.57,-1842.32,-1889.89,-1898.01,-1847.13,
												 -1809.69,-1853.29,-1867.17,-1848.38,-1857.48,-1870.60,-1869.38,-1843.72,-1840.92,
												 -1866.35,-1817.16,-1832.93,-1919.94,-1896.82,-1818.81,-1780.84,-1868.33,-1915.07,
											   -1876.67,-1804.75,-1848.78,-1877.69,-1866.27,-1861.99,-1832.95,-1819.16,-1876.57,
												 -1909.63,-1846.47,-1810.32,-1827.43,-1899.56,-1881.22,-1809.57,-1849.66,-1893.06,
												 -1869.54,-1804.62,-1819.23,-1894.19,-1918.28,-1836.60,-1802.32,-1852.75,-1854.56,
												 -1878.26,-1870.96,-1834.58,-1866.51,-1857.34,-1843.65,-1844.47,-1826.54,-1898.73,
												 -1908.95,-1836.31,-1774.54,-1867.23,-1910.71,-1848.88,-1836.43,-1848.57,-1851.71,
												 -1864.42,-1876.53,-1851.40,-1812.46,-1854.14,-1876.97,-1888.53,-1856.52,-1816.84,
												 -1814.70,-1897.19,-1910.08,-1840.82,-1772.87,-1827.15,-1914.89,-1891.12,-1850.19,
												 -1817.14,-1827.00,-1853.79,-1873.57,-1896.60,-1878.83,-1797.19,-1799.25,-1881.14,
												 -1921.42,-1878.71,-1832.98,-1789.95,-1831.76,-1918.94,-1892.85,-1815.42,-1836.75,
												 -1884.32,-1846.47,-1829.37),
						  length: function(){
						 		if(this.x.length == this.y.length)
						 			return this.x.length
						 		else
						 			throw new Error("x and y arrays are not equal length");
						 	}
						}

	this.drawBoard = function(style){
		switch(style)
		{
			case "inset":
				ctx.fillStyle="#CCCCCC";
				ctx.fillRect(0,0,c.width,c.height);
				ctx.save();
				
				
				margin = {t:20,r:20,b:30,l:20}
				p_width = c.width-margin.r-margin.l;
				p_height = c.height-margin.t-margin.b;
				inset_width = 3;
				
				// draw plot area and inset
				ctx.translate(margin.l,margin.t);
				ctx.fillStyle="#EEEEEE";
				ctx.fillRect(0,0,p_width,p_height);
				ctx.fillStyle="#444444";
				ctx.beginPath();
				ctx.moveTo(0,p_height);
				ctx.lineTo(0,0);
				ctx.lineTo(p_width,0);
				ctx.lineTo(p_width-inset_width,inset_width);
				ctx.lineTo(inset_width,inset_width);
				ctx.lineTo(inset_width,p_height-inset_width);
				ctx.closePath();
				ctx.fill();
				break;
			case "flat":
				break;
			default:
				throw new Error("drawBoard(): Uknown drawBoard style");
				break;
		}
		return {translate:{x:margin.l+inset_width, y:margin.t+inset_width}, dims:{w:p_width-inset_width, h:p_height-inset_width}};
	};
	
	this.plotData = function(dat){
		ctx.fillStyle="Black"
		ctx.fillText("Time", 210, 310);
		ctx.fillText("23:58:00", 0, 291);
		ctx.fillText("24:59:59", 410, 291);

		x_min = data.x.min();
		x_max = data.x.max();
		y_min = data.y.min();
		y_max = data.y.max();
		ctx.save();
		ctx.translate(5,3);
		ctx.strokeStyle="#336633";
		ctx.beginPath();
		for(i=0;i<data.length();i++)
		{
			x = (data.x[i]-x_min)*(440/(x_max - x_min));
			y = (data.y[i]-y_max)*(-275/(y_max - y_min));		
			if(i==0){
				ctx.moveTo(x,y);
				continue;
			}
			ctx.lineTo(x,y);
		}
		ctx.stroke();
		
		ctx.restore();
		ctx.rotate(-Math.PI/2);
		ctx.fillStyle="#336633";
		ctx.fillText("uGals", -30, -1);
	}

}
