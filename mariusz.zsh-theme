# ZSH Theme - Preview: http://cl.ly/350F0F0k1M2y3A2i3p1S

export CLICOLOR=1
export LSCOLORS=gxBxhxDxfxhxhxhxhxcxcx

PROMPT='%{$fg_bold[green]%}%T%{$reset_color%} %~/%{$reset_color%}%# '
RPROMPT='$(git_prompt_info)'

ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg[green]%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%} "
