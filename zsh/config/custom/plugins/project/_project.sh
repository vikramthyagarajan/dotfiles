#compdef project

zstyle ':completion:*:descriptions' format '%B%d%b'
zstyle ':completion::complete:project:*:commands' group-name commands
zstyle ':completion::complete:project:*:warp_points' group-name warp_points
zstyle ':completion::complete:project::' list-grouped

zmodload zsh/mapfile

function clean_array() {
  arr=$1
  for i in $(seq 1 ${#warp_points})
  do
    line=$warp_points[i]
    echo $line%:*
    # warp_points[i]=${line%:*}
  done
}

function _project() {
  local CONFIG=$HOME/.projectrc
  local ret=1

  local -a commands
  local -a warp_points

  warp_points=( "${(f)mapfile[$CONFIG]//$HOME/~}" )

  commands=(
    'add:Adds the current working directory to your project points'
    'edit:Edits an already existing project point'
    'rm:Removes the given project point'
    'list:Print all stored warp points'
    'ls:Print all stored warp points'
    'show:Print the options of the given poin'
    'help:Show this extremely helpful text'
  )

  _arguments -C \
    '1: :->first_one_arg' \
    '2: :->second_one_arg' && ret=0

  case $state in
    first_one_arg)
      _describe -t warp_points "Warp points" warp_points && ret=0
      _describe -t commands "Commands" commands && ret=0
      ;;
    second_one_arg)
      case $words[2] in
        add\!|rm)
          _describe -t points "Warp points" warp_points && ret=0
          ;;
        add)
          _message 'Write the name of your warp point' && ret=0
          ;;
        show)
          _describe -t points "Warp points" warp_points && ret=0
          ;;
        ls)
          _describe -t points "Warp points" warp_points && ret=0
          ;;
        path)
          _describe -t points "Warp points" warp_points && ret=0
          ;;
      esac
      ;;
  esac

  return $ret
}

_project "@"

# Local Variables:
# mode: Shell-Script
# sh-indentation: 2
# indent-tabs-mode: nil
# sh-basic-offset: 2
# End:
# vim: ft=zsh sw=2 ts=2 et
