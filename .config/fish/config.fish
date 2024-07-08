if status is-interactive
    # Commands to run in interactive sessions can go here
end

alias g="git"
alias ga="git add"
alias gc="git commit"
alias gp="git push"
alias gr="git rebase"

eval "$(rbenv init -)"
eval "$(nodenv init -)"
eval "$(pyenv init -)"
eval "$(/usr/local/bin/brew shellenv)"

source ~/.work.fish
