#!/bin/sh

defaults write com.apple.dock no-glass -bool true
defaults write NSGlobalDomain AppleFontSmoothing -int 1
defaults write NSGlobalDomain AppleKeyboardUIMode -int 3
defaults write com.apple.finder FXDefaultSearchScope -string "SCcf"
defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true
defaults write NSGlobalDomain PMPrintingExpandedStateForPrint -bool true
defaults write com.apple.screencapture disable-shadow -bool true
defaults write NSGlobalDomain NSAutomaticSpellingCorrectionEnabled -bool false

