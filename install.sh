#!/bin/bash

# Install oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Link stuff
ln -s ~/dotfiles/.zshrc ~
ln -s ~/dotfiles/.vimrc ~
ln -s ~/dotfiles/.gitconfig ~
ln -s ~/dotfiles/mariusz.zsh-theme ~/.oh-my-zsh/themes/

# Install vim-plug
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
