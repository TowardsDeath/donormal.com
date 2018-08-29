---
title: Refactoring to scalable CSS
deck: ""
date: 2015-03-23 20:36
---

A lot of front-end work is done ad-hoc: the goal is to make a design work in a few browsers in as little time as possible. The CSS is built like it's something to never look back to. A shortcut here, a hack there, "I'll fix it later." The problem is: you won't. And you will feel sorry for yourself when the inevitable time comes when you have to work on that project again and have to navigate through a seemingly endless maze of nested selectors and unstructured code.

This special kind of hell can be avoided. CSS can be maintainable. CSS can be scalable. And you don't have to wait for a fresh new project to create scalable CSS. Let's take a look at how to refactor existing code to a situation that's more readable and maintainable.

## Refactoring

How do you know if you need to refactor your CSS? There are a few indicators:

1. When every time you open the project, you contemplate changing your career to become a bus driver.
2. **Nested selectors**. They increase complexity and make your code harder to read or change. When you have selectors nested more than 2 or at most 3 levels deep, start refactoring immediately.
3. When there's no naming scheme for classes, it's probably time to pick one you like (BEM, SMACSS, OOCSS et cetera).
4. Look for inconsistencies in the ways values are defined.
5. Look for properties that are defined multiple times across components. They're best defined as shared object or utility classes that you apply to the element everytime you need them.
6. Anything else that might help someone who opens your project help understand it quicker and make changes in the right way.

As always when you refactor code: make a small change and check if you haven't broken anything after each change. (It would be great if you have automated tests to check this for you.)

## Let's start

I've taken a small sample from a project I worked on recently. (The code is altered slightly for the purpose of this article.) The CSS was not built with maintainability in mind. As the code changed daily and developers could not fully understand the impact of changes they were making, quite a few bugs were introduced. But, it's never too late to start refactoring.

Let's start with the HTML. A simple component that summarizes information from another page:

    <div class="ci">
        <a href="/episodes/the-label-maker">
            <h2>Episode: The Label Maker</h2>
            <div class="ci-content">
                <div class="visualcontent">
                    <img src="/images/some-image.jpg">
                </div>
                <div class="panel">
                    <p>Jerry has two tickets to the Super Bowl but he cannot attend due to "the Drake's" wedding.</p>
                </div>
                <div class="cta-label">
                    <p>Watch episode</p>
                </div>
            </div>
        </a>
    </div>

The corresponding stylesheet:

    div.ci {
        position: relative;
        margin-bottom: 70px;

        h2 {
            color: #c40037;
        }

        a {
            display: block;
            text-decoration: none;

            &:hover {
                transition: opacity 0.2s ease;

                img {
                    opacity: 0.7;
                }
            }

            img {
                transform: translateZ(0);
                transition: opacity 0.2s ease;
                opacity: 1;
            }
        }

        .ci-content {
            .visualcontent {
                height: 200px;
                overflow: hidden;

                img {
                    display: block;
                    width: 100%;
                    height: auto;
                }
            }

            .panel {
                background: url('../images/backgrounds/arrow-bg.png') center right no-repeat;
                padding: 30px 60px 30px 30px;
            }

            .cta-label {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 170px;
                background: #c40037;
                z-index: 20;

                p {
                    color: #FFFFFF;
                    padding: 15px 30px 15px 20px;
                    text-transform: uppercase;
                    font: {
                        weight: 700;
                    }
                    line-height: 17px;
                }
            }
        }
    }


The goal is to increase maintainability and ease of use for developers. With that in mind, a few problems can be spotted.

1. The class names are inconsistent: some are hyphenated, others are not.
2. Abbreviations in class names.
3. The CSS is too tightly coupled to the HTML by element selectors.
4. Re-usability is lowered by the deep nesting of selectors.
5. The CSS contains inconsistent values and uses properties with too big a scope.
6. Lack of HTML5 elements.

Let's further explain and solve these problems.


## Inconsistent class names (1)

Class names need to be consistent, predictable and readable. Inconsistencies slow down development when reading and when adding code. Consistent naming, however, gives developers a solid starting point when they need to add code. My preference is to place a hyphen between nouns. Whatever yours is, just make sure to apply it every time.

In this case, `visualcontent` should be hyphenated to be consistent with other classes.

```
<div class="visual-content">
    <img src="/images/some-image.jpg">
</div>
```

