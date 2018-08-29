---
title: "Flexbug: inline-block with flex children"
deck: ""
date: 2016-06-07 12:23
---

## Summary

In Internet Explorer 11 and Firefox 40, vertical alignment of inline-block elements is broken when one of those elements contains a flex element.   
The workaround? Apply `vertical-align: middle` to the parent of the flex item.

## Background

Early flexbox implementations can be fairly buggy, across all browsers. A lot of issues are documented by [Philip Walton](https://philipwalton.com/) in this [comprehensive list of flexbugs and workarounds](https://github.com/philipwalton/flexbugs). The problem I encountered is not on that list, nor could I find any other bugs with a similar description.

Let's say you have two UI components:

![button--correct](button--correct.png)  

- A hyperlink styled as a button.
- Next to the hyperlink, a form with a single search field with a button added on.

The image above demonstrates the expected browser behaviour. Both the form and the link-button are styled with `display: inline-block`. Inside the form is a wrapper-`div` with `display: flex`, containing an icon and an `input` with `flex: 1 0 auto`. (The latter is a standard pattern to create input add-ons, as specified by [Solved With Flexbox](https://philipwalton.github.io/solved-by-flexbox/demos/input-add-ons/).)

However, Internet Explorer 11 and Firefox 40---perhaps other browsers as well---align the link-button partially below the search field:

![button--incorrect](button--incorrect.png) 

Luckily, there's a simple workaroud: apply `vertical-align: middle` to the parent of the flex item, in this case the `form`.

If you don't like reading text and rather look at actual code, I created a [stripped-down demo on CodePen](https://codepen.io/donormal/pen/ezpONd).
