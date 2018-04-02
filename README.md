# Van11y accessible dialog tooltip (modal) system, using ARIA

<img src="https://van11y.net/layout/images/logo-van11y.svg" alt="Van11y" width="300" />

This script will provide you an accessible dialog tooltip (modal) using ARIA.

The demo is here: https://van11y.net/downloads/modal-tooltip/demo/index.html

Website is here: https://van11y.net/accessible-modal-tooltip/

La page existe aussi en français : https://van11y.net/fr/tooltip-modal-accessible/

## How it works


Basically, the script wraps each <code>class="js-tooltip"</code> into a <code>span class="<your-prefix-class>-container"</code>, when you activate one, it inserts a __dialog element just after the clicked element__ (in the container), __puts the focus on it and traps focus in the dialog tooltip__. When you __exit__ it, __the focus is given back__ to the element that opened it.

For mouse users, they can click outside the dialog tooltip to close it. You can close it using <kbd>Esc</kbd>, or by using <kbd>Enter</kbd> or <kbd>Space</kbd> if you’re on the close button.

If you never activate a dialog tooltip, it won’t be anywhere in the code.



## How to use it


__Download the script__

You may use npm command: <code>npm i van11y-accessible-modal-tooltip-aria</code>.
You may also use bower: <code>bower install van11y-accessible-modal-tooltip-aria</code>.

__Option and attributes__

Use `data-tooltip-text` or `data-tooltip-content-id` attributes to insert content in the dialog tooltip.

- Simply put <code>class="js-tooltip"</code> on a button to activate the script.
- Attribute <code>data-tooltip-prefix-class</code>: the prefix to all style classes of the dialog tooltip.
- Attribute <code>data-tooltip-text</code>: the text of your dialog tooltip (will be put into a p tag).
- Attribute <code>data-tooltip-content-id</code>: the id of (hidden) content in your page that will be put into your dialog tooltip.
- Attribute <code>data-tooltip-title</code>: the main title of the dialog tooltip.
- Attribute <code>data-tooltip-close-text</code>: the text of the close button in your dialog tooltip.
- Attribute <code>data-tooltip-close-title</code>: the title attribute of the close button in your dialog tooltip.
- Attribute <code>data-tooltip-close-img</code>: a path to a valid image for the close button.
- Attribute <code>data-tooltip-focus-toid</code>: the `id` of the element in the modal tooltip you want to give the focus to, when loading the modal tooltip (closing button if not specified).

Remember there are some demos, it will be easier to understand: <a href="https://van11y.net/downloads/modal-tooltip/demo/index.html">Demo of accessible modal tooltip</a>

The script is launched when the page is loaded. If you need to execute it on AJAX-inserted content, you may use for example on `<div id="newContent">your modal tooltip launcher source</div>`:

```van11yAccessibleModalTooltipAria(document.getElementById('newContent')[, addListeners]);```

`addListeners` is a facultative boolean (by default set to `true`) to add modal tooltip listeners (should be set up only the first time in most of the cases).

## Minimal styling classes

Here are the styles used for this page:
(I’ve used <code>data-tooltip-prefix-class="simple-tooltip"</code>, you can set up your own styles)

```
/* needed for old browsers */
dialog {
  display: block;
  border: 0;
}
.hidden { display: none; }

.simple-left-container {
  position: relative;
}
 
.simple-left-tooltip {
  position: absolute;
  z-index: 666;
  top: 80%;
  left: 50%;
  width: 15em;
  background: #fff;
  background: rgba (255, 255, 255, .9);
  border: 1px solid #128197;
  border-radius: .5em;
  padding: 1em;
  text-align: left;
}

.simple-left-tooltip__title {
  margin: 0;
  line-height: 1;
}
.simple-left-tooltip p {
  font-size: 1em;
}
.simple-left-tooltip__close {
  float: right;
  border: 0;
  /** fix typo inputs **/
  font-family: inherit;
  font-size: .8em;
  background: #128197;
  color: #fff;
  border-radius: 1em;
}
.simple-left-tooltip__close:focus,
.simple-left-tooltip__close:hover,
.simple-left-tooltip__close:active {
  outline: 1px dotted #fff;  
}
.simple-left-tooltip__close:hover,
.simple-left-tooltip__close:active {
  background: #4d287f;
}

/* for this example: tablets */
@media (max-width: 55.625em) {

  .simple-left-container {
    position: static;
	
  }
  .simple-left-tooltip {
    position: static;
	  width: auto;
	  margin-top: 1em;
  }
  
}
```


## Other styling classes example

Here are the styles used for the demo “It’s easy to customize”, I’ve used <code>data-tooltip-prefix-class="left-tooltip"</code>:

```
/* tooltip modal */
.left-tooltip-tooltip {
  left: auto;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  z-index: 667;
  position: fixed;
  width: 25em;
  max-width: 100%;
  padding: .5em;
  font-size: 1em;
  border: 0;
  animation: fromleft .3s linear;
  background: #ddd; /* fallback IE9 */
  background-image:
      -webkit-linear-gradient(
        top,
        #128197 3em,
        #f7f7f7 3em
      );  background-image:
      linear-gradient(
        to bottom,
        #128197 3em,
        #f7f7f7 3em
      );
}
.left-tooltip-tooltip__close {
  float: right;
  background: transparent;
  color: #fff;
  border: 0;
}
.left-tooltip-tooltip__title {
  font-size: 1.2em;
  margin: 0;
  color: #fff;
  font-weight: normal;
}

@-webkit-keyframes fromleft {
  0%   { width: 0; }
  100% { width: 25em; }
}
@keyframes fromleft {
  0%   { width: 0; }
  100% { width: 25em; }
}
```


## Other style example

Here are the styles used for the fourth example of the demo, I’ve used <code>data-modal-prefix-class="fixed-tooltip"</code> to namespace elements, so each one will start with <code>.fixed-tooltip-</code>:

```
.fixed-tooltip-tooltip {
  position: fixed;
  bottom: 3em;
  left: 3em;
  width: 13em;
  background: #fff;
  z-index: 700;
  border: 1px solid #128197;
  right: auto;
  padding: .5em;
}
.fixed-tooltip-tooltip__close {
  background: transparent;
  border: 0;
  font: inherit;
  float: right;
}
.fixed-tooltip-tooltip__title {
  margin: 0;
}
```
