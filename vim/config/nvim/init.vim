"Plugins
call plug#begin('~/.vim/plugged')

  "General purpose coding features for all languages
  Plug 'scrooloose/nerdcommenter'
  Plug 'editorconfig/editorconfig-vim'
  " Plug 'Valloric/YouCompleteMe'
  Plug 'Shougo/deoplete.nvim', { 'do': ':UpdateRemotePlugins' }
  Plug 'carlitux/deoplete-ternjs', { 'do': 'npm install -g tern' }
  Plug 'https://github.com/ternjs/tern_for_vim.git'
  Plug 'bling/vim-airline'
  Plug 'vim-airline/vim-airline-themes'
  Plug 'Raimondi/delimitMate'
  Plug 'dkprice/vim-easygrep'
  Plug 'xolox/vim-misc'
  Plug 'xolox/vim-session'
  Plug 'isRuslan/vim-es6'
  Plug 'SirVer/ultisnips' | Plug 'honza/vim-snippets'
  Plug 'szw/vim-tags'
  Plug 'majutsushi/tagbar'
  Plug 'tpope/vim-repeat'
  Plug 'mbbill/undotree'

  "Journaling etc
  Plug 'xolox/vim-notes'

  " Theming and other assorted viewing features
  Plug 'sickill/vim-monokai'
  Plug 'altercation/vim-colors-solarized'
  Plug 'scrooloose/syntastic'
  Plug 'yggdroot/indentline'
  Plug 'gregsexton/matchtag'

  "Navigation
  Plug 'easymotion/vim-easymotion'
  Plug 'scrooloose/nerdtree'
  Plug 'tpope/vim-surround'
  Plug 'ctrlpvim/ctrlp.vim'
  Plug 'terryma/vim-multiple-cursors'
  Plug 'vim-scripts/Tabmerge'
  Plug 'christoomey/vim-tmux-navigator'
  Plug 'haya14busa/incsearch.vim'
  Plug 'haya14busa/incsearch-easymotion.vim'
  Plug 'haya14busa/incsearch-fuzzy.vim'
  Plug 'reedes/vim-wheel'
  " Plug 'fergdev/vim-cursor-hist'

  "Coffescript
  Plug 'kchmck/vim-coffee-script'

  "Node and Javascript
  Plug 'moll/vim-node'
  Plug 'jamescarr/snipmate-nodejs'
  Plug 'deangerber/snipmate-chai'
  Plug 'mmozuras/snipmate-mocha'
  Plug 'jelera/vim-javascript-syntax'
  Plug 'othree/javascript-libraries-syntax.vim'
  Plug 'nikvdp/ejs-syntax'
  
  " React
  Plug 'mxw/vim-jsx'
  Plug 'justinj/vim-react-snippets'

  " Ruby
  Plug 'vim-ruby/vim-ruby'
  Plug 'tpope/vim-rails'

  " Markdown
  Plug 'shime/vim-livedown'

  "Bash
  "Plug 'vim-scripts/bash-support.vim'

  "Html and frontend coding
  Plug 'mattn/emmet-vim'
  Plug 'hail2u/vim-css3-syntax'

  " Git plugins
  Plug 'tpope/vim-fugitive'
  Plug 'airblade/vim-gitgutter'

" Add plugins to &runtimepath
call plug#end()

"Setting backup options for swp files
set backupdir=~/.nvim/backup//
set directory=~/.nvim/swap//
set undodir=~/.nvim/undo//

filetype plugin on

"Theming and syntax configurations
let g:solarized_termtrans=1
" let g:solarized_termcolors=256
" let g:solarized_visibility = "low"
let g:solarized_contrast = "medium"
set t_Co=256
set background=dark
colorscheme solarized
set ignorecase
set smartcase
set laststatus=2

let g:EditorConfig_exclude_patterns = ['fugitive://.*', 'scp://.*']

set tabstop=2
set expandtab
set shiftwidth=2

"set statusline+=%#warningmsg#
"set statusline+=%{SyntasticStatuslineFlag()}
"set statusline+=%*