```
.visual-content {
    height: 200px;
    overflow: hidden;

    …
}
```

## Abbreviations in class names (2)

Abbreviations shorten code and shorter code is better, right? Not if you're new to a project. If you have no idea what these abbreviations mean, you cannot properly understand the code and confidently make changes. This problem is avoided by fully writing out class names.

In this case, `ci` and `cta` are abbreviations of `content-item` and `call-to-action`. Let's make the changes.

    <div class="content-item">
        <a href="/episodes/the-label-maker">
            <h2>Episode: The Label Maker</h2>
            <div class="content-item-content">
                <div class="visual-content">
                    <img src="/images/some-image.jpg">
                </div>
                <div class="panel">
                    <p>Jerry has two tickets to the Super Bowl but he cannot attend due to "the Drake's" wedding.</p>
                </div>
                <div class="call-to-action-label">
                    <p>Watch episode</p>
                </div>
            </div>
        </a>
    </div>

`content-item-content` is not a great name, but that will be taken care of in the next step.

## Tight coupling (3) & low re-usability (4)

Using element selectors (`div { }`) means you can never change the HTML without changing the CSS and vice versa. The CSS has hard dependencies on what type of HTML element is used. If a developer is unaware of these dependencies and makes changes to the HTML, the design will break. In this case, the `p` cannot be changed to a `div` without unforeseen consequences. Especially in projects where code changes rapidly, this can easily lead to time-consuming bugs.

Similarly, the nesting of selectors adds unnecessary dependencies. It means things are styled based on where they are in the hierarchy, not on what they are. They cannot be moved around without breaking something. Returning to our example, what if `call-to-action` needs to be used in another component? Right now, it's tied to the `.content-item` component and cannot be used elsewhere.

The scalable solution to both these problems is to use classes for each element and adopt a naming scheme. I highly recommend a [BEM-like naming](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) for components and simple hyphenation for other utility classes, but feel free to pick your own favourite scheme.

First, let's add a class with a BEM name to each element that needs to be styled. In the process, I'll rename `content-item-content` to `content-item__body` to better reflect what it does. I'll drop the `-label`-part of `call-to-action-label` as well.

    <div class="content-item">
        <a href="/episodes/the-label-maker" class="content-item__link">
            <h2 class="content-item__title">Episode: The Label Maker</h2>
            <div class="content-item__body">
                <div class="content-item__visual">
                    <img src="/images/some-image.jpg" class="content-item__image">
                </div>
                <div class="content-item__text">
                    <p>Jerry has two tickets to the Super Bowl but he cannot attend due to "the Drake's" wedding.</p>
                </div>
                <div class="content-item__call-to-action">
                    <p>Watch episode</p>
                </div>
            </div>
        </a>
    </div>

Next up, replace the element selectors with the new BEM-classes and remove their nesting.

    .content-item {
        position: relative;
        margin-bottom: 70px;

        a {
            display: block;
            text-decoration: none;

            &:hover {
                transition: opacity 0.2s ease;

                img {
                    opacity: 0.7;
                }
            }

            img {
                transform: translateZ(0);
                transition: opacity 0.2s ease;
                opacity: 1;
            }
        }
    }

    .content-item__title {
        color: #c40037;
    }

    .content-item__visual {
        height: 200px;
        overflow: hidden;

        img {
            display: block;
            width: 100%;
            height: auto;
        }
    }

    .content-item__text {
        background: url('../images/backgrounds/arrow-bg.png') center right no-repeat;
        padding: 30px 60px 30px 30px;
    }

    .content-item__call-to-action {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 170px;
        background: #c40037;
        z-index: 20;

        p {
            color: #FFFFFF;
            padding: 15px 30px 15px 20px;
            text-transform: uppercase;
            font: {
                weight: 700;
            }
            line-height: 17px;
        }
    }

There are fewer dependencies already. Notice how we started with several elements nested inside a `.ci-content { }` selector. After refactoring, they aren't nested anymore. We've gained flexibility: they can be moved around in the HTML without the layout breaking.

There are still some element selectors, so this step is not yet finished. Let's introduce some abstractions. Right now, the CSS for `content-item__call-to-action` consists of two parts: its positioning inside `content-item` and how it's supposed to look (colours et cetera). It would be good if we created a separate class for the latter so it can be re-used elsewhere.

    .content-item__call-to-action {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 170px;
        z-index: 20;
    }

    .call-to-action {
        padding: 15px 30px 15px 20px;
        font: {
            weight: 700;
        }
        line-height: 17px;
        color: #FFFFFF;
        text-transform: uppercase;
        background: #c40037;
    }

