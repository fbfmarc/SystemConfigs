#!/bin/sh
# script starts a Cocoa session of emacs as a client if the server is available
# or as an independent instance if there is no server
set -e
EMACSCLIENT=/Applications/Emacs.app/Contents/MacOS/bin/emacsclient
exec $EMACSCLIENT -c -a ~/bin/emacsc "$@"