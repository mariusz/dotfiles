set guifont=Menlo:h12

if has("gui_macvim")
  macmenu &File.New\ Tab key=<nop>
  map <D-t> <Plug>PeepOpen

  macmenu &File.Close key=<D-q>
  map <D-w> <C-w>
end
