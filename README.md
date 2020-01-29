# Easy Annotation - a JavaScript library to annotate pictures online

### Features
* Add different shapes to your pictures
* Highlight some part of the image
* Blur parts of the image
* Save to PNG, JSON or XML
* Load previously saved work
* Simple usage
* Zero dependencies
* Responsive and auto-positioning
* Supports touch devices

## Getting Started
# Installation

Install via npm:
```shell
npm i easyannotation
```

Include code:
```js
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/easyannotation"></script>
```
### Example

```javascript
  new easyannotation.AnnotatorContainer(document.getElementById('inputImage')).show(function(res) {
      //process result when user press Save
      document.getElementById('sample4Res').src = res;
  });
```
## Options
```javascript
  new easyannotation.AnnotatorContainer(document.getElementById('inputImage'), {
     
     // optional target element to place the EasyAnnotation container.
     // If not specified container will be placed on document.body element.
     targetElement: document.body,

     //default font to be used for text elements.
     font: {
        name: 'Arial', // font name
        size: 24,      //default font size
        bold: false,   //bold
        italic: false  //italic
     },
    
     // the drawing style for lines, the following options can be used:
     drawStyle: {
     //   startArrow and endArrow properties define the start and end of lines, can be one of the follwing:
     //     *   ArrowType.NONE - no arrow
     //     *   ArrowType.ARROW - simple arrow
     //     *   ArrowType.OPEN_ARROW - simple open arrow
     //     *   ArrowType.RECT - rectangle arrow
     //     *   ArrowType.DIAMOND_ARROW - diamond arrow
     //     *   ArrowType.OVAL_ARROW - oval arrow
     //     *   ArrowType.LINE_ARROW - vertical line arrow
          startArrow: ArrowType.NONE, 
          endArrow: ArrowType.NONE,

     //   line type, can be one of the follwing:
     //     *  StrokeType.SOLID - solid line
     //     *  StrokeType.DOTTED - dotted line
     //     *  StrokeType.DASHED - dashed line
        type: easyannotation.StrokeType.SOLID,
        
        width: 1, //   Line width, can be any number starting with 1
        color: '#000' // default line color
     },

     //default fill style for shapes that can be filled, the following options can be used:
     fillStyle: {
          fillType: 0 // a number between 0 and 9 defining the fill type. 
                      // If 0 is specified, elements will fill with solid background.
          opacity: 100,  // default opacity fill for components, 100 - opaque, 0 - transparent
          color: '#000' // default fill color
     },

     x: null, //x position based on target element
     y: null, //y position based on target element
     width: null, //with of the container element. If not specified defaults to image width.
     height: null, //height of the container element. If not specified defaults to image height.

     showToolbar: true, //true to show annotation toolbar
     showProperties: true, // true to show properties toolbar

     style: null, //additional style properties to apply to Easy Annotation container element
     containerCls: null, //additional class to add to Easy Annotation container element

     //optional class to add to toolbar element. This can be usefull to add your own style to toolbar.
     //Example: toolbarCls: 'sample-cls'. Then if you want to change colors and backrgound you can do the following:
     //   .sample-cls {
     //       background-color: #7ff87f;
     //   }
    
     //   .sample-cls svg * {
     //       fill: #1805A4;
     //       stroke: #1805A4;
     //   }
     toolbarCls: null,

     // a list of items to add to toolbar element, by default contains the following items:
     toolbarItems: [
                    {
                        //clear button to delete selected or all elements
                        itemId: 'delete',
                        iconSVG: EraseIcon,
                        title: 'Delete selected or all elements'
                    },
                    new TextToolbarItem(),     //text element
                    new LineToolbarItem(),     //line element
                    new ArrowToolbarItem(),    //arrow element
                    new EllipseToolbarItem(),   //ellipse/circle element
                    new RectToolbarItem(),      //rectangle element
                    new CalloutToolbarItem(),   //callout element
                    new ImageToolbarItem(),     //image element
                    new BlurToolbarItem(),      //bluring element to blur parts of the image
                    new FreeDrawToolbarItem(me.config), //free draw element
                    {
                        //save element
                        itemId: 'save',
                        iconSVG: SaveIcon,
                        title: 'Save changes and close annotator'
                    }],

     //Hide original image element. 
     //If false, image element won't be hidden and EasyAnnotation container will be placed above the original image
     hideElement: true,
    
  }).show(function(res) {
      //process result when user press Save
      document.getElementById('sample4Res').src = res;
  });
```

### Methods

* show(callback`:function`, exportType`:ExportType`) _- Show EasyAnnotation container and provide callback to be called when user save changes._
* addElement(element`:BaseAnnotator`) _- Add new annotator element._
* selectAll() _- select all elements_
* deselectAll() _- deselect all elements_
* clear() _- delete all elements from the container _
* save(callback`:function`, exportType`:ExportType`) _- save data to specified format and call callback function when done. 
Data can be saved as PNG, JSON or XML. Callback function will be called with one string argument with saved data in the required format_
* loadXML(xml`:string`) _- load data from specified XML string. `xml` parameter must be a valid XML result from `show` or `save` functions._
* loadJSON(json`:string`) _- load data from specified JSON string. `json` parameter must be a valid JSON result from `show` or `save` functions._

## License
(see [LICENSE](https://github.com/ailon/markerjs/blob/master/LICENSE) for details) - library is free of charge for Open Source projects and for personal use only.
Other projects require a license.

For more details, please visit [EasyAnnotation.com website](http://easyannotation.com/).