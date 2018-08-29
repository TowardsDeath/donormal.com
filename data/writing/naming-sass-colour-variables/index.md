---
title: Naming SASS colour variables
deck: ""
date: 2015-01-26 23:12
---


Naming is hard.   
Naming in software development is hard.   
Naming your SASS colour variables is the hardest of all. Not as hard as making it through one episode of Family Guy, but still.

## An example

A simple design could start out with these colours.

    $blue: #0d6bac;
    $light-blue: #60a5d6;

The design is tweaked by adding another colour.

    $blue: #0d6bac;
    $light-blue: #60a5d6;
    $lighter-blue: #b0d2e9;
    
Another design change.

    $blue: #0d6bac;
    $light-blue: #60a5d6;
    $lighter-blue: #b0d2e9;
    $even-lighter-blue: #daecf8;

Already it's a mess, even with as few as four colours. `lighter-blue`? Lighter than what? This naming scheme isn't very maintainable, yet it's how a lot of projects describe their SASS colours.

## The solution

**The problem comes from the fact that the names are chosen arbitrarily.** There's no reference point to base your next variable on.

A colour name generator fixes this: it takes a hex or RGB value and returns a colour name that you can use in your variable name. A generator I frequently use is [Name That Color](http://chir.ag/projects/name-that-color/). And if you include the hue as well, your variables are **usable, predictable and maintainable**.

Let's apply the names from *Name That Color* to our example.

    // Naming scheme: ${hue}-{name}
    // http://chir.ag/projects/name-that-color/
    $blue-denim: #0d6bac;
    $blue-danube: #60a5d6;
    $blue-spindle: #b0d2e9;
    $blue-link-water: #daecf8;
    
A vast improvement: it's easy to identify each colour and most of all, it's a lot easier to add new colours. (You should place all colours in a separate `_colors.scss` file.)

## Next

These colours are not semantic enough to be used directly, so the next step would be to assign these variables to other variables used in your page elements.

For example, in `_menu.scss`:

    // Apply colors locally
    $menu-border-color: $blue-danube;
    
    // Menu block
    .menu {
        …
        border-color: $menu-border-color;
    }
