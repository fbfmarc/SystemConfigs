# Alacritty Terminal Usage

This area holds the configuration files and conventions for the Alacritty terminal emulator.  Alacritty is noted for its speed and simplicity. As an opensource project, there is a lot of valuable information on the [Alacritty Github site](https://github.com/alacritty/alacritty). 

Alacritty is installled using conventional package management.  It is available as a package for linux distributions and available as a homebrew package for macOS. It is also available for Windows.  Check the site for additional details.

## configuration

Alacritty is conconfigured with a YAML file called `alacritty.yml`. Alacritty looks for its configuration file in the users `$HOME/.config/alacritty`. To keep the config of alacritty under source control, the actual alacritty.yml is here in the config directory in this repo.  To use it, a symlink is used. This is done using the following commands before starting alacritty.

``` bash
    cd ~/.config/
    ln -s $HOME/projects/SystemConfigs/common-configs/AlacrittyTerminal/config ./alacritty
```

Changes to the configuration take place in the repo and as optimizations are put in place, they can be committed and shared by pushing to the upstream repo.

## Colors and Themes

Alacritty is a true color terminal. Color themes are available and are coded by replacing certain elements in the configuration file. Due to the popularity of applying color themes to terminals, a utility has been developed to edit the config file and replace the color elements automatically.  This utility is actually a python program and it works with "theme files" that contain color "sets" that can be inserted into the alacritty configuration file.  The utility is called `alacritty-colorscheme`. It is available on github at the [alacritty-colorscheme site](https://pypi.org/project/alacritty-colorscheme/).

**N.B.** This utility is installed using python package infrastructure. On macOS, it requires an addition to the users `$PATH` variable to include the location where this utility is installed.

The proram is written in python 3.9 so that's the version of python and pip that is needed to install and run the program.

This repo contains 2 directories filled with popular color theme files that can be used by alacritty-colorscheme.  

## Aliases

Because the command line syntax for changing the color scheme is verbose and therefore error prone, some convenient aliases are defined to help.  This alias file can be sourced during shell start up. Again, this file is kept under source control in this repo.
