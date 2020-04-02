## Drawing Board 
	
## Description

## Preview

[Click here to preview](https://ding-ke.github.io/drawing-board/)

## Usage

```html
<canvas id="my-board"></canvas>
```
```js
// Instantiation a drawing board object
const board = new DrawBoard({
	element: 'my-board',
	width: 200,
	height: 200,
	color: 'red',
	lineWidth: 5,
});
// Using the tools of circle
board.useCircel();
// Setting color 
board.setColor('#666');
// Setting width
board.setLineWidth(10);
// Saving the picture into your file system
board.download('picture');
```

## ALL API

```js
const board = new DrawBoard({});

board.setColor();
board.setLineWidth();
board.clearAll();
board.usePenTool();
board.useLineTool();
board.useCircleTool();
board.useEraser();
board.backspace();
board.download();

```


