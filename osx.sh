#!/bin/sh

echo "✓ Enable 2D dock"
defaults write com.apple.dock no-glass -bool true

echo "✓ Enable Apple font-smoothing on non-Apple displays"
defaults write NSGlobalDomain AppleFontSmoothing -int 2

echo "✓ Enable tab switching in modal windows and other keyboard navigation perks"
defaults write NSGlobalDomain AppleKeyboardUIMode -int 3

echo "✓ Enable current directory as the default scope for Finder search"
defaults write com.apple.finder FXDefaultSearchScope -string "SCcf"

echo "✓ Expand 'Save' panel by default"
defaults write NSGlobalDomain NSNavPanelExpandedStateForSaveMode -bool true

echo "✓ Expand 'Print' panel by default"
defaults write NSGlobalDomain PMPrintingExpandedStateForPrint -bool true

echo "✓ Disable shadow in screenshots"
defaults write com.apple.screencapture disable-shadow -bool true

echo "✓ Disable spelling correction"
defaults write NSGlobalDomain NSAutomaticSpellingCorrectionEnabled -bool false

