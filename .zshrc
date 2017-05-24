# Path to your oh-my-zsh configuration.
ZSH=$HOME/.oh-my-zsh

# Set name of the theme to load.
# Look in ~/.oh-my-zsh/themes/
# Optionally, if you set this to "random", it'll load a random theme each
# time that oh-my-zsh is loaded.
ZSH_THEME="mariusz"

# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
alias gc="git commit -a"
alias gca="git commit -a"
alias ga="git add"
alias gs="git status"
alias gp="git push"
alias gm="git merge"
alias g="git"
alias gprm="git pull --rebase origin master"
alias gprd="git pull --rebase origin develop"
alias gpr="git pull --rebase"
alias gr="git rebase"
alias grc="git rebase --continue"

# Set to this to use case-sensitive completion
# CASE_SENSITIVE="true"

# Comment this out to disable bi-weekly auto-update checks
# DISABLE_AUTO_UPDATE="true"

# Uncomment to change how often before auto-updates occur? (in days)
# export UPDATE_ZSH_DAYS=13

# Uncomment following line if you want to disable colors in ls
# DISABLE_LS_COLORS="true"

# Uncomment following line if you want to disable autosetting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment following line if you want to disable command autocorrection
# DISABLE_CORRECTION="true"

# Uncomment following line if you want red dots to be displayed while waiting for completion
# COMPLETION_WAITING_DOTS="true"

# Uncomment following line if you want to disable marking untracked files under
# VCS as dirty. This makes repository status check for large repositories much,
# much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Which plugins would you like to load? (plugins can be found in ~/.oh-my-zsh/plugins/*)
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)

plugins=(git osx rails ruby rbenv bundler)
source $ZSH/oh-my-zsh.sh

# Customize to your needs...

export GOPATH=$HOME/go
export GOROOT=/usr/local/go

export RBENV_ROOT=~/.rbenv
export PG_ROOT=/Applications/Postgres.app/Contents/Versions/9.4

export NODE_PATH=/usr/local/lib/node:/usr/local/lib/node_modules

export PATH=$RBENV_ROOT/bin:/usr/local/share/npm/bin:/usr/local/bin:/usr/local/sbin:/usr/local/share/npm/bin:$PG_ROOT/bin:/usr/local/go/bin:/usr/bin:/usr/sbin:/bin:/sbin:$GOPATH/bin

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export LANGUAGE=en_US.UTF-8

eval "$(rbenv init -)"

source ~/.zshrc.work
