# mh theme
# preview: https://cl.ly/1y2x0W0E3t2C0F29043z

# features:
# path is autoshortened to ~30 characters
# displays git status (if applicable in current folder)
# turns username green if superuser, otherwise it is white

# if superuser make the username red and the end the prompt with a red '!'
if [ $UID -eq 0 ]; then NCOLOR="red"; else NCOLOR="white"; fi

# prompt
PROMPT='[%{$fg[$NCOLOR]%}%B%n%b%{$reset_color%}%\@%{$fg[cyan]%}%m%{$reset_color%}:%{$fg[magenta]%}%30<...<%~%<<%{$reset_color%}]%(!.%{$fg[$NCOLOR]%}%B!%b%{$reset_color%}.->) '
# PROMPT='[%{$fg[$NCOLOR]%}%B%n%b%\@%m%{$reset_color%}:%{$fg[magenta]%}%30<...<%~%<<%{$reset_color%}]%(!.#.$) '
# RPROMPT='$(git_prompt_info)'  # need to fix this to use zsh-git-prompt module
RPROMPT='$(git_super_status)'

# git theming - right now, I'm leaving it to the git prompt module
#               eventually this should be contolled as part of the shell theme
ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg_bold[gray]%}("
ZSH_THEME_GIT_PROMPT_BRANCH="%{$fg_no_bold[yellow]%}%B"
ZSH_THEME_GIT_PROMPT_BEHIND="%{↓%G%}"
ZSH_THEME_GIT_PROMPT_AHEAD="%{↑%G%}"
ZSH_THEME_GIT_PROMPT_SEPARATOR="%b|"
ZSH_THEME_GIT_PROMPT_STAGED="%{$fg[red]%}%{●%G%}"
ZSH_THEME_GIT_PROMPT_CONFLICTS="%{$fg[red]%}%{✖%G%}"
ZSH_THEME_GIT_PROMPT_CHANGED="%{$fg[blue]%}%{✚%G%}"
ZSH_THEME_GIT_PROMPT_UNTRACKED="%{…%G%}"
ZSH_THEME_GIT_PROMPT_CLEAN="%{$fg_bold[green]%}%{✔%G%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%b%{$fg_bold[gray]%})%{$reset_color%} "

# not used by git_super_status
# ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg_bold[red]%}✱"

# I prefer to let the default LS colors be used based on the palette being used
# for the terminal "theme". That much remains consistent when I change shells.
#
# LS colors, made with https://geoff.greer.fm/lscolors/
# export LSCOLORS="Gxfxcxdxbxegedabagacad"

# someday it might be interesting to set these up by extension
# export LS_COLORS='no=00:fi=00:di=01;34:ln=00;36:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=41;33;01:ex=00;32:*.cmd=00;32:*.exe=01;32:*.com=01;32:*.bat=01;32:*.btm=01;32:*.dll=01;32:*.tar=00;31:*.tbz=00;31:*.tgz=00;31:*.rpm=00;31:*.deb=00;31:*.arj=00;31:*.taz=00;31:*.lzh=00;31:*.lzma=00;31:*.zip=00;31:*.zoo=00;31:*.z=00;31:*.Z=00;31:*.gz=00;31:*.bz2=00;31:*.tb2=00;31:*.tz2=00;31:*.tbz2=00;31:*.avi=01;35:*.bmp=01;35:*.fli=01;35:*.gif=01;35:*.jpg=01;35:*.jpeg=01;35:*.mng=01;35:*.mov=01;35:*.mpg=01;35:*.pcx=01;35:*.pbm=01;35:*.pgm=01;35:*.png=01;35:*.ppm=01;35:*.tga=01;35:*.tif=01;35:*.xbm=01;35:*.xpm=01;35:*.dl=01;35:*.gl=01;35:*.wmv=01;35:*.aiff=00;32:*.au=00;32:*.mid=00;32:*.mp3=00;32:*.ogg=00;32:*.voc=00;32:*.wav=00;32:'

    # © 2020 GitHub, Inc.
    # Terms
    # Privacy
    # Security
    # Status
    # Help

    # Contact GitHub
    # Pricing
    # API
    # Training
    # Blog
    # About

