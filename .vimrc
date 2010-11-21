" Syntax & colors
syntax on
colors sunburst

" Turn off VI compatibility
set nocompatible
set modeline modelines=0

"
filetype plugin indent on
call pathogen#runtime_append_all_bundles()

" Tabs
set tabstop=2
set shiftwidth=2
set softtabstop=2
set expandtab

" Encoding
set encoding=utf-8

" Searching
set ignorecase
set smartcase
set gdefault
set incsearch
set showmatch
set hlsearch

" Handle long lines
set wrap 
set textwidth=79
set formatoptions=qrn1
set colorcolumn=135

" Moving around
nnoremap j gj
nnoremap k gk

" F1 annoyance
inoremap <F1> <ESC>
nnoremap <F1> <ESC>
vnoremap <F1> <ESC>

" ; == :
nnoremap ; :

" Save on tab-out
au FocusLost * :wa

" Split windows
nnoremap <leader>w <C-w>v<C-w>1
nnoremap <C-h> <C-w>h
nnoremap <C-j> <C-w>j
nnoremap <C-k> <C-w>k
nnoremap <C-l> <C-w>l

" Folding settings
set foldmethod=indent   "indent based on syntax
set foldnestmax=3       "deepest fold is 3 levels
set foldlevel=3
set nofoldenable        "dont fold by default

" Show line numbering and current line
set number
set numberwidth=4
set cursorline

set lazyredraw " no redraw when running macros

" Status line
set statusline=%f "tail of the filename
set statusline+=\ 
"set statusline+=%h      "help file flag
set statusline+=%y      "filetype
set statusline+=%r      "read only flag
set statusline+=%1*%m%*      "modified flag
set statusline+=%=      "left/right aligned items separated
set statusline+=%#warningmsg#
set statusline+=%*\ 
set statusline+=%-10.(%l,%c%V%)\ %P "ruler

" Sane backspace behaviour
set backspace=indent,eol,start

" These file are ruby!
au BufRead,BufNewFile {Gemfile,Rakefile,Thorfile,config.ru,Rules} set ft=ruby

" Leader key
let mapleader=","

" NERD tree
map <silent> <F2> <ESC>:NERDTreeToggle<CR>
nmap <silent> <leader>ft :NERDTreeFind<CR>

" Command-T
map <silent> <D-t> <ESC>:CommandT<CR>

" Move line(s) of text using Cmd+j/k
nnoremap <silent> <D-j> :m+<CR>==
nnoremap <silent> <D-k> :m-2<CR>==
inoremap <silent> <D-j> <Esc>:m+<CR>==gi
inoremap <silent> <D-k> <Esc>:m-2<CR>==gi
vnoremap <silent> <D-j> :m'>+<CR>gv=gv
vnoremap <silent> <D-k> :m-2<CR>gv=gv

" Preserve selection when indenting
vmap > >gv
vmap < <gv

" Indenting with Cmd + [ and ]
nmap <D-[> <<
nmap <D-]> >>
nmap <D-h> <<
nmap <D-l> >>
vmap <D-[> <gv
vmap <D-]> >gv


" Remove the annoying icons - we should use keyboard anyway!
if has("gui_running")
    set guioptions=egmrt
endif

" Less CSS is awesome.
au BufNewFile,BufRead *.less set filetype=less

if has("gui_running") && system('ps xw | grep "Vim -psn" | grep -vc grep') > 0
  " Get the value of $PATH from a login shell.
  " If your shell is not on this list, it may be just because we have not
  " tested it.  Try adding it to the list and see if it works.  If so,
  " please post a note to the vim-mac list!
  if $SHELL =~ '/\(sh\|csh\|bash\|tcsh\|zsh\)$'
    let s:path = system("echo echo VIMPATH'${PATH}' | $SHELL -l")
    let $PATH = matchstr(s:path, 'VIMPATH\zs.\{-}\ze\n')
  endif
endif

