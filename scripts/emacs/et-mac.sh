#!/bin/sh
# starts a terminal based session of emacs as a client if the server is
# available or as an independent instance if there is no server.
set -e
EMACSCLIENT=/Applications/Emacs.app/Contents/MacOS/bin/emacsclient
exec $EMACSCLIENT -t -a ~/bin/emacst "$@"