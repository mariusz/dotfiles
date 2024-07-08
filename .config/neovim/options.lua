-------------------- HELPERS ------------------------------

local scopes = {o = vim.o, b = vim.bo, w = vim.wo}

local function opt(scope, key, value)
  scopes[scope][key] = value
  if scope ~= 'o' then scopes['o'][key] = value end
end

-------------------- OPTIONS -------------------------------
local indent = 4
opt('b', 'expandtab', true)                           -- Use spaces instead of tabs
opt('b', 'shiftwidth', indent)                        -- Size of an indent
opt('b', 'smartindent', true)                         -- Insert indents automatically
opt('b', 'tabstop', indent)                           -- Number of spaces tabs count for
opt('o', 'completeopt', 'menuone,noinsert,noselect')  -- Completion options (for deoplete)
opt('o', 'hidden', true)                              -- Enable modified buffers in background
opt('o', 'ignorecase', true)                          -- Ignore case
opt('o', 'joinspaces', false)                         -- No double spaces with join after a dot
opt('o', 'scrolloff', 4 )                             -- Lines of context
opt('o', 'shiftround', true)                          -- Round indent
opt('o', 'sidescrolloff', 8 )                         -- Columns of context
opt('o', 'smartcase', true)                           -- Don't ignore case with capitals
opt('o', 'splitbelow', true)                          -- Put new windows below current
opt('o', 'splitright', true)                          -- Put new windows right of current
opt('o', 'termguicolors', true)                       -- True color support
opt('o', 'wildmode', 'list:longest')                  -- Command-line completion mode
opt('w', 'list', true)                                -- Show some invisible characters (tabs...)
opt('w', 'number', true)                              -- Print line number
opt('w', 'relativenumber', false)                     -- Relative line numbers
opt('w', 'wrap', false)                               -- Disable line wrap
opt('o', 'swapfile', false)                           -- Disable swapfile
opt('o', 'history', 1000)
opt('o', 'autoread', true)
opt('o', 'backup', false)
opt('o', 'writebackup', false)
opt('w', 'cursorline', true)
opt('o', 'pumheight', 10)
opt('o', 'fileencoding', 'utf-8')
opt('o', 'cmdheight', 2)
opt('o', 'mouse', 'a')
opt('o', 'updatetime', 50)
--opt('o', 'timeoutlen', 100)
opt('o', 'clipboard', 'unnamedplus')
opt('o', 'wildmenu', true)
opt('o', 'wildmode', 'full')
opt('o', 'lazyredraw', true)
opt('o', 'signcolumn', 'yes:1')
opt('o', 'background', 'dark')
opt('o', 'synmaxcol', 200)                           -- syntax file is slow,
opt('o', 'foldlevelstart', 99)                       -- no fold closed


----------------------- DISABLE BUILT-IN PLUGINS -------------------------

local disabled_built_ins = {
    "netrw",
    "netrwPlugin",
    "netrwSettings",
    "netrwFileHandlers",
    "gzip",
    "zip",
    "zipPlugin",
    "tar",
    "tarPlugin",
    "getscript",
    "getscriptPlugin",
    "vimball",
    "vimballPlugin",
    "2html_plugin",
    "logipat",
    "rrhelper",
    "spellfile_plugin",
    "matchit"
}

for _, plugin in pairs(disabled_built_ins) do
    vim.g["loaded_" .. plugin] = 1
end
