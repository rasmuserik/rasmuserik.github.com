---
title: Jekyll / github-pages on ubuntu maverick
layout: default
category/categories: 
---

# Run local version

Install/run:

    sudo apt-get install ruby1.9.1-full
    sudo gem1.9.1 install jekyll

Run locally at port 4000:

    /var/lib/gems/1.9.1/bin/jekyll --auto --server --pygments --safe

# Making gh-pages on repos

    git branch gh-pages
    git push origin gh-pages

## Sync gh-pages

    git checkout gh-pages
    git merge master
    git push
    git checkout master

