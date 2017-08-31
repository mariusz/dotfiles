# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [4.4.3] - 2017-08-30
## Fixed
- Fixes [#135](https://github.com/eamodio/vscode-gitlens/issues/135) - Full-width characters break gutter annotations (really this time)

## [4.4.2] - 2017-08-29
## Fixed
- Fixes [#135](https://github.com/eamodio/vscode-gitlens/issues/135) - Full-width characters break gutter annotations

## [4.4.1] - 2017-08-23
## Fixed
- Fixes [#114](https://github.com/eamodio/vscode-gitlens/issues/114) - Stylus files makes code lens freak out

## [4.4.0] - 2017-08-18
## Added
- Adds a progress indicator to the `Toggle File Blame Annotations` command (`gitlens.toggleFileBlame`) icon -- pulses while annotations are computed
- Adds an active state to the `Toggle File Blame Annotations` command (`gitlens.toggleFileBlame`) icon -- turns orange while the annotations are visible
- Adds automatic disabling of the current line blame annotations when starting a debug session and will restore them when the debug session ends -- can still be manually toggled via the `Toggle Line Blame Annotations` command (`gitlens.toggleLineBlame`)

## Changed
- Changes chat links from Gitter to [Slack](https://join.slack.com/t/vscode-gitlens/shared_invite/MjIxOTgxNDE3NzM0LTE1MDE2Nzk1MTgtMjkwMmZjMzcxNQ)
- Changes the look of the line separators on the gutter blame annotations
- Changes the `gitlens.advanced.toggleWhitespace.enabled` configuration setting to default to `false` -- thanks to the awesome work in vscode by Alexandru Dima ([@alexandrudima](https://github.com/alexandrudima)) this is no longer required!

## Removed
- Removes unneeded `gitlens.stashExplorer.enabled` configuration setting since users can add or remove custom views natively now
- Removes unneeded `Toggle Git Stashed Explorer` command (`gitlens.stashExplorer.toggle`) since users can add or remove custom views natively now
- Removes the `gitlens.theme.annotations.file.hover.separateLines` configuration setting

## Fixed
- Fixes jumpiness when opening a diff to a certain line

## [4.3.3] - 2017-07-28
## Added
- Adds progress indicator for when computing annotations takes a while

## Changed
- Optimizes performance of the providing blame annotations, especially for large files (saw a 3.5x improvement on some files)

## Fixed
- Fixes [#107](https://github.com/eamodio/vscode-gitlens/issues/107) - Double-byte characters break blame layout (still requires proper font support)

## [4.3.2] - 2017-07-20
## Fixed
- Fixes [#118](https://github.com/eamodio/vscode-gitlens/issues/118) - GitLens stopped working on latest insiders build -- thanks to [PR #121](https://github.com/eamodio/vscode-gitlens/pull/121) by Johannes Rieken ([@jrieken](https://github.com/jrieken))

## [4.3.1] - 2017-07-03
## Added
- Adds `gitlens.stashExplorer.enabled` setting to specify whether or not to show the `Git Stashes` explorer
- Adds `Toggle Git Stashed Explorer` command (`gitlens.stashExplorer.toggle`) - toggles the `Git Stashes` explorer on and off

## Changed
- Hides the `Git Stashes` explorer by default

## Fixed
- Fixes [#108](https://github.com/eamodio/vscode-gitlens/issues/108) - Option to remove stash explorer from the main explorer?

## [4.3.0] - 2017-07-03
## Added
- Adds `Git Stashes` view to the Explorer activity

  ![Git Stashes view](https://raw.githubusercontent.com/eamodio/vscode-gitlens/master/images/screenshot-git-stashes.png)

  - Shows all of the stashed changes in the repository
  - Provides toolbar buttons to `Stash Changes` and `Refresh`
  - Provides a context menu with `Apply Stashed Changes` and `Delete Stashed Changes` commands - both require a confirmation
  - Expand each stash to quickly see the set of files changed, complete with status indicators for adds, changes, renames, and deletes
    - Provides a context menu with `Open Changes`, `Open File`, `Open Stashed File`, `Open File in Remote`, and `Compare File with Working Tree` commands

## [4.2.0] - 2017-06-27
## Added
- Adds `Compare File with Revision...` command (`gitlens.diffWithRevision`) - compare the active file with the selected revision of the same file
- Adds `Open Changed Files` command (`gitlens.openChangedFiles`) to the source control group context menu
- Adds `Close Unchanged Files` command (`gitlens.closeUnchangedFiles`) to the source control group context menu
- Adds `Open File in Remote` command (`gitlens.openFileInRemote`) to the source control resource context menu
- Adds `Compare File with Revision...` command (`gitlens.diffWithRevision`) to the source control resource context menu
- Adds `Show File History` command (`gitlens.showQuickFileHistory`) to the source control resource context menu

## Changed
- Renames `Compare File with...` command to `Compare File with Branch...`
- Renames `Open Line Commit in Remote` command to `Open Commit in Remote`
- Renames `Show Line Commit Details` command to `Show Commit File Details`
- Updates the description of `gitlens.blame.line.enabled` to be clearer about its behavior
- Updates the description of `gitlens.codeLens.enabled` to be clearer about its behavior

### Fixed
- Fixes [#103](https://github.com/eamodio/vscode-gitlens/issues/103) - Toggle file blame annotations disables line blame annotations if line blame annotations are off by default
- Fixes another infinite loop in the `Close Unchanged Files` command

## [4.1.4] - 2017-06-25
## Changed
- Optimizes performance of the `Compare with Previous` commands - also avoids trying to focus a line if we don't have one

### Fixed
- Fixes `changes` (diff) hover not showing the correct previous line (for real this time)
- Attempts to fix [#99](https://github.com/eamodio/vscode-gitlens/issues/99) - undo/redo spawns too many git processes

## [4.1.3] - 2017-06-20
### Fixed
- Fixes `changes` (diff) hover not showing the correct previous line when showing recent changes annotations of the whole-file

## [4.1.2] - 2017-06-15
### Fixed
- Fixes [#96](https://github.com/eamodio/vscode-gitlens/issues/96) - External diff command can be unintentionally triggered

## [4.1.1] - 2017-06-13
### Added
- Adds an `alt` command to the `Toggle File Blame Annotations` command button, which when you hold down `alt` and click it will execute the `Toggle Recent File Changes Annotations` command instead

### Fixed
- Fixes missing `Toggle File Blame Annotations` command icon

## [4.1.0] - 2017-06-13
### Added
- Adds all-new recent changes annotations of the whole-file - annotates and highlights all of lines changed in the most recent commit
  - Can customize the [layout](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens#file-recent-changes-annotation-settings), as well as the [theme](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens#theme-settings)
- Adds `Toggle Recent File Changes Annotations` command (`gitlens.toggleFileRecentChanges`) - toggles the recent changes annotations on and off
- Adds ability to press `Escape` to quickly toggle any whole-file annotations off
- Improves performance
  - Optimized git output parsing to increase speed and dramatically reduce memory usage
  - Defers diff chunk parsing until it is actually required
- Adds `gitlens.defaultDateFormat` setting to specify how all absolute dates will be formatted by default

### Fixed
- Fixes excessive memory usage when parsing diffs
- Fixes extra newline in multiline commit messages
- Fixes (again) [#33](https://github.com/eamodio/vscode-gitlens/issues/33) - Commit messages can causes markdown formatting in hovers

## [4.0.1] - 2017-06-09
### Fixed
- Fixes [#87](https://github.com/eamodio/vscode-gitlens/issues/87) - Can't open files in remote when using git@ urls (ssh)

## [4.0.0] - 2017-06-09
### Added
- Adds all-new, beautiful, highly customizable and themeable, file blame annotations
  - Can now fully customize the [layout and content](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens#file-blame-annotation-settings), as well as the [theme](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens#theme-settings)
- Adds all-new configurability and themeability to the current line blame annotations
  - Can now fully customize the [layout and content](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens#line-blame-annotation-settings), as well as the [theme](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens#theme-settings)
- Adds all-new configurability to the status bar blame information
  - Can now fully customize the [layout and content](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens#status-bar-settings)
- Adds all-new [configurability](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens#advanced-settings) over which commands are added to which menus via the `gitlens.advanced.menus` setting
- Adds better [configurability](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens#code-lens-settings) over where Git code lens will be shown -- both by default and per language
- Adds an all-new `changes` (diff) hover annotation to the current line - provides instant access to the line's previous version
- Adds `Toggle Line Blame Annotations` command (`gitlens.toggleLineBlame`) - toggles the current line blame annotations on and off
- Adds `Show Line Blame Annotations` command (`gitlens.showLineBlame`) - shows the current line blame annotations
- Adds `Toggle File Blame Annotations` command (`gitlens.toggleFileBlame`) - toggles the file blame annotations on and off
- Adds `Show File Blame Annotations` command (`gitlens.showFileBlame`) - shows the file blame annotations
- Adds `Open File in Remote` command (`gitlens.openFileInRemote`) to the `editor/title` context menu
- Adds `Open Repo in Remote` command (`gitlens.openRepoInRemote`) to the `editor/title` context menu
- Adds `gitlens.strings.*` settings to allow for the customization of certain strings displayed
- Adds `gitlens.theme.*` settings to allow for the theming of certain elements
- Adds `gitlens.advanced.telemetry.enabled` settings to explicitly opt-in or out of telemetry, but still ultimately honors the `telemetry.enableTelemetry` setting
- Adds ability to suppress most warning messages - which can be re-enabled using the `Reset Suppressed Warnings` command (`gitlens.resetSuppressedWarnings`)

### Changed
- (BREAKING) Almost all of the GitLens settings have either been renamed, removed, or otherwise changed - see the [README](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens#extension-settings)`
- Changes the positioning of the Git code lens to try to be at the end of any other code lens on the same line
- Changes the position of the `Open File in Remote` command (`gitlens.openFileInRemote`) in the context menus - now in the `navigation` group
- Changes the `Toggle Git Code Lens` command (`gitlens.toggleCodeLens`) to always toggle the Git code lens on and off
- Changes the default of `gitlens.advanced.toggleWhitespace.enabled` back to `true`, but automatically disables whitespace toggling if whitespace rendering is not on

### Removed
- Removes the on-demand `trailing` file blame annotations -- didn't work out and just ended up with a ton of visual noise
- Removes `Toggle Blame Annotations` command (`gitlens.toggleBlame`) - replaced by the `Toggle File Blame Annotations` command (`gitlens.toggleFileBlame`)
- Removes `Show Blame Annotations` command (`gitlens.showBlame`) - replaced by the `Show File Blame Annotations` command (`gitlens.showFileBlame`)

### Fixed
- Fixes [#81](https://github.com/eamodio/vscode-gitlens/issues/81) - Current line annotation feels too sticky
- Fixes [#83](https://github.com/eamodio/vscode-gitlens/issues/83) - Calling "close unchanged files" results in no new files being openable
- Fixes issues with the zone.js monkey patching done by application insights (telemetry) - disables all the monkey patching
- Fixes issue with `Open Branch in Remote` & `Open Repository in Remote` not showing when there are no open editors

## [3.6.1] - 2017-06-07
### Fixed
- Fixes issues with the zone.js monkey patching done by application insights (telemetry) - disables all the monkey patching

## [3.6.0] - 2017-06-02
### Added
- Adds diff information (the line's previous version) into the active line hover
- Adds a `gitlens.diffWithWorking` status bar command option - compares the current line commit with the working tree

### Changed
- Changes the behavior of the `Compare File with Working Tree` command (`gitlens.diffWithWorking`) - always does what it says :)
  - Compares the current file with the working tree -- if the current file *is* the working file, it will show a `File matches the working tree` message
- Changes the behavior of the `Compare File with Previous` command (`gitlens.diffWithPrevious`) - always does what it says  :)
  - Compares the current file with the previous commit to that file
- Changes the behavior of the `gitlens.diffWithPrevious` status bar command option - compares the current line commit with the previous
- Renames `Compare File with Previous Commit` command to `Compare File with Previous`
- Renames `Compare Line with Previous Commit` command to `Compare Line Commit with Previous`
- Renames `Compare Line with Working Tree` command to `Compare Line Commit with Working Tree`
- Renames `Compare with Previous Commit` in quick pick menus to `Compare File with Previous`
- Renames `Compare with Working Tree` in quick pick menus to `Compare File with Working Tree`

### Fixed
- Fixes [#79](https://github.com/eamodio/vscode-gitlens/issues/79) - Application insights package breaks GitLens + eslint

## [3.5.1] - 2017-05-25
### Changed
- Changes certain code lens actions to be unavailable (unclickable) when the commit referenced is uncommitted - avoids unwanted error messages
- Debounces more events when tracking the active line to further reduce lag

### Fixed
- Fixes [#71](https://github.com/eamodio/vscode-gitlens/issues/71) - Blame information is invalid when a file has changed outside of vscode
- Fixes issue with showing the incorrect blame for versioned files (i.e. files on the left of a diff, etc)

## [3.5.0] - 2017-05-24
### Added
- Improves performance
  - Reduces the number of git calls on known "untrackables"
  - Caches many more git commands to reduce git command roundtrips and parsing
  - Increases the debounce (delay) on cursor movement to reduce lag when navigating around a file
- Adds diff information (the line's previous version) into the active line hover when the current line is uncommitted
- Adds `gitlens.statusBar.alignment` settings to control the alignment of the status bar -- thanks to [PR #72](https://github.com/eamodio/vscode-gitlens/pull/72) by Zack Schuster ([@zackschuster](https://github.com/zackschuster))!
- Adds `Open Branch in Remote` command (`gitlens.openBranchInRemote`) - opens the current branch commits in the supported remote service
- Adds `Open Repository in Remote` command (`gitlens.openRepoInRemote`) - opens the repository in the supported remote service
- Adds `Stash Changes` option to stashed changes quick pick menu -- no longer hidden behind the `"gitlens.insiders": true` setting
- Adds `Stash Unstaged Changes` option to stashed changes quick pick menu -- no longer hidden behind the `"gitlens.insiders": true` setting
- Adds `Apply Stashed Changes` command (`gitlens.stashApply`) to apply the selected stashed changes to the working tree -- no longer hidden behind the `"gitlens.insiders": true` setting
- Adds `Stash Changes` command (`gitlens.stashSave`) to stash any working tree changes -- no longer hidden behind the `"gitlens.insiders": true` setting
- Adds support to the `Search commits` command (`gitlens.showCommitSearch`) to work without any active editor
- Adds commit search pre-population -- if there is an active editor it will use the commit sha of the current line commit, otherwise it will use the current clipboard

### Changed
- Changes `Open File in Remote` and `Open Line Commit in Remote` commands to actually work for everyone (part of their implementation was still behind the `gitlens.insiders` setting)
- Changes the active line hover to only show at the beginning and end of a line if `gitlens.blame.annotation.activeLine` is `both`
- Changes `alt+f` shortcut to `alt+/` for the `Search commits` command (`gitlens.showCommitSearch`)
- Changes `alt+right` on commit details quick pick menu to execute the `Compare File with Previous Commit` command (`gitlens.diffWithPrevious`) when a file is selected
- Changes `alt+right` on repository status quick pick menu to execute the `Compare File with Previous Commit` command (`gitlens.diffWithPrevious`) when a file is selected
- Refactors command argument passing to allow for future inclusion into the SCM menus

### Fixed
- Fixes [#73](https://github.com/eamodio/vscode-gitlens/issues/73) - GitLens doesn't work with Chinese filenames
- Fixes [#40](https://github.com/eamodio/vscode-gitlens/issues/40) - Encoding issues
  - Given the limitations of the vscode api, I'm unable to fix all the encoding issues, but many of them should now be squashed
  - `files.encoding` is now honored for the cases where the encoding cannot currently be gleaned
- Fixes incorrect file selection from the commit details quick pick menu
- Fixes incorrect command execution when using `"gitlens.statusBar.command": "gitlens.showQuickRepoHistory"`
- Fixes a bunch of issues that were revealed by enabling Typescript `strict` mode

## [3.4.9] - 2017-05-03
### Added
- Adds better support for deleted files when choosing `Open Changed Files` via in quick pick menus - now opens the file revision from the previous commit
- Adds better support for deleted files when using `alt+right arrow` shortcut on the commit details quick pick menu - now opens the file revision from the previous commit

### Changed
- Removes deleted files when choosing `Open Working Changed Files` via in quick pick menus

## [3.4.8] - 2017-05-02
### Changed
- Changes display name in the marketplace to `Git Lens` because of the marketplace search ranking algorithm

## [3.4.6] - 2017-05-01
### Added
- Adds better support for deleted files when choosing `Open File` via in quick pick menus - now opens the file revision from the previous commit
- Adds better support for deleted files when choosing `Open File in Remote` via in quick pick menus - now opens the file revision from the previous commit
- Improves performance by caching the git path to avoid lookups on every git command

### Changed
- Renames `gitlens.advanced.codeLens.debug` setting to `gitlens.codeLens.debug`
- Renames `gitlens.advanced.debug` setting to `gitlens.debug`
- Renames `gitlens.output.level` setting to `gitlens.outputLevel`

### Fixed
- Fixes incorrect file selection when showing commit details quick pick menu
- Fixes timing error on startup

## [3.4.5] - 2017-04-13
### Added
- Completely overhauls the [GitLens documentation](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) and messaging -- make sure to check it out to see all the powerful features GitLen provides!
- Adds `gitlens.blame.annotation.activeLineDarkColor` & `gitlens.blame.annotation.activeLineLightColor` settings to control the colors of the active line blame annotation

### Changed
- Changes `Toggle Git Code Lens` command to work when `gitlens.codeLens.visibility` is set to `auto` (the default)
- Renames `Compare with...` command to `Compare File with...`
- Renames `Compare with Next Commit` command to `Compare File with Next Commit`
- Renames `Compare with Previous Commit` command to `Compare File with Previous Commit`
- Renames `Compare with Previous Commit` command to `Compare File with Previous Commit`
- Renames `Compare with Working Tree` command to `Compare File with Working Tree`

### Fixed
- Fixes issue with `Open Commit in Remote` not working
- Fixes issue with many commands missing from the `Command Palette`

## [3.3.3] - 2017-04-10
### Fixed
- Fixes issue with newlines in commit messages in the file/branch/stash history quick pick menus (truncates and adds an ellipse icon)

## [3.3.2] - 2017-04-10
### Removed
- Removes `gitlens.blame.annotation.characters.*` settings since they were added to deal with unicode bugs in a previous version of vscode

### Fixed
- Closes [#63](https://github.com/eamodio/vscode-gitlens/issues/63) - Switch commit message and author in commit pick list. Also reduces clutter in the commit quick pick menus

## [3.3.1] - 2017-04-09
### Changed
- Changes commit search prefixes -- no prefix for message search, `@` for author, `:` for file pattern, `#` for commit id
- Changes `sha` terminology to `commit id` in the UI

### Fixed
- Fixes issues with author searching

## [3.3.0] - 2017-04-09
### Added
- Adds `Search commits` command (`gitlens.showCommitSearch`) to allow commit searching by message, author, file pattern, or sha
- Adds `alt+f` shortcut for the `Search commits` command (`gitlens.showCommitSearch`)
- Adds `Show Commit Search` command to the branch history quick pick menu
- Adds `Show Stashed Changes` command to the repository status quick pick menu
- Adds a `Don't Show Again` option to the GitLen update notification

### Changed
- Changes `Open x in Remote` commands to be no longer hidden behind the `gitlens.insiders` setting

### Fixed
- Fixes [#59](https://github.com/eamodio/vscode-gitlens/issues/59) - Context menu shows gitlens commands even if folder/file is not under git

## [3.2.1]
### Fixed
- Fixes [#57](https://github.com/eamodio/vscode-gitlens/issues/57) - No more blank message if `diff.tool` is missing

## [3.2.0]
### Added

- Adds support for single files opened in vscode -- you are no longer required to open a folder for GitLens to work

### Fixed
- Fixes [#57](https://github.com/eamodio/vscode-gitlens/issues/57) - Warn on directory compare when there is no diff tool configured
- Fixes [#58](https://github.com/eamodio/vscode-gitlens/issues/58) - Work with git sub-modules
- Fixes issue with `Open * in Remote` commands with nested repositories and non-git workspace root folder

## [3.1.0]
### Added
- Adds `Show Stashed Changes` command (`gitlens.showQuickStashList`) to open a quick pick menu of all the stashed changes
- Adds insiders `Stash Changes` option to stashed changes quick pick menu -- enabled via `"gitlens.insiders": true`
- Adds insiders `Stash Unstaged Changes` option to stashed changes quick pick menu
- Adds insiders `Apply Stashed Changes` command (`gitlens.stashApply`) to apply the selected stashed changes to the working tree
- Adds insiders `Stash Changes` command (`gitlens.stashSave`) to stash any working tree changes

### Fixed
- Fixes incorrect counts in upstream status

## [3.0.5]
### Added
- Adds additional insiders support for GitLab, Bitbucket, and Visual Studio Team Services to the `Open x in Remote` commands and quick pick menus -- enabled via `"gitlens.insiders": true`
- Adds insiders line support to `Open File in Remote` command (`gitlens.openFileInRemote`)
- Adds original file name for renamed files to the repository status and commit details quick pick menu

### Fixed
- Fixes [#56](https://github.com/eamodio/vscode-gitlens/issues/56) - Handle file names with spaces

## [3.0.4]
### Changed
- Changes telemetry a bit to reduce noise

### Fixed
- Fixes common telemetry error by switching to non-strict iso dates (since they are only available in later git versions)

## [3.0.3]
### Added
- Adds a fallback to work with Git version prior to `2.11.0` -- terribly sorry for the inconvenience :(

### Fixed
- Fixes [#55](https://github.com/eamodio/vscode-gitlens/issues/55) - reverts Git requirement back to `2.2.0`
- Fixes issues with parsing merge commits

## [3.0.2]
### Changed
- Changes required Git version to `2.11.0`

## [3.0.1]
### Added
- Adds basic telemetry -- honors the vscode telemetry configuration setting

## [3.0.0]
### Added
- Adds insiders support for `Open in GitHub` to the relevant quick pick menus -- enabled via `"gitlens.insiders": true`
- Adds insiders `Open Line Commit in Remote` command (`gitlens.openCommitInRemote`) to open the current commit in the remote service (currently only GitHub)
- Adds insiders `Open File in Remote` command (`gitlens.openFileInRemote`) to open the current file in the remote service (currently only GitHub)
- Adds an update notification for feature releases
- Adds `Show Branch History` command (`gitlens.showQuickBranchHistory`) to show the history of the selected branch
- Adds `Show Last Opened Quick Pick` command (`gitlens.showLastQuickPick`) to re-open the previously opened quick pick menu - helps to get back to previous context
- Adds `alt+-` shortcut for the `Show Last Opened Quick Pick` command (`gitlens.showLastQuickPick`)
- Adds upstream status information (if available) to the repository status pick pick
- Adds file status rollup information to the repository status pick pick
- Adds file status rollup information to the commit details quick pick menu
- Adds `Compare with...` (`gitlens.diffWithBranch`) command to compare working file to another branch (via branch quick pick menu)
- Adds branch quick pick menu to `Directory Compare` (`gitlens.diffDirectory`) command
- Adds support for `gitlens.showQuickFileHistory` command execution via code lens to limit results to the code lens block
- Adds current branch to branch quick pick menu placeholder
- Adds `Show Branch History` command to the branch history quick pick menu when showing only limited commits (e.g. starting at a specified commit)
- Adds `Show File History` command to the file history quick pick menu when showing only limited commits (e.g. starting at a specified commit)
- Adds `Don't Show Again` option to the unsupported git version notification

### Changed
- Changes `Show Repository History` command to `Show Current Branch History`
- Changes `Repository History` terminology to `Branch History`

### Fixed
- Fixes issue with `gitlens.diffWithPrevious` command execution via code lens when the code lens was not at the document/file level
- Fixes issue where full shas were displayed on the file/blame history explorers
- Fixes [#30](https://github.com/eamodio/vscode-gitlens/issues/30) - Diff with Working Tree fails from repo/commit quickpick list if file was renamed (and the commit was before the rename)
- Fixes various other quick pick menu command issues when a file was renamed
- Fixes various issues when caching is disabled
- Fixes issues with parsing commits history
- Fixes various issues with merge commits

## [2.12.2]
### Fixed
- Fixes [#50](https://github.com/eamodio/vscode-gitlens/issues/50) - excludes container-level code lens from `html` and `vue` language files

## [2.12.1]
### Added
- Adds `gitlens.advanced.codeLens.debug` setting to control whether or not to show debug information in code lens

### Fixed
- Fixes issue where `gitlens.showQuickRepoHistory` command fails to open when there is no active editor

## [2.12.0]
### Added
- Adds progress indicator for the `gitlens.showQuickFileHistory` & `gitlens.showQuickRepoHistory` quick pick menus
- Adds paging support to the `gitlens.showQuickFileHistory` & `gitlens.showQuickRepoHistory` quick pick menus
  - Adds `Show Previous Commits` command
  - Adds `Show Next Commits` command
- Adds keyboard page navigation via `alt+,` (previous) & `alt+.` (next) on the `gitlens.showQuickFileHistory` & `gitlens.showQuickRepoHistory` quick pick menus
- Adds keyboard commit navigation via `alt+,` (previous) & `alt+.` (next) on the `gitlens.showQuickCommitDetails` & `gitlens.showQuickCommitFileDetails` quick pick menus

### Changed
- Changes behavior of `gitlens.showQuickFileHistory` & `gitlens.showFileHistory` to no longer show merge commits
- Changes `gitlens.copyShaToClipboard` to copy the full sha, rather than short sha
- Changes internal tracking to use full sha (rather than short sha)

## [2.11.2]
### Added
- Adds `gitlens.diffWithNext` command to open a diff with the next commit
- Adds `alt+.` shortcut for the `gitlens.diffWithNext` command

### Changed
- Changes `shift+alt+p` shortcut to `alt+,` for the `gitlens.diffWithPrevious` command
- Changes `alt+p` shortcut to `shift+alt+,` for the `gitlens.diffLineWithPrevious` command

### Removed
- Removes `gitlens.toggleCodeLens` from Command Palette when not available
- Removes `gitlens.toggleCodeLens` shortcut key when not available

### Fixed
- Fixes (#45)[https://github.com/eamodio/vscode-gitlens/issues/45] - Keyboard Shortcut collision with Project Manager

## [2.11.1]
### Added
- Adds blame and active line annotation support to git diff split view (right side)
- Adds command (compare, copy sha/message, etc) support to git diff split view (right side)

### Fixed
- Fixes intermittent issues when toggling whitespace for blame annotations

## [2.11.0]
### Added
- Adds `gitlens.showQuickCommitFileDetails` command to show a quick pick menu of details for a file commit
- Adds `gitlens.showQuickCommitFileDetails` command to code lens
- Adds `gitlens.showQuickCommitFileDetails` command to the status bar
- Adds `gitlens.closeUnchangedFiles` command to close any editors that don't have uncommitted changes
- Adds `gitlens.openChangedFiles` command to open all files that have uncommitted changes
- Adds `Directory Compare` (`gitlens.diffDirectory`) command to open the configured git difftool to compare directory versions
- Adds `Directory Compare with Previous Commit` command on the `gitlens.showQuickCommitDetails` quick pick menu
- Adds `Directory Compare with Working Tree` command on the `gitlens.showQuickCommitDetails` quick pick menu
- Adds a `Changed Files` grouping on the `gitlens.showQuickCommitDetails` quick pick menu
- Adds a `Close Unchanged Files` command on the `gitlens.showQuickRepoStatus` quick pick menu
- Adds a contextual description to the `go back` command in quick pick menus

### Changed
- Changes layout of the `gitlens.showQuickRepoStatus` quick pick menu for better clarity
- Changes behavior of `gitlens.showQuickCommitDetails` to show commit a quick pick menu of details for a commit
- Changes default of `gitlens.codeLens.recentChange.command` to be `gitlens.showQuickCommitFileDetails` (though there is no visible behavior change)
- Renames `Open Files` to `Open Changed Files` on the `gitlens.showQuickCommitDetails` quick pick menu
- Renames `Open Working Files` to `Open Changed Working Files` on the `gitlens.showQuickCommitDetails` quick pick menu
- Renames `Show Changed Files` to `Show Commit Details` on the `gitlens.showQuickCommitFileDetails` quick pick menu
- Renames `Open Files` to `Open Changed Files` on the `gitlens.showQuickRepoStatus` quick pick menu

### Fixed
- Fixes [#44](https://github.com/eamodio/vscode-gitlens/issues/43) by adding a warning message about Git version requirements
- Fixes intermittent errors when adding active line annotations
- Fixes intermittent errors when opening multiple files via quick pick menus

## [2.10.1]
### Fixed
- Fixes [#43](https://github.com/eamodio/vscode-gitlens/issues/43) - File-level code lens isn't using the blame of the whole file as it should
- Fixes issue with single quotes (') in annotations
- Fixes output channel logging (also adds more debug information to code lens -- when enabled)

## [2.10.0]
### Added
- Adds blame and active line annotation support to git diff split view
- Adds command (compare, copy sha/message, etc) support to git diff split view

### Fixed
- Fixes startup failure if caching was disabled
- Fixes missing `Compare Line with Previous Commit` context menu item
- Fixes [#41](https://github.com/eamodio/vscode-gitlens/issues/41) - Toggle Blame annotations on compare files page
- Fixes issue with undo (to a saved state) not causing annotations to reappear properly
- Attempts to fix [#42](https://github.com/eamodio/vscode-gitlens/issues/42) - Cursor on Uncommitted message

## [2.9.0]
### Changed
- To accomodate the realization that blame information is invalid when a file has unsaved changes, the following behavior changes have been made
  - Status bar blame information will hide
  - Code lens change to a `Cannot determine...` message and become unclickable
  - Many menu choices and commands will hide

### Fixed
- Fixes [#38](https://github.com/eamodio/vscode-gitlens/issues/38) - Toggle Blame Annotation button shows even when it isn't valid
- Fixes [#36](https://github.com/eamodio/vscode-gitlens/issues/36) - Blame information is invalid when a file has unsaved changes

## [2.8.2]
### Added
- Adds `gitlens.blame.annotation.dateFormat` to specify how absolute commit dates will be shown in the blame annotations
- Adds `gitlens.statusBar.date` to specify whether and how the commit date will be shown in the blame status bar
- Adds `gitlens.statusBar.dateFormat` to specify how absolute commit dates will be shown in the blame status bar

### Fixed
- Fixes [#39](https://github.com/eamodio/vscode-gitlens/issues/39) - Add date format options for status bar blame

## [2.8.1]
### Fixed
- Fixes issue where `Compare with *` commands fail to open when there is no active editor

## [2.8.0]
### Added
- Adds new `Open File` command on the `gitlens.showQuickCommitDetails` quick pick menu to open the commit version of the file
- Adds new `Open File` command on the `gitlens.showQuickCommitDetails` quick pick menu to open the commit version of the files
- Adds `alt+left` keyboard shortcut in quick pick menus to `go back`
- Adds `alt+right` keyboard shortcut in quick pick menus to execute the currently selected item while keeping the quick pick menu open (in most cases)
  - `alt+right` keyboard shortcut on commit details file name, will open the commit version of the file

### Changed
- Indents the file statuses on the `gitlens.showQuickCommitDetails` quick pick menu
- Renames `Open File` to `Open Working File` on the `gitlens.showQuickCommitDetails` quick pick menu
- Renames `Open File` and `Open Working Files` on the `gitlens.showQuickCommitDetails` quick pick menu
- Reorders some quick pick menus

### Fixed
- Fixes [#34](https://github.com/eamodio/vscode-gitlens/issues/34) - Open file should open the selected version of the file
- Fixes some issue where some editors opened by the quickpick would not be opened in preview tabs
- Fixes issue where copy to clipboard commands would fail if there was no active editor
- Fixes issue where active line annotations would show for opened versioned files
- Fixes issue where code lens compare commands on opened versioned files would fail

## [2.7.1]
### Added
- Adds proper support for multi-line commit messages

### Fixed
- Fixes [#33](https://github.com/eamodio/vscode-gitlens/issues/33) - Commit message styled as title in popup, when message starts with hash symbol

## [2.7.0]
### Added
- Adds file status icons (added, modified, deleted, etc) to the `gitlens.showQuickCommitDetails` quick pick menu
- Adds `Copy Commit Sha to Clipboard` command to commit files quick pick menu
- Adds `Copy Commit Message to Clipboard` command to commit files quick pick menu

### Changed
- Changes `Show Commit History` to `Show File History` on the `gitlens.showQuickCommitDetails` quick pick menu
- Changes `Show Previous Commit History` to `Show Previous File History` on the `gitlens.showQuickCommitDetails` quick pick menu

### Fixed
- Fixes issue with repository status when there are no changes
- Fixes issue with `.` showing in the path of quick pick menus
- Fixes logging to clean up on extension deactivate

## [2.6.0]
### Added
- Adds `gitlens.showQuickRepoStatus` command to show a quick pick menu of files changed including status icons (added, modified, deleted, etc)
- Adds `alt+s` shortcut for the `gitlens.showQuickRepoStatus` command

## [2.5.6]
### Fixed
- Fixes [#32](https://github.com/eamodio/vscode-gitlens/issues/32) - 00000000 Uncommitted changes distracting

## [2.5.5]
### Fixed
- Fixes [#25](https://github.com/eamodio/vscode-gitlens/issues/25) - Blame information isn't updated after git operations (commit, reset, etc)

## [2.5.4]
### Fixed
- Fixes extra spacing in annotations

## [2.5.3]
### Fixed
- Fixes [#27](https://github.com/eamodio/vscode-gitlens/issues/27) - Annotations are broken in vscode insider build

## [2.5.2]
### Added
- Adds `Open File` command to `gitlens.showQuickCommitDetails` quick pick menu
- Adds `Open Files` command to `gitlens.showQuickCommitDetails` quick pick menu
- Improves performance of git-log operations in `gitlens.diffWithPrevious` and `gitlens.diffWithWorking` commands

### Changed
- Changes `Not Committed Yet` author for uncommitted changes to `Uncommitted`

### Fixed
- Fixes showing `gitlens.showQuickCommitDetails` quick pick menu for uncommitted changes -- now shows the previous commit details

## [2.5.1]
### Added
- Adds `gitlens.copyMessageToClipboard` command to copy commit message to the clipboard
- Adds `gitlens.copyMessageToClipboard` to the editor content menu
- Adds `Copy Commit Message to Clipboard` command to `gitlens.showQuickCommitDetails` quick pick menu

### Changed
- Changes behavior of `gitlens.copyShaToClipboard` to copy the sha of the most recent commit to the repository if there is no active editor
- Changes behavior of `gitlens.showQuickFileHistory` to execute `gitlens.showQuickRepoHistory` if there is no active editor

### Fixed
- Fixes issue where shortcut keys weren't disabled if GitLens was disabled

## [2.5.0]
### Added
- Overhauls the `gitlens.showQuickRepoHistory`, `gitlens.showQuickFileHistory`, and `gitlens.showQuickCommitDetails` quick pick menus
  - Adds `Show Repository History` command to `gitlens.showQuickFileHistory` quick pick menu
  - Adds `Show Previous Commits History` command to `gitlens.showQuickCommitDetails` quick pick menu
  - Adds `Show Commits History` command to `gitlens.showQuickCommitDetails` quick pick menu
  - Adds `Copy Commit Sha to Clipboard` command to `gitlens.showQuickCommitDetails` quick pick menu
  - Adds `Show Changed Files` command to `gitlens.showQuickCommitDetails` quick pick menu
  - Adds more robust `go back` navigation in quick pick menus
  - Adds commit message to placeholder text of many quick pick menus
  - Adds icons for some commands
- Adds `gitlens.diffWithPrevious` command to the editor content menu
- Adds `gitlens.diffWithWorking` command to the editor content menu
- Adds `gitlens.showQuickRepoHistory` and `gitlens.showQuickCommitDetails` commands to code lens
- Adds `gitlens.showQuickRepoHistory` and `gitlens.showQuickCommitDetails` commands to the status bar

### Changed
- Changes the default command of `gitlens.codeLens.recentChange.command` to `gitlens.showQuickCommitDetails`
- Changes the default command of `gitlens.statusBar.command` to `gitlens.showQuickCommitDetails`
- Changes behavior of `gitlens.showQuickCommitDetails` to show commit commands rather than file set (use `Show Changed Files` command to get to the file set)
- Changes `gitlens.diffWithPrevious` command to behave as `gitlens.diffWithWorking` if the file has uncommitted changes
- Renames `gitlens.diffWithPrevious` command from `Diff Commit with Previous` to `Compare with Previous Commit`
- Renames `gitlens.diffLineWithPrevious` command from `Diff Commit (line) with Previous` to `Compare Line with Previous Commit`
- Renames `gitlens.diffWithWorking` command from `Diff Commit with Working Tree` to `Compare with Working Tree`
- Renames `gitlens.diffLineWithWorking` command from `Diff Commit (line) with Working Tree` to `Compare Line with Working Tree`

### Fixed
- Fixes issues with certain git commands not working on Windows
- Fixes [#31](https://github.com/eamodio/vscode-gitlens/issues/31) - Disable gitlens if the project does not have `.git` folder
- Fixes issue where quick pick menus could fail if there was no active editor
- Fixes code lens not updating in response to configuration changes

## [2.1.1]
### Fixed
- Fixes overzealous active line annotation updating on document changes

## [2.1.0]
### Added
- Adds a new GitLens logo and changes all images to svg
- Adds `alt+p` shortcut for the `gitlens.diffLineWithPrevious` command
- Adds `shift+alt+p` shortcut for the `gitlens.diffWithPrevious` command
- Adds `alt+w` shortcut for the `gitlens.diffLineWithWorking` command
- Adds `shift+alt+w` shortcut for the `gitlens.diffWithWorking` command
- Adds `gitlens.copyShaToClipboard` command to copy commit sha to the clipboard ([#28](https://github.com/eamodio/vscode-gitlens/issues/28))
- Adds `gitlens.showQuickCommitDetails` command to show a quick pick menu of details for a commit
- Adds `go back` choice to `gitlens.showQuickCommitDetails`, `gitlens.showQuickFileHistory`, and `gitlens.showQuickRepoHistory` quick pick menus
- Adds `gitlens.blame.annotation.highlight` to specify whether and how to highlight blame annotations ([#24](https://github.com/eamodio/vscode-gitlens/issues/24))
- Greatly improves performance of line navigation when either active line annotations or status bar blame is enabled

### Fixed
- Fixes [#29](https://github.com/eamodio/vscode-gitlens/issues/29) - Commit info tooltip duplicated for current line when blame is enabled
- Fixes issue where sometimes the commit history shown wasn't complete
- Fixes issues with `gitlens.diffLineWithPrevious` and `gitlens.diffWithPrevious` not following renames properly
- Fixes issues with `gitlens.diffLineWithPrevious` and `gitlens.diffWithPrevious` not always grabbing the correct commit

## [2.0.2]
### Added
- Adds auto-enable of whitespace toggling when using font-ligatures because of [vscode issue](https://github.com/Microsoft/vscode/issues/11485)
- Adds `gitlens.blame.annotation.characters.*` settings to provide some control over how annotations are displayed

### Fixed
- Fixes [#22](https://github.com/eamodio/vscode-gitlens/issues/22) - Cannot read property 'sha' of undefined

## [2.0.1]
### Fixed
- Fixes [#26](https://github.com/eamodio/vscode-gitlens/issues/26) - Active line annotation doesn't disappear properly after delete

## [2.0.0]
### Added
- Adds `gitlens.blame.annotation.activeLine` to specify whether and how to show blame annotations on the active line
- Adds full commit message (rather than just summary) to active line hover if `gitlens.blame.annotation.activeLine` is not `off`
- Adds new `trailing` blame annotation style -- adds annotations after the code lines rather than before
- Adds `gitlens.blame.annotation.message` to show the commit message in `expanded` and `trailing` blame annotation styles
- Adds support for relative dates in blame annotations. Use `gitlens.blame.annotation.date`
- Re-adds context menu for `gitlens.diffLineWithPrevious` -- since [vscode issue](https://github.com/Microsoft/vscode/issues/15395)
- Re-adds context menu for `gitlens.diffLineWithWorking` -- since [vscode issue](https://github.com/Microsoft/vscode/issues/15395)

### Changed
- Changes the design of hover annotations -- much cleaner now
- Disables automatic whitespace toggling by default as it is seemingly no longer needed as [vscode issue](https://github.com/Microsoft/vscode/issues/11485) seems fixed. It can be re-enabled with `gitlens.advanced.toggleWhitespace.enabled`

### Fixed
- Fixes issue where the status bar blame would get stuck switching between editors
- Fixes issue where code lens aren't updated properly after a file is saved

## [1.4.3]
### Added
- Adds some logging to hopefully trap [#22](https://github.com/eamodio/vscode-gitlens/issues/22) - Cannot read property 'sha' of undefined

### Fixed
- Fixes issue with the latest insiders build (1.9.0-insider f67f87c5498d9361c0b29781c341fd032815314b) where there is a collision of document schemes

## [1.4.2]
### Fixed
- Fixes issue where file history wouldn't compare correctly to working tree if the filename had changed

## [1.4.1]
### Added
- Adds `gitlens.advanced.gitignore.enabled` to enable/disable .gitignore parsing. Addresses [#20](https://github.com/eamodio/vscode-gitlens/issues/20) - Nested .gitignore files can cause blame to fail with a repo within another repo

## [1.4.0]
### Added
- Adds `alt+h` shortcut for the `gitlens.showQuickFileHistory` command
- Adds `shift+alt+h` shortcut for the `gitlens.showQuickRepoHistory` command
- Adds `gitlens.advanced.maxQuickHistory` to limit the number of quick history entries to show (for better performance); Defaults to 200
- Adds `gitlens.diffLineWithPrevious` as `alt` context menu item for `gitlens.diffWithPrevious`
- Adds `gitlens.diffLineWithWorking` as `alt` context menu item for `gitlens.diffWithWorking`
- Adds `gitlens.showFileHistory` as `alt` context menu item for `gitlens.showQuickFileHistory`

### Removed
- Removes context menu for `gitlens.diffLineWithPrevious` -- since it is now the `alt` of `gitlens.diffWithPrevious`
- Removes context menu for `gitlens.diffLineWithWorking` -- since it is now the `alt` of `gitlens.diffWithWorking`
- Replaces `gitlens.menus.fileDiff.enabled` and `gitlens.menus.lineDiff.enabled` with `gitlens.menus.diff.enabled` -- since the switch between file and line diff is now controlled by the `alt` key

## [1.3.1]
### Added
- Adds `Diff Commit with Working Tree` to the explorer context menu (assuming `gitlens.menus.fileDiff.enabled` is `true`)
- Adds `Diff Commit with Working Tree` & `Diff Commit with Previous` to the editor title context menu (assuming `gitlens.menus.fileDiff.enabled` is `true`)

### Changed
- Renames `Diff` commands for better clarity
- Removes `Git` from the commands as it feels unnecessary
- Reorders the context menu commands

## [1.3.0]
### Added
- Adds support for blame and history (log) on files opened via compare commands -- allows for deep navigation through git history

## [1.2.0]
### Added
- Adds compare (working vs previous) options to repository history
- Adds compare (working vs previous) options to file history
### Fixed
- Fixes issue with repository history compare with commits with multiple files

## [1.1.1]
### Added
- Adds logging for tracking [#18](https://github.com/eamodio/vscode-gitlens/issues/18) - GitLens only displayed for some files

### Changed
- Changes `gitlens.showQuickRepoHistory` command to run without an open editor (falls back to the folder repository)

## [1.1.0]
### Added
- Adds new `gitlens.showQuickFileHistory` command to show the file history in a quick-pick list (palette)
- Adds new `gitlens.showQuickRepoHistory` command to show the repository history in a quick-pick list (palette)
- Adds `gitlens.showQuickFileHistory` option to the `gitlens.codeLens.recentChange.command`, `gitlens.codeLens.authors.command`, and `gitlens.statusBar.command` settings

### Changed
- Changes the `gitlens.statusBar.command` settings default to `gitlens.showQuickFileHistory` instead of `gitlens.toggleBlame`

### Removed
- Removes `git.viewFileHistory` option from the `gitlens.codeLens.recentChange.command`, `gitlens.codeLens.authors.command`, and `gitlens.statusBar.command` settings

## [1.0.2]
### Fixed
- Fixes [#16](https://github.com/eamodio/vscode-gitlens/issues/16) - incorrect 'Unable to find Git' message

## [1.0.0]
### Added
- Adds support for git history (log)!
- Adds support for blame annotations and git commands on file revisions
- Adds ability to show multiple blame annotation at the same time (one per vscode editor)
- Adds new `gitlens.showFileHistory` command to open the history explorer
- Adds new `gitlens.showFileHistory` option to the `gitlens.codeLens.recentChange.command`, `gitlens.codeLens.authors.command`, and `gitlens.statusBar.command` settings
- Adds per-language code lens location customization using the `gitlens.codeLens.languageLocations` setting
- Adds new `gitlens.diffLineWithPrevious` command for line sensitive diffs
- Adds new `gitlens.diffLineWithWorking` command for line sensitive diffs
- Adds `gitlens.diffWithPrevious` command to the explorer context menu
- Adds output channel logging, controlled by the `gitlens.advanced.output.level` setting
- Improves performance of the code lens support
- Improves performance (significantly) when only showing code lens at the document level
- Improves performance of status bar blame support

### Changed
- Switches on-demand code lens to be a global toggle (rather than per file)
- Complete rewrite of the blame annotation provider to reduce overhead and provide better performance
- Changes `gitlens.diffWithPrevious` command to always be file sensitive diffs
- Changes `gitlens.diffWithWorking` command to always be file sensitive diffs
- Removes all debug logging, unless the `gitlens.advanced.debug` settings it on

### Fixed
- Fixes many (most?) issues with whitespace toggling (required because of https://github.com/Microsoft/vscode/issues/11485)
- Fixes issue where blame annotations would not be cleared properly when switching between open files

## [0.5.5]
### Fixed
- Fixes another off-by-one issue when diffing with caching

## [0.5.4]
### Fixed
- Fixes off-by-one issues with blame annotations without caching and when diffing with a previous version

## [0.5.3]
### Added
- Adds better uncommitted hover message in blame annotations
- Adds more protection for dealing with uncommitted lines

## [0.5.2]
### Fixed
- Fixes loading issue on Linux

## [0.5.1]
### Added
- Adds blame information in the status bar
- Add new status bar settings -- see **Extension Settings** for details
- Adds new `gitlens.diffWithPrevious` option to the `gitlens.codeLens.recentChange.command` & `gitlens.codeLens.authors.command` settings

### Changed
- Renames the `gitlens.codeLens.recentChange.command` & `gitlens.codeLens.authors.command` settings options (to align with command names)

### Removed
- Removes `gitlens.blame.annotation.useCodeActions` setting and behavior

### Fixed
- Fixes Diff with Previous when the selection is uncommitted

## [0.3.3]
### Fixed
- Fixes [#7](https://github.com/eamodio/vscode-gitlens/issues/7) - missing spawn-rx dependency (argh!)

## [0.3.2]
### Fixed
- Fixes [#7](https://github.com/eamodio/vscode-gitlens/issues/7) - missing lodash dependency

## [0.3.1]
### Added
- Adds new code lens visibility & location settings -- see **Extension Settings** for details
- Adds new command to toggle code lens on and off when `gitlens.codeLens.visibility` is set to `ondemand`

## [0.2.0]
### Changed
- Replaces blame regex parsing with a more robust parser

### Fixed
- Fixes [#1](https://github.com/eamodio/vscode-gitlens/issues/1) - Support blame on files outside the workspace repository
- Fixes failures with Diff with Previous command
- Fixes issues with blame explorer code lens when dealing with previous commits
- Fixes display issues with compact blame annotations (now skips blank lines)

## [0.1.3]
### Added
- Improved blame annotations, now with sha and author by default
- Add new blame annotation styles -- compact and expanded (default)
- Adds many new configuration settings; see **Extension Settings** for details

## [0.0.7]
### Added
- Adds .gitignore checks to reduce the number of blame calls

### Fixed
- Fixes [#4](https://github.com/eamodio/vscode-gitlens/issues/4) - Absolute paths fail on Windows due to backslash (Really!)
- Fixes [#5](https://github.com/eamodio/vscode-gitlens/issues/5) - Finding first non-white-space fails sometimes

## [0.0.6]
### Added
- Adds attempt to scroll to the correct position when opening a diff

### Fixed
- Fixes [#2](https://github.com/eamodio/vscode-gitlens/issues/2) - [request] Provide some debug info when things fail
- Fixes [#4](https://github.com/eamodio/vscode-gitlens/issues/4) - Absolute paths fail on Windows due to backslash

## [0.0.5]
### Changed
- Removes code lens from fields and single-line properties to reduce visual noise
- Automatically turns off blame only when required now

### Fixed
- Fixes issues where filename changes in history would cause diffs to fails
- Fixes some issues with uncommitted blames

## [0.0.4]
### Added
- Candidate for preview release on the vscode marketplace.

## [0.0.1]
### Added
- Initial release but still heavily a work in progress.