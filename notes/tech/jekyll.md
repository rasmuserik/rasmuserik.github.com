---
title: Jekyll / github-pages
layout: default
category/categories: 
---

# Run local version on ubuntu maverick

Install/run:

    sudo apt-get install ruby1.9.1-full
    sudo gem1.9.1 install jekyll
    sudo gem1.9.1 install rdiscount
    sudo gem1.9.1 install RedCloth

Run locally at port 4000:

    /var/lib/gems/1.9.1/bin/jekyll --auto --server --pygments --safe

# Making gh-pages on repos, and sync

    git branch gh-pages
    git push origin gh-pages
    
## Sync master branch to gh-pages

    git checkout gh-pages
    git merge master
    git push
    git checkout master

