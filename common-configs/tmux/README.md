# Tmux Configuration

most of this is stolen from [This Visually Stunning Tmux Config](https://github.com/gpakosz/.tmux)

a great source of configuration information is in [Tao of Tmux](https://leanpub.com/the-tao-of-tmux/read)

to use it, be sure to install the PowerlineSymbols font on the host (I use Fontbook on MacOS).
the .otf file is available in this repo.

to make sure that all tmux config changes are made under source control, the configuration should
be edited under this project.  The files used by tmux will be symlinks that point to these
config files under change control.  so once you have a local repo of the SystemConfigs project,
please enter the following commands:

```
cd $HOME
ln -s <path-to-SystemConfigs>/SystemConfigs/common-configs/tmux/dotTmux/dotTmux.conf $HOME/.tmux.conf
ln -s <path-to-SystemConfigs>/SystemConfigs/common-configs/tmux/dotTmux/dotTmux.conf.local $HOME/.tmux.conf.local
```

change controlled customizations are made to the dotTmux.conf.local file

also to get copy/paste working on MacOS install the reattach-to-user-namespace
package from home brew

```
brew install reattach-to-user-namespace
```

