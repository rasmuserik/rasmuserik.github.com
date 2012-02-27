setxkbmap us mac
echo 'remove Lock = Caps_Lock
 keycode  66 = Escape
 keycode  23 = Tab ISO_Left_Tab
 keycode  9  = Caps_Lock
add Lock = Caps_Lock' > /tmp/xmodmap.rje
xmodmap /tmp/xmodmap.rje
