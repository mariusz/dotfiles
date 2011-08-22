# Installation

These vimfiles are using [Vundle](https://github.com/gmarik/vundle) to
organize plugins and assumes you have external dependencies like Git or
Ack installed already. To install, simply clone this repository, then run

    git submodule update --init

in the repository directory to install Vundle. If you cloned this repository
outside of the home directory, for example `~/vimfiles`, link all your files
to your home directory:

    ln -s ~/vimfiles/.vim ~/.vim
    ln -s ~/vimfiles/.vimrc ~/.vimrc
    ln -s ~/vimfiles/.gvimrc ~/.gvimrc

After you're done, run your Vim and exec `:BundleInstall` command to install
all the plugins. 

**Happy vimming!**