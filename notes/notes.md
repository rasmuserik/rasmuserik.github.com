---
title: Notes 
layout: default
category/categories: 
---


# Shell
... shell stuff I forget all the time.


git rewrite subdir to repos
    git filter-branch --subdirectory-filter SUBDIR -- --all


exporting project to github
    git remote add origin git@github.com:rasmuserik/PROJECTNAME.git
    git push -u origin master
          
link-install npm package in local directory
    npm link

docco: remember to install/have pygments in the path. 

sync
    unison localdir ssh://host/remotedir

# Mac

## Applications 

- firefox + noscript + adblock
- vlc
- homebrew: git node
- macports
- node+npm+underscore+...
- iterm2
- VirtualBox + ubuntu

## System Preferences

- enable virtual desktops, ie. "Spaces" 
- enable disk encryption, firewall and password protection
- enable da+en keyboard, and shortcut for switching between them, kill capslock under modifier keys, use f[1-9]-keys
- enable mouse handling
- hide dock by default
- vlc as dvd/cd handler

- capslock -> esc. http://pqrs.org/macosx/keyremap4macbook/extra.html
- iterm2 - better terminal execept international symbols
- terminal pg-up/pgdown, etc.: End \033[4~ Home \033[1~ Page-Down \033[6~ Page-Up \033[5~

## mobile development

- github:jhaynie/iphonesim for launching ios simulator
- xcodebuild - xcode's make

## notes

MacPorts checksum error:
    sudo port selfupdate
    sudo port clean --dist <portname>
    sudo port install <portname>
