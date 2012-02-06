---
title: Cloud9 and Ender
layout: default
---

[Ender](http://ender.no.de) doesn't work out-of-the-box on [Cloud9](http://c9.io). The the homedir in cloud9 is not accessible, and the workaround is to `set process.env.HOME` to the current directory/workspace.
