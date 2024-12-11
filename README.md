# JS-TS-Function-Flow-Chart

[JS-TS-Function-Flow-Chart](https://querykuma.github.io/JS-TS-Function-Flow-Chart) is a web service that generates the function flow chart from a JavaScript/TypeScript/JSX file.

## Overview

```JavaScript
function from() {
    to()
}
```

The above program has a function flow from the function(from) node to the function(to) node. The web service extracts all the function flows from a file and generates the chart.



Some of the features of JS-TS-Function-Flow-Chart are:
* The input is a JavaScript or TypeScript or JSX file.
* It shows a Mermaid code of the chart.
* It shows a table that lists the function flows in a file.
* It also shows the count of the function calls.
* It colors the connected edges when the mouse clicks the node.
* It shows the popup of the edges details when the mouse hovers the node.
* It hides function(to) nodes in the chart by the user setting function or object names.

## Usage

Start by clicking a button to select a file or by dragging a file into the browser. It generates the function flow chart.

Click each function node on the chart　to color IN/OUT edges on the node.

Hover each function node on the chart to pop up IN/OUT details.

Click the setting button on the icon in the upper right corner of the screen to hide the function(to) nodes whose names are specified in the setting screen. You need to set them to blank if you want to show all the function flows because they have default values.