"let g:syntastic_always_populate_loc_list = 1
"let g:syntastic_auto_loc_list = 1
let b:syntastic_mode="passive"
let g:syntastic_check_on_open = 0
let g:syntastic_check_on_wq = 0
let g:syntastic_javascript_checkers = ['eslint']

"Searching options
let g:EasyGrepMode=0
let g:EasyGrepCommand=1
let g:EasyGrepRecursive=1
let g:EasyGrepSearchCurrentBufferDir=0
let g:EasyGrepIgnoreCase=1
let g:EasyGrepHidden=0
let g:EasyGrepFilesToInclude=''
let g:EasyGrepFilesToExclude="*.swp,*~,**/docs/**,**/node_modules/**"
let g:EasyGrepAllOptionsInExplorer=1
let g:EasyGrepWindow=0
let g:EasyGrepReplaceWindowMode=0
let g:EasyGrepOpenWindowOnMatch=1
let g:EasyGrepEveryMatch=0
let g:EasyGrepJumpToMatch=1
let g:EasyGrepInvertWholeWord=0
let g:EasyGrepPatternType='regex'
let g:EasyGrepFileAssociationsInExplorer=0
let g:EasyGrepExtraWarnings=0
let g:EasyGrepOptionPrefix='<leader>vy'
let g:EasyGrepReplaceAllPerFile=0
map /  <Plug>(incsearch-forward)
map ?  <Plug>(incsearch-backward)
map g/ <Plug>(incsearch-stay)
function! s:config_easy_fuzzyall(...) abort
  return extend(copy({
  \   'converters': [
  \     incsearch#config#fuzzy#converter(),
  \     incsearch#config#fuzzyspell#converter()
  \   ],
  \   'modules': [incsearch#config#easymotion#module()],
  \   'keymap': {"\<CR>": '<Over>(easymotion)'},
  \   'is_expr': 0,
  \   'is_stay': 1
  \ }), get(a:, 1, {}))
endfunction

noremap <silent><expr> z/ incsearch#go(<SID>config_easy_fuzzyall())
noremap <silent><expr> z? incsearch#go(<SID>config_easy_fuzzyall({'command': '?'}))
noremap <silent><expr> zg? incsearch#go(<SID>config_easy_fuzzyall({'is_stay': 1}))

" CtrlP searching. Files/buffers/lines
let g:ctrlp_extensions = ['line', 'buffertag', 'tag', 'dir']
nnoremap <Leader>p :CtrlPLine %<CR>

" Tags options
let g:vim_tags_ignore = ['.gitignore', '.git', 'node_modules', 'tmp', 'docs', '.meteor']
nmap <F8> :TagbarToggle<CR>

"Searching
" Modifying grep to ag if available for speed
if executable('ag')
  " Use ag over grep
  set grepprg=ag\ --nogroup\ --nocolor

  " Use ag in CtrlP for listing files. Lightning fast and respects .gitignore
  let g:ctrlp_user_command = 'ag %s -l --nocolor -g ""'

  " ag is fast enough that CtrlP doesn't need to cache
  let g:ctrlp_use_caching = 0
endif
set incsearch

" Completion
let g:deoplete#enable_at_startup = 1
" Use deoplete.
let g:tern_request_timeout = 1
let g:tern_show_signature_in_pum = '0'  " This do disable full signature type on autocomplete

"Add extra filetypes
let g:tern#filetypes = [
                \ 'jsx',
                \ 'javascript.jsx',
                \ 'vue',
                \ '...'
                \ ]
let g:tern#command = ["tern"]
let g:tern#arguments = ["--persistent"]

let g:ycm_server_log_level = 'debug'
let g:ycm_min_num_of_chars_for_completion = 1
let g:ycm_collect_identifiers_from_tags_files = 1
let g:ycm_semantic_triggers =  {
    \   'css': ['re!:\s+'],
    \ }

" Mappings Begin
let mapleader = ","

