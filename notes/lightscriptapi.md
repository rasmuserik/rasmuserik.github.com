---
title: LightScript API notes
layout: default
category/categories: 
---

## Initial

These are the baseline

## Local

    .loadImage(url,callback)
    .createCanvas(w,h)
    .getScreenCanvas()
    .getStorage()
    .scriptRequest(url)
    //httpRequest...

### Canvas

    .canvas
    .canvas.height
    .canvas.width

    .drawImage(src,dest_x,dest_y)
    .drawImage(src,src_x,src_y,src_w,src_h,dest_x,dest_y,dest_w,dest_h)

    .fillStyle = ...
    .font = ...
    .fillRect(x,y,w,h)
    .fillText(text,x,y)
    .measureText(text)

    .getImageData(x,y,w,h)
    .putImageData(src,x,y)

### Storage

    .getItem(key)
    .setItem(key, value)
    .removeItem(key)

## JavaScript Standard

- String
- Math.random
- RegExp

## Events

- keydown/keyup
- touch/mouse
  - move
  - down/press
  - up/release/leave
  - multitouch-zoom/...
- resize/(rotate)
- main/ready

## Detect

- dpi
- input-methods
