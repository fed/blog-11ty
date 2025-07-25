---
title: DOM traversal and manipulation
date: 2018-05-08
description: A cheatsheet for working with the DOM in Vanilla JS.
tags: web-platform
---

This blog contains a summary of the main and most common methods to do DOM traversal and manipulation with
[Vanilla JS](http://vanilla-js.com/).

## DOM ready and window load

The `document` object emits a `DOMContentLoaded` event when the document is loaded and the DOM tree is constructed:

```js
// $(document).ready(callback);
document.addEventListener("DOMContentLoaded", callback);
```

This `window` object fires a `load` event when iframes, images, stylesheets and scripts have been downloaded:

```js
// $(window).load(callback);
window.addEventListener("load", callback);
window.onload = callback;
```

## Selectors and collections

Selectors are methods of the DOM interface.

```js
// const divs = $('ul.nav > li');
const items = document.querySelectorAll("ul.nav > li");
const firstItem = document.querySelector("ul.nav > li");

// const title = $('#title');
const title = document.getElementById("title");

// const images = $('.image');
const images = document.getElementsByClassName("image");

// const articles = $('article');
const articles = document.getElementsByTagName("article");
```

jQuery queries return static collections (that is, snapshots of the DOM).

| Selector                 | Returns a collection | Returns a LIVE collection | Return type                                                        | Built-in forEach | Works with any root element |
| ------------------------ | -------------------- | ------------------------- | ------------------------------------------------------------------ | ---------------- | --------------------------- |
| `getElementById`         | 🚫                   | N/A                       | Reference to an `Element` object or `null`                         | N/A              | 🚫                          |
| `getElementsByClassName` | ✅                   | ✅                        | `HTMLCollection`                                                   | 🚫               | ✅                          |
| `getElementsByTagName`   | ✅                   | ✅                        | `HTMLCollection` according to the spec (`NodeList` in WebKit) (\*) | 🚫               | ✅                          |
| `querySelector`          | 🚫                   | N/A                       | `Element` object or `null`                                         | N/A              | ✅                          |
| `querySelectorAll`       | ✅                   | 🚫                        | Static `NodeList` of `Element` objects                             | ✅               | ✅                          |

(\*) The [latest W3C specification](https://dvcs.w3.org/hg/domcore/raw-file/tip/Overview.html) says it returns an `HTMLCollection`; however,
this method returns a [`NodeList`](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) in WebKit browsers. See
[bug 14869](https://bugzilla.mozilla.org/show_bug.cgi?id=14869) for details.

Since all of the selectors (except `getElementById`) support querying any node (and not just `document`), finding nested elements results
trivial:

```js
// $(el).find(selector);
el.querySelectorAll(selector);
```

## jQuery-like selector

You can recreate a very basic version of jQuery's `$` selector by doing the following:

```js
function $(selector) {
	return Array.prototype.slice.call(document.querySelectorAll(selector));
}

const button = $("#button");
```

## Creating elements

To create a new element just pass in the tag name (a string) as an argument to the `createElement` method:

```js
// $('<div />');
const newDiv = document.createElement("div");
```

You can create a text node by invoking the `createTextNode` method of the `document` object:

```js
// There is no equivalent in jQuery for createTextNode.
// You can always use the DOM method, or write a jQuery wrapper around it.
// The closest thing you may be able to find is when creating new elements,
// you can specify the text part separately.
// $('<div>', { text: 'hello world' });
const newTextNode = document.createTextNode("hello world");
```

## Adding elements to the DOM

```js
// $(parent).append(el);
parent.appendChild(el);

// $(parent).prepend(el);
parent.prepend(el);
// ⚠️ Heads up: needs to be polyfilled on IE and Edge.

// $(parent).prepend(el);
parent.insertBefore(el, parent.firstChild);
el.insertBefore(node);

// $(el).before(htmlString);
el.insertAdjacentHTML("beforebegin", htmlString);

// $(el).after(htmlString);
el.insertAdjacentHTML("afterend", htmlString);
```

## Traversing the DOM

```js
// $(el).children();
el.children; // only HTMLElements
el.childNodes; // includes comments and text nodes
// ⚠️ Heads up: you can't `forEach` through `children` unless you turn it into an array first.

// $(el).parent();
el.parentNode;

// $(el).closest(selector);
el.closest(selector);

// $(el).first();
el.firstElementChild; // only HTMLElements
el.firstChild; // includes comments and text nodes

// $(el).last();
el.lastElementChild; // only HTMLElements
el.lastChild; // includes comments and text nodes

// First and last alternative
var nodeList = document.querySelectorAll(".some-class");
var first = nodeList[0];
var last = nodeList[nodeList.length - 1];

// $(el).siblings();
[].filter.call(el.parentNode.children, function (child) {
	return child !== el;
});

// $(el).prev();
el.previousElementSibling; // only HTMLElements
el.previousSibling; // includes comments and text nodes

// $(el).next();
el.nextElementSibling; // only HTMLElements
node.nextSibling; // includes comments and text nodes

// $.contains(el, child);
el !== child && el.contains(child);
```

## Traversing a node list

```js
var nodes = document.querySelectorAll(".class-name");

// 1.
var elements = Array.prototype.slice.call(nodes);
elements.forEach(noop);

// 2. (clean, but creates a new array)
[].forEach.call(nodes, noop);

// 3.
Array.prototype.forEach.call(nodes, noop);
```

## Closest

Find the closest element that matches the target selector:

```js
// $("li.item").closest("ul")
var node = document.getElementById("my-id");
var isFound = false;

while (node instanceof Element) {
	if (node.matches(".target-class")) {
		isFound = true;
		break;
	}
	node = node.parentNode;
}
```

You could choose to polyfill the `Element.prototype.closest` method:

```js
if (Element && !Element.prototype.closest) {
	Element.prototype.closest = function (selector) {
		var el = this;
		while (el instanceof Element) {
			if (el.matches(selector)) {
				return el;
			}
			el = el.parentNode;
		}
	};
}
```

## Removing nodes

```js
// $(el).remove();
el.parentNode.removeChild(el);
```

There's also [`Element.remove()`](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove) although it needs to be polyfilled on
IE:

```js
// $(el).remove();
el.remove();
```

For example, you could use the following code to remove all GIF images from the page:

```js
[].forEach.call(document.querySelectorAll("img"), function (img) {
	if (/\.gif/i.test(img.src)) {
		img.remove();
	}
});
```

## Replacing nodes

```js
// $(el).replaceWith($('.first'));
el.parentNode.replaceChild(newNode, el);

// $(el).replaceWith(string);
el.outerHTML = string;
```

## Cloning nodes

```js
// $(el).clone();
const clone = el.cloneNode();
```

Make sure to pass in `true` to also clone children nodes:

```js
el.cloneNode(true);
```

## Checking if a node is empty

```js
// $(el).is(':empty')
!el.hasChildNodes();
```

## Emptying an element

```js
// $(el).empty();
const el = document.getElementById("el");

while (el.firstChild) {
	el.removeChild(el.firstChild);
}
```

Alternatively, you could also do the following (albeit not recommended as it doesn't remove event listeners, which could lead to memory
leaks in your code):

```js
el.innerHTML = "";
```

## Checking whether two elements are the same

```js
// $(el).is($(otherEl));
el === otherEl;
```

## Checking whether an element matches a selector

```js
// $(el).is('.my-class');
el.matches(".my-class");

// $(el).is('a');
el.matches("a");
```

Note that `matches` needs to be polyfilled in older browsers. Also, many browsers implement
[`Element.matches`](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches) with a vendor prefix, under the non-standard name
`matchesSelector`. We can play safe by using something along the lines of:

```js
function matches(el, selector) {
	return (
		el.matches ||
		el.matchesSelector ||
		el.msMatchesSelector ||
		el.mozMatchesSelector ||
		el.webkitMatchesSelector ||
		el.oMatchesSelector
	).call(el, selector);
}

matches(el, ".my-class");
```

## Getting and setting text content

```js
// $(el).text();
el.textContent;

// $(el).text(string);
el.textContent = string;
```

There's also `innerText` and `outerText`:

- `innerText` was non-standard, while `textContent` was standardised earlier.
- `innerText` returns the visible text contained in a node, while `textContent` returns the full text. For example, on the following
  element: `<span>Hello <span style="display: none;">World</span></span>`, `innerText` will return 'Hello', while `textContent` will return
  'Hello World'. As a result, `innerText` is much more performance-heavy: it requires layout information to return the result.

Here is the official warning for `innerText`: _This feature is non-standard and is not on a standards track. Do not use it on production
sites facing the Web: it will not work for every user. There may also be large incompatibilities between implementations and the behavior
may change in the future._

## Getting and setting outer/inner HTML

```js
// $('<div>').append($(el).clone()).html();
el.outerHTML;

// $(el).replaceWith(string);
el.outerHTML = string;

// $(el).html();
el.innerHTML;

// $(el).html(string);
el.innerHTML = string;

// $(el).empty();
el.innerHTML = "";
```

## Getting and setting attributes

```js
// $(el).attr('tabindex');
el.getAttribute("tabindex");

// $(el).attr('tabindex', 3);
el.setAttribute("tabindex", 3);
```

Since elements are just objects, most of the times we can directly access (and set) their properties:

```js
// Getting the element's Id
const oldId = el.id;

// Setting the element's Id
el.id = "foo";
```

Some other properties we can access directly are:

```js
node.href;
node.checked;
node.disabled;
node.selected;
```

For data attributes we can either use `el.getAttribute('data-something')` or the built-in `dataset` object:

```js
// $(el).data('camelCaseValue');
string = element.dataset.camelCaseValue;

// $(el).data('camelCaseValue', 'foo');
element.dataset.camelCaseValue = "foo";
```

## Styling an element

```js
// $(el).css('background-color', '#3cca5e');
el.style.backgroundColor = "#3cca5e";

// $(el).hide();
el.style.display = "none";

// $(el).show();
el.style.display = "";
```

## Getting computed styles

To get the values of all CSS properties for an element you should use `window.getComputedStyle(element)` instead:

```js
// $(el).css(ruleName);
getComputedStyle(el)[ruleName];
```

## Working with CSS classes

```js
// $(el).addClass('foo');
el.classList.add("foo");

// $(el).removeClass('foo');
el.classList.remove("foo");

// $(el).toggleClass('foo');
el.classList.toggle("foo");

// $(el).hasClass('foo');
el.classList.contains("foo");
```

## Getting the position of an element

```js
// $(el).outerHeight();
el.offsetHeight

// $(el).outerWidth();
el.offsetWidth

// $(el).position();
{ top: el.offsetTop, left: el.offsetLeft }

// $(el).offset();
const rect = el.getBoundingClientRect();

{
  top: rect.top + document.body.scrollTop,
  left: rect.left + document.body.scrollLeft
}
```

## Binding events

```js
// $(el).on(eventName, eventHandler);
el.addEventListener(eventName, eventHandler);

// $(el).off(eventName, eventHandler);
el.removeEventListener(eventName, eventHandler);
```

If working with a collection of elements, you can bind an event handler to each one of them by using a loop:

```js
// $('a').on(eventName, eventHandler);
const links = document.querySelectorAll("a");

[].forEach.call(links, function (link) {
	link.addEventListener(eventName, eventHandler);
});
```

Although instead of doing that, you should probably look into the next topic: event delegation.

## Event delegation

Can add to higher element and use 'matches' to see if specific child was clicked (similar to jQuery's `.on`):

```js
// $('ul').on('click', 'li > a', eventHandler);
const el = document.querySelector("ul");

el.addEventListener("click", (event) => {
	if (event.target.matches("li")) {
		// event handling logic
	}
});
```

## The event object

```js
var node = document.getElementById("my-node");
var onClick = function (event) {
	// this = element

	// can filter by target = event delegation
	if (!event.target.matches(".tab-header")) {
		return;
	}

	// stop the default browser behaviour
	event.preventDefault();

	// stop the event from bubbling up the dom
	event.stopPropagation();

	// other listeners on this node will not fire
	event.stopImmediatePropagation();
};

node.addEventListener("click", onClick);
node.removeEventListener("click", onClick);
```

## Mocking events

```js
var anchor = document.getElementById("my-anchor");
var event = new Event("click");

anchor.dispatchEvent(event);
```

## Animations

```js
// $(el).fadeIn();
function fadeIn(el) {
	el.style.opacity = 0;

	var last = +new Date();
	var tick = function () {
		el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
		last = +new Date();

		if (+el.style.opacity < 1) {
			(window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
		}
	};

	tick();
}
```

Or, if you are only supporting IE10+:

```js
el.classList.add("show");
el.classList.remove("hide");
```

```css
.show {
	transition: opacity 400ms;
}

.hide {
	opacity: 0;
}
```

## Looping over and filtering through collections of DOM elements

Note this is not necessary if you are using `querySelector(All)`.

```js
// $(selector).each(function (index, element) { ... });
const elements = document.getElementsByClassName(selector);

// option 1
[].forEach.call(elements, function (element, index, arr) { ... });

// option 2
Array.prototype.forEach.call(elements, function (element, index, array) { ... });

// option 3
Array.from(elements).forEach((element, index, arr) => { ... }); // ES6 ⚠️
```

Same concept applies to filtering:

```js
// $(selector).filter(":even");
const elements = document.getElementsByClassName(selector);

[].filter.call(elements, function (element, index, arr) {
	return index % 2 === 0;
});
```

Note that `:even` and `:odd` use 0-based indexing.

Another filtering example:

```js
var nodeList = document.getElementsByClassName("my-class");
var filtered = Array.prototype.filter.call(nodeList, function (item) {
	return item.innerText.indexOf("Item") !== -1;
});
```

## Random utilities

```js
// $.proxy(fn, context);
fn.bind(context);

// $.parseJSON(string);
JSON.parse(string);

// $.trim(string);
string.trim();

// $.type(obj);
Object.prototype.toString
	.call(obj)
	.replace(/^\[object (.+)\]$/, "$1")
	.toLowerCase();
```

## Adding multiple `window.{onload, onerror}` events

```js
(function () {
	function addWindowEvent(event, fn) {
		var old = window[event];
		if (typeof old !== "function") {
			window[event] = fn;
			return;
		}

		window[event] = function () {
			old.apply(window, arguments);
			fn.apply(window, arguments);
		};
	}

	window.addOnLoad = function (fn) {
		addWindowEvent("onload", fn);
	};

	window.addOnError = function (fn) {
		addWindowEvent("onerror", fn);
	};
})();
```

## XMLHttpRequest (XHR)

Despite its name, `XMLHttpRequest` can be used to retrieve any type of data, not just XML, and it supports protocols other than HTTP
(including `file` and `ftp`).

To get data data from the server:

```js
const xhr = new XMLHttpRequest();

xhr.open("GET", "/url", true);
xhr.onload = function () {
	if (this.status === 200) {
		console.log("success!");
	} else {
		console.log("failed", this.status);
	}
};
xhr.send();
```

Post data back to the server is quite similar, the only difference is the method name (`POST`) when opening the connection and the setting
of the headers:

```js
const xhr = new XMLHttpRequest();

xhr.open("POST", "/url/post", true);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.onload = function () {
	if (this.status === 200) {
		console.log("success!");
	} else {
		console.log("failed", this.status);
	}
};
xhr.send();
```

# Alternative libraries

- AJAX: [Axios](https://github.com/mzabriskie/axios), [Superagent](https://github.com/visionmedia/superagent)
- Animations: [Animate.css](https://github.com/daneden/animate.css), [Move.js](https://github.com/visionmedia/move.js)
- Working with arrays, numbers, objects, strings, etc.: [Lodash](https://lodash.com/)

# Credits and further resources

- http://youmightnotneedjquery.com/
- https://css-tricks.com/now-ever-might-not-need-jquery/
- https://plainjs.com/javascript/
- https://github.com/nefe/You-Dont-Need-jQuery
