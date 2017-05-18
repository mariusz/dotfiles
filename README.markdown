# Installation

These vimfiles are using [Vundle](https://github.com/gmarik/vundle) to
organize plugins and assumes you have external dependencies like Git or
Ack installed already. To install, simply clone this repository, then run

    git clone https://github.com/VundleVim/Vundle.vim.git
~/.vim/bundle/Vundle.vim

in the repository directory to install Vundle. If you cloned this repository
outside of the home directory, for example `~/vimfiles`, link all your files
to your home directory:

    ln -s ~/vimfiles/.vim ~/.vim
    ln -s ~/vimfiles/.vimrc ~/.vimrc
    ln -s ~/vimfiles/.gvimrc ~/.gvimrc

After you're done, run your Vim and exec `:BundleInstall` command to install
all the plugins. You'll probably need to `:source ~/.vimrc` or restart your
Vim after that. 

If you want to make tmux work with the current track script (unfortunately 
currently Mac & Spotify only), you will need to do

    export VIMFILES=your/vimfiles/dir

## Go support

For working Go support, you need to set `$GOROOT` in your config.

**Happy vimming!**