Both classes need to be applied to the corresponding element. (When working with BEM syntax, it can be a little hard to distinguish class names. Separate the class names with two spaces to improve  readability.)

    <div class="content-item__call-to-action  call-to-action">
        <p>Watch episode</p>
    </div>

Let's get rid of the `img` selector next. Its task is to make the image in `content-item` stretch the full width of the container. That seems like something that can be used in other places as well. A perfect candidate for a utility class. (Try to keep the number of properties inside utility classes as small as possible.)

    .content-item__visual {
        height: 200px;
        overflow: hidden;  
    }

    .full-width {
        display: block;
        width: 100%;
        height: auto;
    }

    <div class="content-item__visual">
        <img src="/images/some-image.jpg" class="content-item__image  full-width">
    </div>

The only element selector left is the `a` selector. It handles two things:

- Making sure the entire `content-item` is clickable and has no underline.
- Creating a fancy hover effect.

It's quite possible removing link underlines is something that will need to be done in other places, so let's make it a utility class. I've named it `block-link` to make it a bit more generic.

    .block-link {
        display: block;
        text-decoration: none;
    }

The hover effect is placed on the `a` element. That's an ancient leftover from a time where `:hover` only worked on actual hyperlinks in Internet Explorer. We're way past that, so let's move the `:hover` to  `content-item`. Also notice how the transition is defined on both the element and the hover state. That's unnecessary: when working with transitions, the transition needs to be defined only on the element, not the special state. On hover, just change the property that needs to be 'transitioned'.

    .content-item__image {
        transform: translateZ(0);
        transition: opacity 0.2s ease;
        
        .content-item:hover & {
            opacity: 0.7;
        }
    }

After all this refactoring, the CSS is a lot more readable. Instead of working your way through multiple nested selectors, it's now easy to see what each class does.

    .call-to-action {
        padding: 15px 30px 15px 20px;
        font: {
          weight: 700;
        }
        line-height: 17px;
        color: #FFFFFF;
        text-transform: uppercase;
        background: #c40037;
    }

    .full-width {
        display: block;
        width: 100%;
        height: auto;
    }

    .block-link {
        display: block;
        text-decoration: none;
    }

    .content-item {
        position: relative;
        margin-bottom: 70px;
    }

    .content-item__title {
        color: #c40037;
    }

    .content-item__visual {
        height: 200px;
        overflow: hidden;
    }

    .content-item__image {
        transform: translateZ(0);
        transition: opacity 0.2s ease;
        
        .content-item:hover & {
            opacity: 0.7;
        }
    }

    .content-item__text {
        background: url('../images/backgrounds/arrow-bg.png') center right no-repeat;
        padding: 30px 60px 30px 30px;
    }

    .content-item__call-to-action {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 170px;
        z-index: 20;
    }

The HTML:

    <div class="content-item">
        <a href="/episodes/the-label-maker" class="content-item__link  block-link">
            <h2 class="content-item__title">Episode: The Label Maker</h2>
            <div class="content-item__body">
                <div class="content-item__visual">
                      <img src="/images/some-image.jpg" class="content-item__image  full-width">
                </div>
                <div class="content-item__text">
                    <p>Jerry has two tickets to the Super Bowl but he cannot attend due to "the Drake's" wedding.</p>
                </div>
                <div class="content-item__call-to-action  call-to-action">
                    <p>Watch episode</p>
                </div>
            </div>
        </a>
    </div>

## Inconsistent values and properties with too big a scope (5)

When using colours in CSS, it's easy to introduce inconsistencies in their notations. My preference is to always use lowercase and use the shorthand three digit notation where possible. In our example, two types of casing are used. One color definition needs to change:

    .call-to-action {
        padding: 15px 30px 15px 20px;
        font: {
            weight: 700;
        }
        line-height: 17px;
        color: #fff; // Was: #FFFFFF
        text-transform: uppercase;
        background: #c40037;
    }
    
There's also a problem with the way the backgrounds are defined. The shorthand syntax (`background: ...`) seems convenient because it's shorter. However, if you define a background image on an element, and at a later point in the stylesheet you define a background colour with the shorthand syntax, the background image is removed.

    .johnson-rod {
        background-image: url(../images/johnson02.jpg);
    }
    
    // ... 
    
    .johnson-rod {
        background: #c43593;
        // Oops, the previously defined background image is now removed from the element.
    }

