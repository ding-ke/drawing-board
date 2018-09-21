
//画板对象
var drawBoard = {

  //定义全局变量
  gloaObj: {

    W: document.documentElement.clientWidth,
    H: document.documentElement.clientHeight,
    CTX: null,
    DATA: [],	//储存绘制数据
    COLOR: '#f00056',
    LINE: 5,
    PENS: 0,
    ERAS: 0,
    TIMER: null
  },

  //初始化
  init: function () {

    //显示画板
    this.showBoard();
    //默认画笔功能
    this.drawPen();
    //菜单功能选择
    this.menuOption();
    //颜色选择
    this.selectColor();
    //粗细选择
    this.selectLine();
    //自定义菜单
    this.customMenu();
  },

  //显示画板
  showBoard: function () {

    var that = this;
    var menu = document.getElementById('menu');
    var btn = menu.getElementsByTagName('span')[8];
    var canvas = document.getElementById('canvas');
    drawBoard.gloaObj.CTX = canvas.getContext('2d');

    canvas.style.display = 'block';
    canvas.width = this.gloaObj.W;
    canvas.height = this.gloaObj.H;

    menu.style.display = 'block';

    //取消菜单上的冒泡
    menu.onmousedown = function (ev) {

      var ev = ev || event;
      ev.cancelBubble = true;
    };
    //菜单滑出
    setTimeout(function () {

      menu.style.top = '0';
      btn.className = 'glyphicon glyphicon-upload';
      that.showTip('欢迎使用画板！鼠标绘画哟～');
    }, 500);
  },

  //画笔功能
  drawPen: function () {

    var that = this;
    document.onmousedown = function (ev) {

      var ev = ev || event;
      var sx = ev.clientX;
      var sy = ev.clientY;
      that.gloaObj.PENS++;
      //画笔性能优化 每36ms取一个点
      var onOff = true;

      document.onmousemove = function (ev) {

        if (!onOff) return;
        onOff = false;
        setTimeout(function () {

          onOff = true;
        }, 36);
        var ev = ev || event;
        var ex = ev.clientX;
        var ey = ev.clientY;
        var n = that.gloaObj.DATA.length;

        that.gloaObj.DATA[n] = new Object();
        //为画笔绘制的对象定义属性'point-line'
        //将该对象存入绘制数据中
        that.gloaObj.DATA[n].attr = 'point-line';
        that.gloaObj.DATA[n].count = that.gloaObj.PENS;
        that.gloaObj.DATA[n].sx = sx;
        that.gloaObj.DATA[n].sy = sy;
        that.gloaObj.DATA[n].ex = ex;
        that.gloaObj.DATA[n].ey = ey;
        that.gloaObj.DATA[n].w = that.gloaObj.LINE;
        that.gloaObj.DATA[n].c = that.gloaObj.COLOR;
        //直接绘制
        that.gloaObj.CTX.beginPath();
        that.gloaObj.CTX.moveTo(sx, sy);
        that.gloaObj.CTX.lineTo(ex, ey);
        that.gloaObj.CTX.closePath();
        that.gloaObj.CTX.strokeStyle = that.gloaObj.COLOR;
        that.gloaObj.CTX.lineJoin = 'round';
        that.gloaObj.CTX.lineCap = 'round';
        that.gloaObj.CTX.lineWidth = that.gloaObj.LINE;
        that.gloaObj.CTX.stroke();
        sx = ex;
        sy = ey;
      };

      document.onmouseup = function () {

        document.onmousemove = '';
      };

      return false;
    };
  },

  //直线绘制
  drawLine: function () {

    document.onmousedown = function (ev) {

      var ev = ev || event;
      var sx = ev.clientX;
      var sy = ev.clientY;
      var n = drawBoard.gloaObj.DATA.length;

      document.onmousemove = function (ev) {

        var ev = ev || event;
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

      document.onmouseup = function () {

        document.onmousemove = '';
      };
      return false;
    };
  },

  //圆形绘制
  drawCircle: function () {

    document.onmousedown = function (ev) {

      var ev = ev || event;
      var sx = ev.clientX;
      var sy = ev.clientY;
      var n = drawBoard.gloaObj.DATA.length;

      document.onmousemove = function (ev) {

        var ev = ev || event;
        var ex = ev.clientX;
        var ey = ev.clientY;

        var cx = ex - sx;
        var cy = ey - sy;

        var R = Math.sqrt(cx * cx + cy * cy) / 2;

        drawBoard.gloaObj.DATA[n] = new Object();
        drawBoard.gloaObj.DATA[n].attr = 'circle';
        drawBoard.gloaObj.DATA[n].x = cx / 2 + sx;
        drawBoard.gloaObj.DATA[n].y = cy / 2 + sy;
        drawBoard.gloaObj.DATA[n].r = R;
        drawBoard.gloaObj.DATA[n].c = drawBoard.gloaObj.COLOR;

        drawBoard.render();
      };

      document.onmouseup = function () {

        document.onmousemove = '';
      };
      return false;
    };
  },

  //矩形绘制
  drawRect: function () {

    document.onmousedown = function (ev) {

      var ev = ev || event;
      var sx = ev.clientX;
      var sy = ev.clientY;
      var n = drawBoard.gloaObj.DATA.length;

      document.onmousemove = function (ev) {

        var ev = ev || event;
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

      document.onmouseup = function () {

        document.onmousemove = '';
      };

      return false;
    };
  },

  //橡皮擦功能
  eraser: function () {

    var that = this;
    document.onmousedown = function () {

      that.gloaObj.ERAS++;
      document.onmousemove = function (ev) {

        var ev = ev || event;
        var ex = ev.clientX;
        var ey = ev.clientY;
        var n = that.gloaObj.DATA.length;

        that.gloaObj.DATA[n] = new Object();
        //为橡皮擦绘制的方块定义属性 'clear-rect'
        that.gloaObj.DATA[n].attr = 'clear-rect';
        that.gloaObj.DATA[n].count = that.gloaObj.ERAS;
        that.gloaObj.DATA[n].x = ex - 15;
        that.gloaObj.DATA[n].y = ey - 15;
        //橡皮擦固定宽高
        that.gloaObj.DATA[n].w = 30;
        that.gloaObj.DATA[n].h = 30;
        that.gloaObj.DATA[n].c = '#fff';
        that.gloaObj.CTX.fillStyle = '#fff';
        that.gloaObj.CTX.beginPath();
        that.gloaObj.CTX.fillRect(ex - 15, ey - 15, 30, 30);
        that.gloaObj.CTX.closePath();
        that.gloaObj.CTX.fill();

      };
      document.onmouseup = function () {

        document.onmousemove = '';
      };

      return false;
    };
  },

  //渲染图像
  render: function () {

    //清空画布
    drawBoard.gloaObj.CTX.clearRect(0, 0, this.gloaObj.W, this.gloaObj.H);

    for (var i = 0; i < drawBoard.gloaObj.DATA.length; i++) {

      switch (drawBoard.gloaObj.DATA[i].attr) {

        //橡皮擦、矩形按下列规则绘制
        case 'clear-rect':
        case 'rect':

          drawBoard.gloaObj.CTX.fillStyle = drawBoard.gloaObj.DATA[i].c;
          drawBoard.gloaObj.CTX.beginPath();
          drawBoard.gloaObj.CTX.fillRect(drawBoard.gloaObj.DATA[i].x, drawBoard.gloaObj.DATA[i].y, drawBoard.gloaObj.DATA[i].w, drawBoard.gloaObj.DATA[i].h);
          drawBoard.gloaObj.CTX.closePath();
          drawBoard.gloaObj.CTX.fill();
          break;

        case 'circle':

          drawBoard.gloaObj.CTX.beginPath();
          drawBoard.gloaObj.CTX.arc(drawBoard.gloaObj.DATA[i].x, drawBoard.gloaObj.DATA[i].y, drawBoard.gloaObj.DATA[i].r, 0, 2 * Math.PI, false);
          drawBoard.gloaObj.CTX.closePath();
          drawBoard.gloaObj.CTX.fillStyle = drawBoard.gloaObj.DATA[i].c;
          drawBoard.gloaObj.CTX.fill();
          break;

        //画笔、直线按下列规则绘制
        case 'point-line':
        case 'line':

          drawBoard.gloaObj.CTX.beginPath();
          drawBoard.gloaObj.CTX.moveTo(drawBoard.gloaObj.DATA[i].sx, drawBoard.gloaObj.DATA[i].sy);
          drawBoard.gloaObj.CTX.lineTo(drawBoard.gloaObj.DATA[i].ex, drawBoard.gloaObj.DATA[i].ey);
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
  selectColor: function () {

    var that = this;
    var bar = document.getElementById('sidebar');
    var barColorLi = document.querySelectorAll('.sidebar-color li');
    var arrColor = ['#f00056', '#fff', '#faff72', '#44cef6', '#00bc12', '#ffa400', '#000'];

    //取消冒泡
    bar.onmousedown = function (ev) {

      var ev = ev || event;
      ev.cancelBubble = true;
    };
    for (var i = 0; i < barColorLi.length; i++) {

      barColorLi[i].index = i;
      barColorLi[i].style.background = arrColor[i];

      barColorLi[i].onclick = function () {

        that.showTip('你重新选择了颜色！');
        that.gloaObj.COLOR = arrColor[this.index];
        bar.style.right = '-230px';
      };
    }
  },

  //选择线条粗细
  selectLine: function () {

    var that = this;
    var bar = document.getElementById('sidebar');
    var barDrawLi = document.querySelectorAll('.sidebar-draw li');
    var arrLine = [3, 6, 9, 12, 15, 20];

    //取消冒泡
    bar.onmousedown = function (ev) {
      var ev = ev || event;
      ev.cancelBubble = true;
    };
    for (var i = 0; i < barDrawLi.length; i++) {

      barDrawLi[i].index = i;
      barDrawLi[i].onclick = function () {

        that.showTip('你重新选择了画笔宽度！');
        that.gloaObj.LINE = arrLine[this.index];
        bar.style.right = '-230px';

      };
    }
  },

  //撤退功能 根据最后一次绘画数据属性来判断 撤退的步数
  toBack: function () {

    var lastData = this.gloaObj.DATA[this.gloaObj.DATA.length - 1];

    if (!lastData) {

      this.showTip('撤退无效！你没有绘画！', 'remove');
      return false;
    }

    var attr = lastData.attr;

    switch (attr) {

      case 'line':
      case 'circle':
      case 'rect':

        this.gloaObj.DATA.pop();
        break;

      case 'point-line':
      case 'clear-rect':

        var count = this.gloaObj.DATA[this.gloaObj.DATA.length - 1].count;
        for (var i = this.gloaObj.DATA.length - 1; i >= 0; i--) {

          //撤退画笔功能及橡皮擦功能 满足属性值及下笔的次数
          if (attr == this.gloaObj.DATA[i].attr && count == this.gloaObj.DATA[i].count) {

            this.gloaObj.DATA.pop();
          } else {

            break;
          }
        }
        break;
    }
    this.render();
    return true;
  },

  //菜单功能选择
  menuOption: function () {

    var that = this;
    var menu = document.getElementById('menu');
    var item = menu.getElementsByTagName('li');
    var btn = item[8].getElementsByTagName('span')[0];
    var bar = document.getElementById('sidebar');
    var barDraw = bar.querySelector('.sidebar-draw');
    var barColor = bar.querySelector('.sidebar-color');
    var showOff = true;

    //画笔工具
    item[0].onclick = function () {

      that.showTip('你选择了画笔工具！');
      that.drawPen();
    };
    //直线工具
    item[1].onclick = function () {

      that.showTip('你选择了直线工具！');
      that.drawLine();
    };
    //圆形工具
    item[2].onclick = function () {

      that.showTip('你选择了圆形工具！');
      that.drawCircle();
    };
    //矩形工具
    item[3].onclick = function () {

      that.showTip('你选择了矩形工具！');
      that.drawRect();
    };
    //粗细工具
    item[4].onclick = function () {

      barColor.style.display = 'none';
      barDraw.style.display = 'block';
      bar.style.right = 0;
    };
    //颜色工具
    item[5].onclick = function () {

      barColor.style.display = 'block';
      barDraw.style.display = 'none';
      bar.style.right = 0;
    };
    //橡皮擦工具
    item[6].onclick = function () {

      that.showTip('你选择了橡皮擦！');
      that.eraser();
    };
    //撤退功能 
    item[7].onclick = function () {

      if (that.toBack()) {

        that.showTip('撤退成功！');
      } else {

        that.showTip('撤退无效！你没有绘画！', 'remove');
      }
    };
    //隐藏与显示工具栏
    item[8].onclick = function () {

      menu.style.top = '-400px';
      showOff = false;
      btn.className = 'glyphicon glyphicon-download';
    };
    item[8].onmouseover = function () {

      if (showOff) return;
      showOff = true;

      menu.style.top = '0';
      btn.className = 'glyphicon glyphicon-upload';
    };
  },

  //消息框 i参数为图标参数 不填默认ok（勾图标） 填remove（叉图标）
  showTip: function (t, i) {

    var tip = document.getElementById('tip');
    var icon = tip.getElementsByTagName('span')[0]
    var text = tip.getElementsByTagName('span')[1];

    clearInterval(this.TIMER);

    i = i || 'ok';
    icon.className = 'glyphicon glyphicon-' + i;
    text.innerHTML = t;
    tip.style.display = 'block';
    tip.style.transition = '0.5s';
    setTimeout(function () {

      tip.style.top = '50px';
    }, 16);
    this.TIMER = setTimeout(function () {

      tip.style.transition = '';
      tip.style.display = 'none';
      tip.style.top = '0';
    }, 2000);
  },

  //自定义右键菜单
  customMenu: function () {

    var that = this;
    var menu = document.getElementById('contextmenu');
    var item = menu.getElementsByTagName('li');
    var timer = null;
    document.oncontextmenu = function (ev) {

      clearTimeout(timer);

      var ev = ev || event;
      var sX = ev.clientX;
      var sY = ev.clientY;

      menu.style.display = 'block';
      menu.style.left = sX + 'px';
      menu.style.top = sY + 'px';

      timer = setTimeout(function () {

        menu.style.display = 'none';
      }, 3000);

      return false;
    };

    menu.onclick = function () {

      clearTimeout(timer);
      this.style.display = 'none';
    };

    item[1].onclick = function () {

      that.fullScreen();
    };

    //2018-09-20更新
    item[2].onclick = () => {

      this.saveImg();
    };
  },

  //全屏模式
  fullScreen: function () {

    var docElm = document.documentElement;

    if (docElm.requestFullscreen) {

      docElm.requestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {

      docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {

      docElm.webkitRequestFullScreen();
    }
    else if (elem.msRequestFullscreen) {

      elem.msRequestFullscreen();
    }
  },

  //保存图像  2018-09-20更新
  saveImg: () => {

    let canvas = document.getElementById('canvas');
    let MIME_TYPE = 'image/png';
    let imgURL = canvas.toDataURL(MIME_TYPE);
    let aElement = document.createElement('a');

    aElement.download = 'Picture';
    aElement.href = imgURL;
    aElement.dataset.downloadurl = [MIME_TYPE, aElement.download, aElement.href].join(':');

    document.body.appendChild(aElement);
    aElement.click();
    document.body.removeChild(aElement);
  }
};//画板对象
