---
title: Browser platforms
layout: default
category/categories: 
---

I use the following in my daily activities:

- Firefox 4 (Gecko 2.0) Good JavaScript implementation, good extension support (noscript/betterprivacy/etc.), used for daily browsing
- Firefox Mobile (Gecko 2.0) Firefox 4 with less extensions but with better touch support and installable on mobile phones
- latest Chrome (WebKit + v8) Good JavaScript implementation, used for debugging
- Prism (Gecko 1.9.?) Used for sandboxing mail, social-networking, calendar etc.

When playing around with client-side JavaScript on my own, I expect certain standard apis (such as localstorage and canvas) to be available, which means that the code will only have a chance to run in recent browser engines such as:

- Gecko 1.9.1 (Firefox 3.5+, Firefox Mobile, ...)
- WebKit 525 certain versions (Safari 4+, Chrome 4+, iOS 3+, Android 2+, BlackBerry 6+, Palm WebOS 2+, Bada, ...)
- Presto 2.5 certain versions (Opera 11 including mobile, but not mini)
- Trident 5 (Internet Explorer 9) - may or may not work, not fully standard compliant

Platforms:

- Desktops - Linux, Windows, OS-X - any browser modern, updated to _latest_ version should work (possibly except Internet Explorer)
- Android 2+, iOS 3+, Palm WebOS 2+, BlackBerry 6+, Bada - should work out-of-the box if up to date
- Other Android 1.6+, iOS, MeeGo, Windows Phone 7 and Symbian - Firefox or Opera needs to be installed
- Low-end/feature phones - runtime for these on top of J2ME are under development... 

References: browser vendor pages, plus http://www.quirksmode.org/webkit.html and http://en.wikipedia.org/wiki/Comparison_of_layout_engines_(HTML5)
