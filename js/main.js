
//画板对象
var drawBoard = {

	//定义全局对象
	gloaObj : {

		W : document.documentElement.clientWidth,
		H : document.documentElement.clientHeight,
		CTX : null,
		DATA : [],	//储存绘制数据
		COLOR : '#f00056',
		LINE : 5
	},

	//初始化
	init : function(){

		//显示画板
		this.showBoard();
		//默认画笔功能
		this.drawPen();
		//下滑菜单
		this.slideMenu();
		//菜单功能选择
		this.menuOption();
		//颜色选择
		this.selectColor();
		//粗细选择
		this.selectLine();
	},

	//显示画板
	showBoard : function(){

		var menu = document.getElementById('menu');
		var canvas = document.getElementById('canvas');
		drawBoard.gloaObj.CTX = canvas.getContext('2d');

		canvas.style.display = 'block';
		canvas.width = this.gloaObj.W;
		canvas.height = this.gloaObj.H;		
	
		menu.style.display = 'block';

		//取消菜单上的冒泡
		menu.onmousedown = function(ev){

			var ev = ev||event;
			ev.cancelBubble = true;
		};
	},

	//画笔功能
	drawPen : function(){

		document.onmousedown = function(ev){

			var ev = ev||event;
			var sx = ev.clientX;
			var sy = ev.clientY;

			document.onmousemove = function(ev){

				var ev = ev||event;
				var ex = ev.clientX;
				var ey = ev.clientY;
				var n = drawBoard.gloaObj.DATA.length;

				drawBoard.gloaObj.DATA[n] = new Object();
				//为画笔绘制的对象定义属性'point-line'
				//将该对象存入绘制数据中
				drawBoard.gloaObj.DATA[n].attr = 'point-line';
				drawBoard.gloaObj.DATA[n].sx = sx;
				drawBoard.gloaObj.DATA[n].sy = sy;
				drawBoard.gloaObj.DATA[n].ex = ex;
				drawBoard.gloaObj.DATA[n].ey = ey;
				drawBoard.gloaObj.DATA[n].w = drawBoard.gloaObj.LINE;
				drawBoard.gloaObj.DATA[n].c = drawBoard.gloaObj.COLOR;
				//直接绘制
				drawBoard.gloaObj.CTX.beginPath();
				drawBoard.gloaObj.CTX.moveTo(sx,sy);
				drawBoard.gloaObj.CTX.lineTo(ex,ey);
				drawBoard.gloaObj.CTX.closePath();
				drawBoard.gloaObj.CTX.strokeStyle = drawBoard.gloaObj.COLOR;
				drawBoard.gloaObj.CTX.lineJoin = 'round';
				drawBoard.gloaObj.CTX.lineCap = 'round';
				drawBoard.gloaObj.CTX.lineWidth = drawBoard.gloaObj.LINE;
				drawBoard.gloaObj.CTX.stroke();
				sx = ex;
				sy = ey;
			};

			document.onmouseup = function(){

				document.onmousemove = '';
			};

			return false;
		};
	},

	//直线绘制
	drawLine : function(){

		document.onmousedown = function(ev){

			var ev = ev||event;
			var sx = ev.clientX;
			var sy = ev.clientY;
			var n = drawBoard.gloaObj.DATA.length;

			document.onmousemove = function(ev){

				var ev = ev||event;
				var ex = ev.clientX;
				var ey = ev.clientY;

				drawBoard.gloaObj.DATA[n] = new Object();
				drawBoard.gloaObj.DATA[n].attr = 'line';
				drawBoard.gloaObj.DATA[n].sx = sx;
				drawBoard.gloaObj.DATA[n].sy = sy;
				drawBoard.gloaObj.DATA[n].ex = ex;
				drawBoard.gloaObj.DATA[n].ey = ey;
				drawBoard.gloaObj.DATA[n].w = drawBoard.gloaObj.LINE;
				drawBoard.gloaObj.DATA[n].c = drawBoard.gloaObj.COLOR;

				//直线绘制时、时时渲染
				drawBoard.render();
			}

			document.onmouseup = function(){

				document.onmousemove = '';
			};
			return false;
		};
	},

	//圆形绘制
	drawCircle : function(){

		document.onmousedown = function(ev){

			var ev = ev||event;
			var sx = ev.clientX;
			var sy = ev.clientY;
			var n = drawBoard.gloaObj.DATA.length;

			document.onmousemove = function(ev){

				var ev = ev||event;
				var ex = ev.clientX;
				var ey = ev.clientY;

				var cx = ex - sx;
				var cy = ey - sy;

				var R = Math.sqrt(cx*cx + cy*cy)/2;

				drawBoard.gloaObj.DATA[n] = new Object();
				drawBoard.gloaObj.DATA[n].attr = 'circle';
				drawBoard.gloaObj.DATA[n].x = cx/2 + sx;
				drawBoard.gloaObj.DATA[n].y = cy/2 + sy;
				drawBoard.gloaObj.DATA[n].r = R;
				drawBoard.gloaObj.DATA[n].c = drawBoard.gloaObj.COLOR;

				drawBoard.render();
			};

			document.onmouseup = function(){

				document.onmousemove = '';
			};
			return false;
		};
	},

	//矩形绘制
	drawRect : function(){

		document.onmousedown = function(ev){

			var ev = ev||event;
			var sx = ev.clientX;
			var sy = ev.clientY;
			var n = drawBoard.gloaObj.DATA.length;

			document.onmousemove = function(ev){

				var ev = ev||event;
				var ex = ev.clientX;
				var ey = ev.clientY;

				var cx = ex - sx;
				var cy = ey - sy;

				drawBoard.gloaObj.DATA[n] = new Object();
				drawBoard.gloaObj.DATA[n].attr = 'rect';
				drawBoard.gloaObj.DATA[n].x = sx;
				drawBoard.gloaObj.DATA[n].y = sy;
				drawBoard.gloaObj.DATA[n].w = cx;
				drawBoard.gloaObj.DATA[n].h = cy;
				drawBoard.gloaObj.DATA[n].c = drawBoard.gloaObj.COLOR;

				drawBoard.render();
			};

			document.onmouseup = function(){

				document.onmousemove = '';
			};

			return false;
		};
	},

	//橡皮擦功能
	eraser : function(){

		document.onmousedown = function(){

			document.onmousemove = function(ev){

				var ev = ev||event;
				var ex = ev.clientX;
				var ey = ev.clientY;
				var n = drawBoard.gloaObj.DATA.length;

				drawBoard.gloaObj.DATA[n] = new Object();
				//为橡皮擦绘制的方块定义属性 'clear-rect'
				drawBoard.gloaObj.DATA[n].attr = 'clear-rect';
				drawBoard.gloaObj.DATA[n].x = ex-15;
				drawBoard.gloaObj.DATA[n].y = ey-15;
				//橡皮擦固定宽高
				drawBoard.gloaObj.DATA[n].w = 30;
				drawBoard.gloaObj.DATA[n].h = 30;
				drawBoard.gloaObj.DATA[n].c = '#fff';
				drawBoard.gloaObj.CTX.fillStyle = '#fff';
				drawBoard.gloaObj.CTX.beginPath();
				drawBoard.gloaObj.CTX.fillRect(ex-15,ey-15,30,30);
				drawBoard.gloaObj.CTX.closePath();
				drawBoard.gloaObj.CTX.fill();

			};
			document.onmouseup = function(){

				document.onmousemove = '';
			};

			return false;
		};
	},

	//渲染图像
	render : function(){

		//清空画布
		drawBoard.gloaObj.CTX.clearRect(0,0,this.gloaObj.W,this.gloaObj.H);

		for(var i=0; i<drawBoard.gloaObj.DATA.length; i++){

			switch(drawBoard.gloaObj.DATA[i].attr){

				//橡皮擦、矩形按下列规则绘制
				case 'clear-rect':
				case 'rect':

					drawBoard.gloaObj.CTX.fillStyle = drawBoard.gloaObj.DATA[i].c;
					drawBoard.gloaObj.CTX.beginPath();
					drawBoard.gloaObj.CTX.fillRect(drawBoard.gloaObj.DATA[i].x,drawBoard.gloaObj.DATA[i].y,drawBoard.gloaObj.DATA[i].w,drawBoard.gloaObj.DATA[i].h);
					drawBoard.gloaObj.CTX.closePath();
					drawBoard.gloaObj.CTX.fill();
					break;

				case 'circle':

					drawBoard.gloaObj.CTX.beginPath();
					drawBoard.gloaObj.CTX.arc(drawBoard.gloaObj.DATA[i].x,drawBoard.gloaObj.DATA[i].y,drawBoard.gloaObj.DATA[i].r,0,2*Math.PI,false);
					drawBoard.gloaObj.CTX.closePath();
					drawBoard.gloaObj.CTX.fillStyle = drawBoard.gloaObj.DATA[i].c;
					drawBoard.gloaObj.CTX.fill();
					break;

				//画笔、直线按下列规则绘制
				case 'point-line':
				case 'line':

					drawBoard.gloaObj.CTX.beginPath();
					drawBoard.gloaObj.CTX.moveTo(drawBoard.gloaObj.DATA[i].sx,drawBoard.gloaObj.DATA[i].sy);
					drawBoard.gloaObj.CTX.lineTo(drawBoard.gloaObj.DATA[i].ex,drawBoard.gloaObj.DATA[i].ey);
					drawBoard.gloaObj.CTX.closePath();
					drawBoard.gloaObj.CTX.lineJoin = 'round';
					drawBoard.gloaObj.CTX.lineCap = 'round';
					drawBoard.gloaObj.CTX.strokeStyle = drawBoard.gloaObj.DATA[i].c;
					drawBoard.gloaObj.CTX.lineWidth = drawBoard.gloaObj.DATA[i].w;
					drawBoard.gloaObj.CTX.stroke();
					break;
			}
		}
	},

	//选择颜色
	selectColor : function(){

		var bar = document.getElementById('sidebar');
		var barColorLi = document.querySelectorAll('.sidebar-color li');
		var arrColor = ['#f00056','#fff','#faff72','#44cef6','#00bc12','#ffa400','#000'];

		for(var i=0; i<barColorLi.length; i++){

			barColorLi[i].index = i;
			barColorLi[i].style.background = arrColor[i];

			barColorLi[i].onclick = function(){

				drawBoard.gloaObj.COLOR = arrColor[this.index];
				bar.style.right = '-230px';
			};
		}
	},

	//选择线条粗细
	selectLine : function(){

		var bar = document.getElementById('sidebar');
		var barDrawLi = document.querySelectorAll('.sidebar-draw li');
		var arrLine = [3,6,9,12,15,20];

		for(var i=0; i<barDrawLi.length; i++){

			barDrawLi[i].index = i;
			barDrawLi[i].onclick = function(){

				drawBoard.gloaObj.LINE = arrLine[this.index];
				bar.style.right = '-230px';
			};
		}
	},

	//下滑菜单
	slideMenu : function(){

		var menu = document.getElementById('menu');

		menu.onmouseover = function(){

			this.style.top = '0';
		};
		menu.onmouseout = function(){

			this.style.top = '-400px';
		};
	},

	//菜单功能选择
	menuOption : function(){

		var menu = document.getElementById('menu');
		var item = menu.getElementsByTagName('li');
		var bar = document.getElementById('sidebar');
		var barDraw = bar.querySelector('.sidebar-draw');
		var barColor = bar.querySelector('.sidebar-color');

		//画笔工具
		item[0].onclick = function(ev){

			drawBoard.drawPen();
		};
		//直线工具
		item[1].onclick = function(){

			drawBoard.drawLine();
		};
		//圆形工具
		item[2].onclick = function(){

			drawBoard.drawCircle();
		};
		//矩形工具
		item[3].onclick = function(){

			drawBoard.drawRect();
		};
		//粗细工具
		item[4].onclick = function(){

			barColor.style.display = 'none';
			barDraw.style.display = 'block';
			bar.style.right = 0;
		};
		//颜色工具
		item[5].onclick = function(){

			barColor.style.display = 'block';
			barDraw.style.display = 'none';
			bar.style.right = 0;
		};
		item[6].onclick = function(){

			drawBoard.eraser();
		};
		item[7].onclick = function(){

			alert('撤退功能开发中...')
		};
	}

};//画板对象



//撤回功能 重新加算法！！！！算法有问题
// item[7].onclick = function(){

// 	if(drawBoard.gloaObj.DATA.length!=0){

// 		if(drawBoard.gloaObj.DATA[drawBoard.gloaObj.DATA.length-1].attr=='drawBoard.gloaObj.LINE'){

// 			for(var i=drawBoard.gloaObj.DATA.length-2; i>0; i--){

// 				if(drawBoard.gloaObj.DATA[i].attr!='drawBoard.gloaObj.LINE'){

// 					drawBoard.gloaObj.DATA = drawBoard.gloaObj.DATA.slice(0,i+1);
// 					break;
// 				}
// 			}
// 		}else{

// 			drawBoard.gloaObj.DATA.pop();
// 		}
// 		drawBoard.render();
// 	}
// };


