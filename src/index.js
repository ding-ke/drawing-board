function DrawBoard (params) {
  this.element = document.getElementById(params.element);
  this.element.width = params.width || document.documentElement.clientWidth;
  this.element.height = params.height || document.documentElement.clientHeight;
  this.context = this.element.getContext('2d');
  this.data = [];
  this.toolState = {
    color: params.color || '#f00056',
    lineWidth: params.lineWidth || 5,
    typeIndex: 0,
    eraserCount: 0
  };
  this.usePenTool();
}

DrawBoard.prototype.setColor = function (color) {
  this.toolState.color = color;
};

DrawBoard.prototype.setLineWidth = function (width) {
  this.toolState.lineWidth = width;
};

DrawBoard.prototype.clearAll = function () {
  this.data = [];
  this.context.clearRect(0, 0, this.element.width, this.element.height);
};

DrawBoard.prototype.usePenTool = function () {
  var that = this;

  that.element.onmousedown = function (ev) {
    var ev = ev || event;
    var startX = ev.clientX;
    var startY = ev.clientY;
    that.toolState.typeIndex++;
    var onOff = true;

    that.element.onmousemove = function (ev) {
      if (!onOff) {
        return;
      }
      onOff = false;
      setTimeout(function () {
        onOff = true;
      }, 15);
      var ev = ev || event;
      var index = that.data.length;

      that.data[index] = {
        type: 'point-line',
        typeIndex: that.toolState.typeIndex,
        startX: startX,
        startY: startY,
        endX: ev.clientX,
        endY: ev.clientY,
        color: that.toolState.color,
        lineWidth: that.toolState.lineWidth
      };

      that.context.beginPath();
      that.context.moveTo(startX, startY);
      that.context.lineTo(ev.clientX, ev.clientY);
      that.context.closePath();
      that.context.strokeStyle = that.toolState.color;
      that.context.lineJoin = 'round';
      that.context.lineCap = 'round';
      that.context.lineWidth = that.toolState.lineWidth;
      that.context.stroke();

      startX = ev.clientX;
      startY = ev.clientY;
    };

    that.element.onmouseup = function () {
      that.element.onmousemove = null;
    };
    return false;
  };
};

DrawBoard.prototype.useLineTool = function () {
  var that = this;

  that.element.onmousedown = function (ev) {
    var ev = ev || event;
    var startX = ev.clientX;
    var startY = ev.clientY;
    var index = that.data.length;

    that.element.onmousemove = function (ev) {
      var ev = ev || event;
      that.data[index] = {
        type: 'line',
        startX: startX,
        startY: startY,
        endX: ev.clientX,
        endY: ev.clientY,
        lineWidth: that.toolState.lineWidth,
        color: that.toolState.color
      }
      that.render();
    }

    that.element.onmouseup = function () {
      that.element.onmousemove = null;
    };
    return false;
  };
};

DrawBoard.prototype.useCircleTool = function () {
  var that = this;

  that.element.onmousedown = function (ev) {
    var ev = ev || event;
    var startX = ev.clientX;
    var startY = ev.clientY;
    var index = that.data.length;

    that.element.onmousemove = function (ev) {
      var ev = ev || event;
      var centerX = ev.clientX - startX;
      var centerY = ev.clientY - startY;

      that.data[index] = {
        type: 'circle',
        centerX: centerX / 2 + startX,
        centerY: centerY / 2 + startY,
        radius: Math.sqrt(centerX * centerX + centerY * centerY) / 2,
        color: that.toolState.color
      };
      that.render();
    };
    
    that.element.onmouseup = function () {
      that.element.onmousemove = null;
    };
    return false;
  };
};

DrawBoard.prototype.useRectTool = function () {
  var that = this;

  that.element.onmousedown = function (ev) {
    var ev = ev || event;
    var startX = ev.clientX;
    var startY = ev.clientY;
    var index = that.data.length;

    that.element.onmousemove = function (ev) {
      var ev = ev || event;
      that.data[index] = {
        type: 'rect',
        startX: startX,
        startY: startY,
        width: ev.clientX - startX,
        height: ev.clientY - startY,
        color: that.toolState.color
      };
      that.render();
    };

    that.element.onmouseup = function () {
      that.element.onmousemove = null;
    };
    return false;
  };
};

DrawBoard.prototype.useEraser = function () {
  var that = this;
  ++that.toolState.typeIndex;
  that.element.onmousedown = function () {
    that.element.onmousemove = function (ev) {
      var ev = ev || event;
      var index = that.data.length;

      that.data[index] = {
        type: 'clear-react',
        typeIndex: that.toolState.typeIndex,
        startX: ev.clientX - 15,
        startY: ev.clientY - 15,
        width: 30,
        height: 30,
        color: '#fff'
      };
      
      that.gloaObj.CTX.fillStyle = '#fff';
      that.gloaObj.CTX.beginPath();
      that.gloaObj.CTX.fillRect(ev.clientX - 15, ev.clientY - 15, 30, 30);
      that.gloaObj.CTX.closePath();
      that.gloaObj.CTX.fill();
    };

    that.element.onmouseup = function () {
      that.element.onmousemove = null;
    };
    return false;
  };
}

DrawBoard.prototype.backspace = function () {
  if (this.data.length === 0) {
    console.warn('当前画板没有绘制数据');
    return false;
  }
  var type = this.data[this.data.length - 1].type;
  switch (type) {
    case 'line':
    case 'circle':
    case 'rect':
      this.data.pop();
      break;
    case 'point-line':
    case 'clear-rect':
      var typeIndex = this.data[this.data.length - 1].typeIndex;
      for (var i = this.data.length - 1; i >= 0; i--) {
        if (type == this.data[i].type && typeIndex == this.data[i].typeIndex) {
          this.data.pop();
        } else {
          break;
        }
      }
      break;
  }
  this.render();
  return true;
};

DrawBoard.prototype.download = function (fileName) {
  var imgURL = this.element.toDataURL('image/png');
  var aElement = document.createElement('a');
  aElement.download = fileName || 'image';
  aElement.href = imgURL;
  aElement.dataset.downloadurl = ['image/png', fileName, imgURL].join(':');
  document.body.appendChild(aElement);
  aElement.click();
  document.body.removeChild(aElement);
};

DrawBoard.prototype.render = function () {
  this.context.clearRect(0, 0, this.element.width, this.element.height);
  for (var i = 0; i < this.data.length; i++) {
    switch (this.data[i].type) {
      case 'clear-rect':
      case 'rect':
        this.context.fillStyle = this.data[i].color;
        this.context.beginPath();
        this.context.fillRect(this.data[i].startX, this.data[i].startY, this.data[i].width, this.data[i].height);
        this.context.closePath();
        this.context.fill();
        break;
      case 'circle':
        this.context.beginPath();
        this.context.arc(this.data[i].centerX, this.data[i].centerY, this.data[i].radius, 0, 2 * Math.PI, false);
        this.context.closePath();
        this.context.fillStyle = this.data[i].color;
        this.context.fill();
        break;
      case 'point-line':
      case 'line':
        this.context.beginPath();
        this.context.moveTo(this.data[i].startX, this.data[i].startY);
        this.context.lineTo(this.data[i].endX, this.data[i].endY);
        this.context.closePath();
        this.context.lineJoin = 'round';
        this.context.lineCap = 'round';
        this.context.strokeStyle = this.data[i].color;
        this.context.lineWidth = this.data[i].lineWidth;
        this.context.stroke();
        break;
    }
  }
};