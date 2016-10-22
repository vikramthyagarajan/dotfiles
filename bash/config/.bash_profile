export PATH="$PATH:$HOME/.rvm/bin" # Add RVM to PATH for scripting
export PATH=/usr/local/bin:$PATH # Setting our local scripts as higher priority than system scripts

[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

export JENV_ROOT=/usr/local/var/jenv
# if which jenv > /dev/null; then eval "$(jenv init -)"; fi

export DEFAULT_USER="vikramthyagarajan"

# aliasing vim so that it opens neovim
alias vim=nvim