So, be careful with shorthand syntax. It can lead to unintended behaviour. My guideline: only use it if you're absolutely sure you want to change all properties that are affected by the shorthand. If you want to change only one property, just use that. 

After refactoring this:

    .call-to-action {
        padding: 15px 30px 15px 20px;
        font: {
            weight: 700;
        }
        line-height: 17px;
        color: #fff;
        text-transform: uppercase;
        background-color: #c40037;
    }
    
    .content-item__text {
        background-image: url('../images/backgrounds/arrow-bg.png');
        background-position: center right;
        background-repeat: no-repeat;
        padding: 30px 60px 30px 30px;
    }

## Lack of HTML5 elements (6)

HTML5 has been around for a while now. It can't hurt to actually use it to improve the semantics of the code.

The entire block can be placed anywhere on the page without losing its meaning, so it's fit to be an `article` element. 

    <article class="content-item">
        <a href="/episodes/the-label-maker" class="content-item__link  block-link">
            <h2 class="content-item__title">Episode: The Label Maker</h2>
            <div class="content-item__body">
                <div class="content-item__visual">
                      <img src="/images/some-image.jpg" class="content-item__image  full-width">
                </div>
                <div class="content-item__text">
                    <p>Jerry has two tickets to the Super Bowl but he cannot attend due to "the Drake's" wedding.</p>
                </div>
                <div class="content-item__call-to-action  call-to-action">
                    <p>Watch episode</p>
                </div>
            </div>
        </a>
    </article>

Images and other media can be marked up more sematically in HTML5, so let's make the visual a `figure` element. Also, let's add `title` and `alt` attributes for accessibility.

    <figure class="content-item__visual">
        <img src="/images/some-image.jpg" class="content-item__image  full-width" alt="Episode image: The Label Maker" title="The Label Maker">
    </figure>

## The end result (for now)

HTML:

    <article class="content-item">
        <a href="/episodes/the-label-maker" class="content-item__link  block-link">
            <h2 class="content-item__title">Episode: The Label Maker</h2>
            <div class="content-item__body">
                <figure class="content-item__visual">
                    <img src="/images/some-image.jpg" class="content-item__image  full-width" alt="Episode image: The Label Maker" title="The Label Maker">
                </figure>
                <div class="content-item__text">
                    <p>Jerry has two tickets to the Super Bowl but he cannot attend due to "the Drake's" wedding.</p>
                </div>
                <div class="content-item__call-to-action  call-to-action">
                    <p>Watch episode</p>
                </div>
            </div>
        </a>
    </article>

CSS:

    .call-to-action {
        padding: 15px 30px 15px 20px;
        font: {
            weight: 700;
        }
        line-height: 17px;
        color: #fff;
        text-transform: uppercase;
        background-color: #c40037;
    }

    .full-width {
        display: block;
        width: 100%;
        height: auto;
    }

    .block-link {
        display: block;
        text-decoration: none;
    }

    .content-item {
        position: relative;
        margin-bottom: 70px;
    }

    .content-item__title {
        color: #c40037;
    }

    .content-item__visual {
        height: 200px;
        overflow: hidden;
    }

    .content-item__image {
        transform: translateZ(0);
        transition: opacity 0.2s ease;
        
        .content-item:hover & {
            opacity: 0.7;
        }
    }

    .content-item__text {
        padding: 30px 60px 30px 30px;
        background-image: url('../images/backgrounds/arrow-bg.png');
        background-position: center right;
        background-repeat: no-repeat;        
    }

    .content-item__call-to-action {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 170px;
        z-index: 20;
    }

Of course, there are a couple of things that can be improved.

- The reasoning behind the decisions should be documented with comments.
- Add namespaces to classes to indicate their scope and intent.
- Introduce SASS/LESS variables.
- The pixel units can be changed to relative units to improve proportional scaling, which is helpful when designing responsive pages.
- Improve browser support by applying vendor prefixes to `transform` and `transition`.

## To sum up

The code is now more readable, extendable and maintainable. (I'm sure a few other *able*-adjectives can be applied, but three is enough.)

If you have any questions about how to create more scalable CSS: feel free to contact me; I might be available to help you get started.
