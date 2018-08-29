---
title: Communication between CSS components
deck: How to affect other UI elements while keeping their code separated
date: 2016-06-02 22:24
---


## Summary

Use CSS state modifiers to influence the styling of other components while maintaining separation of concerns in your CSS.

## Components

Component-based design has many advantages. Elements are re-usable, changes are easier to implement et cetera. When writing CSS, you've probably divided your codebase using that same structure. For example, the styling for your button component might be defined in a `button` class. 

(If you're unfamiliar with UI components: you should give it a try. Read these if you want more background information: [From Pages to Patterns: An Exercise for Everyone](http://alistapart.com/article/from-pages-to-patterns-an-exercise-for-everyone) and [More Transparent UI Code with Namespaces](http://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/).)

## The problem

If set up correctly, a single component know nothing about other components. It becomes problematic when you want one component to influence other parts of the UI. I recently ran into this. I had a card component that contained a separate button. When hovered, the button changed colour. I wanted to trigger that hover style when the entire card was hovered.

```
.c-card { 
   &:hover {
      .c-button {
         background-color: $some-color;
      }
   }
}
```

The code above works, but violates the principle of separation: the card explictly references the `c-button` class.

## The solution

I believe the answer lies in state modifiers. I use those to indicate a component has some temporary state. For example, a component can be collapsed.

```
.c-component {
   &.is-collapsed {
      // Styling for collapsed state.
   }
}
```

These state modifier can also be used to trigger hover styles in a nested component. JavaScript has a similar construct for events called "propagation", so let's steal that name and create a state modifier `has-hover-propagation`. It works like this:

```
.c-button {
   &:hover,
   &:active,
   &:focus,
   .has-hover-propagation:hover &,
   .has-hover-propagation:active &,
   .has-hover-propagation:focus & {
      background-color: $some-color;
   }
}
```

```
<article class="c-card  has-hover-propagation">
   <!-- Content -->
   <a class="c-button" href="http://example.org">Go</a>
</article>
```

When the card is hovered, it triggers the button's hover styles via the `has-hover-propagation` class. And the separation is still there: the card doesn't know about the button, and vice versa.

## Automation

It can be quite a chore to type six selectors each time you want to define a hover style. Let's automate it via a Sass mixin.

```
@mixin hover() {
   &:hover,
   &:active,
   &:focus,
   .has-hover-propagation:hover &,
   .has-hover-propagation:active &,
   .has-hover-propagation:focus & {
      @content;
   }
}
```

```
.c-button {
   @include hover {
      background-color: $some-color;
   }
}
```

The result is painless communication between different CSS components while keeping the code clean.
