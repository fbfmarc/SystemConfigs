# ZSH Considerations

This directory contains zsh configuration files and the rationale for some of
their content. If zsh is being used, then the zsh config directory should be
symlinked to the local copy of this repo.  That way any changes to the
configuration can be managed properly and shared across machines when they have
been debugged and pushed to the remote repo.

## Key Points

- **No** specific package manager
  - Packages consist of themes and plugins
  - Themes are actually zsh scripts - just source them
  - Plugins are aliases and scripts - just source them, in fact we can refer to
  them as "modules"
  - There is a ***downside*** to not using something like [Oh my Zsh](https://ohmyz.sh).
  That particular plugin manager also has a library of scripts for interacting
  with the [Git](https://git-scm.com) version control system.  Therefore, themes
  and plugins written for this package manager have the ability to use that
  library to generate sophisticated prompts that include detailed information
  about a local git repository whenever the current working directory is in such
  a repo.  Without such a package manager, conventional scripts for git
  information must be used and maintained separately.  Such libraries also contain
  a number of pre-defined aliases for general use.  I prefer to define my own
  and use a module for special purpose aliases that apply to development
  ecosystems like ruby or node.
- Use a `.zshenv` symlink in `$HOME` to point to a zshenv file in this repo. The
zshenv file in this repo will set this repo to be the configuration location
for zsh
- Have a one line `.zshrc` file in the repo that sources a `zshrc.local` file.
custom zsh code goes in the local file.  If we ever do install some package that
messes with`.zshrc`, all our customizations will be safe in the local file.
- There will be `modules` and `themes` directories in the repo
- Prompt modifications for working in git repos in zsh will be drawn from a
special "module" described below.

## Modules

The only modules/plugins I want to start with are:

- zsh-autosuggestions
- zsh-syntax-highlighting
- zsh-git-prompt (see more below)

Not sure if the macOS module or some others may be added in the future.

### Installation of Modules/Plugins

Because of the lack of package manager, installation of plugins will be manual
with applicable source kept in this repo.  That is, neither a zsh package
manager nor homebrew will be used.

## Themes

It is important to not set colors with hex color codes.  Instead, refer to the
colors by name.  That way, the zsh themes work with the color scheme chosen for
the terminal emulator program.

If we copy/download a theme from a theme repo, it may be necessary to modify
color references so that "shell themes" stay consistent with the palette of the
terminal.

It will also be necessary to modify any oh-my-zsh themes to avoid the internal
oh-my-zsh libraries for things like the vcs-info functions that contribute to
prompt modification for git repos.  Vcs-info functions should be replaced by
calls to the module below.

## Git Repo Status Support

Many themes use a package to display the status of a git repos when the current
working directory is within such a repo. To help support this under zsh, we are
going to take advantage of a script from
[this github repo](https://github.com/olivierverdier/zsh-git-prompt). This
provides a `git_super_status()` function that can be used to setup and configure
a ZSH prompt. This support script will be treated like a *plugin* and its code
will be located in the `modules` directory in this repo.
