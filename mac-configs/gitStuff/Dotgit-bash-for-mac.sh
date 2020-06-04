#!/bin/bash

source ~/.git-completion.bash
source ~/.git-prompt.sh

#Summary git status for files in current directory
export GIT_PS1_SHOWDIRTYSTATE=1     # '*' for unstaged, '+' for staged
export GIT_PS1_SHOWSTASHSTATE=1     # '$' if there's a stash 
export GIT_PS1_SHOWUNTRACKEDFILES=1 # '%' if there are untracked files
export GIT_PS1_SHOWUPSTREAM="auto"  # "<" you're behind, ">" you're ahead, 
                                    # "<>" you've diverged, "=" no difference.

# Colors for prompt (note that these colors will be taken from the terminal color scheme)
DEFAULT="\[\033[0;00m\]"
GREEN="\[\033[0;32m\]"
YELLOW="\[\033[0;33m\]"
CYAN="\[\033[0;36m\]"
MAGENTA="\[\033[0;35m\]"
BLUE="\[\033[0;34m\]"

export PS1=$CYAN"\u@\h:"$MAGENTA"\W"$YELLOW'$(__git_ps1 "(%s)")'$CYAN"-> "$DEFAULT
