---
title: Finding outbound links with JavaScript
deck: You don’t need a regex
date: 2015-04-30 22:15
---

There comes a time in any web developer's career where they have to build something that finds outbound links on a page, for example to register clicks in analytics software, or to decorate them with an icon. It's one of those seemingly easy programming tasks that can get out of hand quickly. 

Your first instinct probably is to deconstruct the URL inside the `href` attribute. Does it start with ‘http’? Does it contain the domain name of the current site? And so on. Before you know it, you're lost inside a myriad of edge cases, `split` methods, substrings and `indexOf`s. Or even worse: a regular expression.

There's a little-known --- at least, I didn't know about this for way too long --- and elegant solution to this problem. A hyperlink has a host property which can be compared to the current page's host. The (jQuery based) code speaks for itself.

```
var pageHost = window.location.host;

$('a').on('click', function(e) {
	var isOutBound = $(this).prop('host') !== pageHost;
	
	if (isOutBound) {
		// Do something with outbound links
	}
});
```

It's not going to win any programming awards, but it's a nice little trick that condenses a lot of potentially buggy string manipulation into a single line of code.