""Split Navigation (synchronised with tmux)
nnoremap <A-h> <C-w><C-h>
nnoremap <A-j> <C-w><C-j>
nnoremap <A-k> <C-w><C-k>
nnoremap <A-l> <C-w><C-l>

let g:tmux_navigator_no_mappings = 1
nnoremap <silent> <A-h> :TmuxNavigateLeft<cr>
nnoremap <silent> <A-j> :TmuxNavigateDown<cr>
nnoremap <silent> <A-k> :TmuxNavigateUp<cr>
nnoremap <silent> <A-l> :TmuxNavigateRight<cr>
nnoremap <silent> <A-/> :TmuxNavigatePrevious<cr>

"Easymotion overriding default start key
nmap <A-;> <Plug>(easymotion-prefix)
vmap <A-;> <Plug>(easymotion-prefix)

"Cursor History Traversal
" nnoremap <A-j> :call g:CursorHistForward()<CR>
" nnoremap <A-k> :call g:CursorHistBack()<CR>

" For NerdTree
nnoremap <Leader>nerd :NERDTreeToggle<CR>

""For NerdCommenter
nnoremap <Leader>/ :call NERDComment(0,"toggle")<CR>
vnoremap <Leader>/ :call NERDComment(0,"toggle")<CR>
let NERDSpaceDelims=1

" Sets the undotree command
nnoremap <Leader>u :UndotreeToggle<CR>

"For snippets
let g:UltiSnipsExpandTrigger="<c-j>"
let g:UltiSnipsJumpForwardTrigger="<c-j>"
let g:UltiSnipsJumpBackwardTrigger="<c-k>"
let g:UltiSnipsEditSplit="vertical"

"vim-session won't ask for autosaving everytime. Also doesn't keep track of my
"session all the time. I will have to manually savesession. More control
let g:session_autoload='yes'
let g:session_autosave='no'
"let g:session_persist_font=0
"For Emmet
let g:user_emmet_expandabbr_key='<c-e>'

"Javascript options
let g:used_javascript_libs='underscore,jasmine,chai,jquery'

"for folding
set foldmethod=indent
set foldenable
set foldlevel=99
nnoremap <S-h> zc
nnoremap <S-l> zO

"removes all audible bells
set visualbell
set t_vb=""
autocmd GUIEnter * set vb t_vb=

"settings visual options
set relativenumber
set number

" allows mouse scrolling in tmux
set mouse=a

"sets the user clipboard as default
set clipboard=unnamedplus

" using different mappings for terminal vim
set timeout timeoutlen=1000 ttimeoutlen=100
if !has("gui_running")
  if &term == "xterm"
    " set <Home>=^[[H <End>=^[[F <BS>=^?
    set <S-Up>=^[[1;2A <S-Down>=^[[1;2B <S-Right>=^[[1;2C <S-Left>=^[[1;2D
  endif
endif

" allow alt backspace to delete word
imap <M-BS> <C-W>

" make sure alt d and u works like ctrl d and u
nmap <M-d> <C-d>
nmap <M-u> <C-u>

" sets up shift direction keymaps
nmap <silent> <S-Up> gg
nmap <silent> <S-Down> G
nmap <silent> <S-Left> gT
nmap <silent> <S-Right> gt

syntax on

" vim scripts
function! TestCommandTmux(command)
  echom '!tmux select-window -t shell;tmux select-pane 1;tmux send-keys "' . a:command . '" Enter;'
  execute '!tmux select-window -t shell;tmux select-pane 1;tmux send-keys "' . a:command . '" Enter;'
endf
function! TabCloseRight(bang)
    let cur=tabpagenr()
    while cur < tabpagenr('$')
        exe 'tabclose' . a:bang . ' ' . (cur + 1)
    endwhile
endfunction

function! TabCloseLeft(bang)
    while tabpagenr() > 1
        exe 'tabclose' . a:bang . ' 1'
    endwhile
endfunction

nnoremap <Leader>t :call TestCommandTmux('npm test')
command! -bang Tabcloseright call TabCloseRight('<bang>')
command! -bang Tabcloseleft call TabCloseLeft('<bang>')
