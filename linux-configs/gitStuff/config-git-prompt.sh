#! /bin/sh

#Summary git status for files in current directory
export GIT_PS1_SHOWDIRTYSTATE=1
export GIT_PS1_SHOWSTASHSTATE=1
export GIT_PS1_SHOWUNTRACKEDFILES=1

# Colors for prompt
DEFAULT="\[\033[0;00m\]"
GREEN="\[\033[0;32m\]"
YELLOW="\[\033[0;33m\]"
CYAN="\[\033[0;36m\]"
MAGENTA="\[\033[0;35m\]"
TEAL="\[\033[0;36m\]"

export PS1=$CYAN"\u@\h:"$MAGENTA"\W"$YELLOW'$(__git_ps1 "(%s)")'$CYAN"-> "$DEFAULT
