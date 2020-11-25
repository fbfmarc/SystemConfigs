; hate the stupid tool bar

;; Added by Package.el.  This must come before configurations of
;; installed packages.  Don't delete this line.  If you don't want it,
;; just comment it out by adding a semicolon to the start of the line.
;; You may delete these explanatory comments.
(package-initialize)

(tool-bar-mode -1)
(menu-bar-mode -1)

;no stupid *GNU Emacs* buffer on startup
(setq inhibit-startup-screen t)

;searches should stay case sensitive
(setq case-fold-search nil)

;transient mark mode
(transient-mark-mode 1)
 
;colors and themes
(add-to-list 'custom-theme-load-path "~/.emacs.d/themes")

;try to keep emacs colors reasonable in terminals and windows
(defun on-after-init ()
  (unless (display-graphic-p (selected-frame))
    (load-theme 'midnight t)))

(add-hook 'window-setup-hook 'on-after-init)

; some code to help macOS switch focus to newly created emacs sessions
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
(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(custom-enabled-themes (quote (monokai)))
 '(custom-safe-themes
   (quote
    ("bd7b7c5df1174796deefce5debc2d976b264585d51852c962362be83932873d9" "6b4f7bde1ce64ea4604819fe56ff12cda2a8c803703b677fdfdb603e8b1f8bcb" "b6f06081b007b57be61b82fb53f27315e2cf38fa690be50d6d63d2b62a408636" "c1b0ae9c3ae6f656b15e39742a3ca3c4050650747209db066be4f1824cd87b2a" "daeaa8249f0c275de9e32ed822e82ff40457dabe07347fe06afc67d962a3b1e9" "45482e7ddf47ab1f30fe05f75e5f2d2118635f5797687e88571842ff6f18b4d5" "e26e879d250140e0d4c4d5ab457c32bcb29742599bd28c1ce31301344c6f2a11" "2ea9afebc23cca3cd0cd39943b8297ce059e31cb62302568b8fa5c25a22db5bc" "31772cd378fd8267d6427cec2d02d599eee14a1b60e9b2b894dd5487bd30978e" "b4fd44f653c69fb95d3f34f071b223ae705bb691fb9abaf2ffca3351e92aa374" "4c8372c68b3eab14516b6ab8233de2f9e0ecac01aaa859e547f902d27310c0c3" "72a81c54c97b9e5efcc3ea214382615649ebb539cb4f2fe3a46cd12af72c7607" "9b59e147dbbde5e638ea1cde5ec0a358d5f269d27bd2b893a0947c4a867e14c1" "58c6711a3b568437bab07a30385d34aacf64156cc5137ea20e799984f4227265" "e9776d12e4ccb722a2a732c6e80423331bcb93f02e089ba2a4b02e85de1cf00e" "c48551a5fb7b9fc019bf3f61ebf14cf7c9cdca79bcb2a4219195371c02268f11" default)))
 '(org-agenda-files (quote ("~/todo.org")))
 '(package-selected-packages (quote (monokai-theme magit))))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )


; packages


(require 'package)
(add-to-list 'package-archives
             '("melpa" . "http://melpa.org/packages/") t)
(package-initialize)

(editorconfig-mode 1)

