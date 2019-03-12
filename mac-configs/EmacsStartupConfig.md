# Configuring Emacs on Mac OS X

All this wonderful config scheme came from 
[this web site](https://korewanetadesu.com/emacs-on-os-x.html).  I converted
it to markdown for easy reading and replication in this project.

Like the original author. . .

I wanted a nice experience using [Emacs for Mac OS X](http://emacsforosx.com/).  By "nice" I mean:

- Emacs runs in
  [server mode](http://www.gnu.org/software/emacs/manual/html_node/emacs/Emacs-Server.html).
- It is started like other OS X software by
  [Launch Services](https://developer.apple.com/library/mac/#documentation/Carbon/Conceptual/LaunchServicesConcepts/LSCIntro/LSCIntro.html).
- I can connect to it with graphical or terminal-based clients easily.
- Graphical clients use [Cocoa](https://developer.apple.com/technologies/mac/cocoa.html)
  and not X11.
- There is an icon on my dock to pop up a new graphical frame.
- There is a shell command I can type to open a new graphical frame.
- There is something I can type into Spotlight to open a new graphical frame.
- If the server is dead for some reason, there is a way to start it in a small
  number of clicks.
- If the server is dead for some reason, as many as the above features
  as possible still work.
- It is easy, but not the default, to start standalone (non-client) Emacs 
  instances as well.

You too can bring several hours and three separate scripting tools to bear on this, or follow the simple (hah hah) instructions below.

## Get a Proper Distribution of Emacs for Mac

First, install [Emacs For Mac OS X](http://emacsforosx.com/). The Emacs that comes with OS X is old and crusty, and the one at that site is new and Cocoa-ready and Retina-enabled and so on. Put it in `/Applications` - if you put it somewhere else, you'll need to correct all the other scripts I'm mentioning in this post.

## Emacs Server at Login

Open up the AppleScript Editor. If you're an Emacs user this probably looks awful and confusing to you. Paste the following into it:

``` applescript
tell application "Terminal"
do shell script "/Applications/Emacs.app/Contents/MacOS/Emacs --daemon"
end tell
```

Press ⌘K to compile it, then ⌘S and save it in `/Applications/Development`. (This subfolder keeps your Applications menu clean, and has an important effect on sort order later.)  Be sure to save it as a application (use the *File > Export* menu and pick “Application” as the file format). To give it a nice icon, select the original `Emacs.app`; press ⌘I; click the icon in the top-left; press ⌘C; select on your new `EmacsServer.app` bundle; press ⌘I; click the icon in the top-left; press ⌘V.

Open up *System Preferences > Users & Groups > Login Items* and now you can press the + button and choose EmacsServer.  The server is invisible until you first connect a client to it. Then it will appear in the dock, as the regular Emacs.app.

## New Frame Dock Icon

To make a dock icon that opens up a new Emacs frame - a client if the server is available, a standalone instance otherwise - create the following script in the AppleScript Editor and save it as an Application named EmacsClient in `/Applications/Development`.

``` applescript
tell application "Terminal"
try
   do shell script "/Applications/Emacs.app/Contents/MacOS/bin/emacsclient -c -n &"
   tell application "Emacs" to activate
on error
   do shell script "/Applications/Emacs.app/Contents/MacOS/Emacs"
end try
end tell
```

Then drag this from the Applications folder to your dock. This will also make it so typing `emacs` into Spotlight selects this as the first item ("Development" sorts before "Emacs", "Client" sorts before "Server").  If connected to the server, this opens up a new client frame each click, by design. To just raise existing frames, click the other Emacs icon on the dock, representing the running application.

## Server-aware Shell Scripts

I put these in `~/bin`. You'll need to add `~/bin` to your `$PATH` if you haven't already. First, two simple ones. These will start new instances, not clients, but they're necessary to properly handle shell arguments for fallbacks for clients. They're also nice to have if you actually want to start a new instance.

Start a new Cocoa instance - `emacsc`:

``` sh
#!/bin/sh
# start a new Cocoa instance
set -e
/Applications/Emacs.app/Contents/MacOS/Emacs "$@"
```

Start a new terminal instance - `emacst`:

``` sh
#!/bin/sh
# start a new terminal instance
set -e
/Applications/Emacs.app/Contents/MacOS/Emacs -nw "$@"
```

Now for something a little more complicated - `ec`, start a Cocoa client or fall back to a new instance (via the above `emacsc`) if the server is unavailable.

``` sh
#!/bin/sh
# script starts a Cocoa session of emacs as a client if the server is available
# or as an independent instance if there is no server
set -e
EMACSCLIENT=/Applications/Emacs.app/Contents/MacOS/bin/emacsclient
exec $EMACSCLIENT -c -a ~/bin/emacsc "$@"
```

Similarly, `et`, for a terminal client or new terminal instance.

``` sh
#!/bin/sh
# starts a terminal based session of emacs as a client if the server is
# available or as an independent instance if there is no server.
set -e
EMACSCLIENT=/Applications/Emacs.app/Contents/MacOS/bin/emacsclient
exec $EMACSCLIENT -t -a ~/bin/emacst "$@"
```

Why are `ec` and `et` implemented as scripts instead of aliases? Many tools will fail if `$EDITOR` does not resolve to an actual executable somewhere in `$PATH` because they invoke the tool directly instead of invoking a shell to run it.

Finally: Some aliases for `~/.bash_profile`, to override the ancient version of Emacs that Mac OS X comes with by default. I typically put the actual aliases in `~/.aliases` and source the `.aliases` file from within `~/.bash_profile`.  The `export` command must be in the `~/.bash_profile`.

``` sh
alias emacsclient="/Applications/Emacs.app/Contents/MacOS/bin/emacsclient"
alias emacs="ec"
export EDITOR="ec"
```

## Activate Emacs on New Frames

If you start `emacsc` or `ec` from Terminal, Mac OS X doesn't realize you probably want to switch focus to the Emacs session automatically. There are also plenty of other ways you might start Emacs besides typing a command into Terminal, and you probably want the new frames focused then as well.  To do this, we can take advantage of the `ns` features in Emacs Lisp and the `frame-creation` hooks. Add the following to your `~/.emacs` or some file it loads:

``` lisp
(when (featurep 'ns)
    (defun ns-raise-emacs ()
        "Raise Emacs."
        (ns-do-applescript "tell application \"Emacs\" to activate"))

    (defun ns-raise-emacs-with-frame (frame)
        "Raise Emacs and select the provided frame."
        (with-selected-frame frame
        (when (display-graphic-p)
            (ns-raise-emacs))))

    (add-hook 'after-make-frame-functions 'ns-raise-emacs-with-frame)

    (when (display-graphic-p)
        (ns-raise-emacs)))
```

Now anything that opens or selects a frame will also activate Emacs for Finder. The `featurep` check means this is harmless to load on non-OS X platforms, and `ns-raise-emacs` is not (interactive) for reasons that will be self-evident if you think about them.

## Remaining Issues

Launch Services is happy to start the Emacs Server instance but loses track of it afterwards. This is mostly harmless but annoying.  The second Emacs icon on the dock (the one for the main Emacs.app rather than your custom EmacsClient.app) behaves oddly when no frames are visible. Its menu bar and context menu don't work, and you can't start a new frame from it directly. This is likely an issue because both Emacs and Finder assume any graphical application has at least one main window / frame, even if it might not be visible.

(Thanks to Dan Gerrity for pointing out a typo in the original posted emacst script, and Sean B. Palmer for Emacs Lisp improvements that led to much simpler shell scripts.)