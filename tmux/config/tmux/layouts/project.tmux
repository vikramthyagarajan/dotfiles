#! /bin/bash

is-socket-required() {
  echo $name
  if [[ $name == 'pair' ]]; then
    # returns success
    return 0
  else
    # returns failure
    return 99
  fi
}

create-tmux-session() {
  path=$1
  if [ $path ] && [ -d $path ]; then
    echo 'valid working directory provided. using it'
  else
    echo 'valid working directory not provided. using current.'
    path='.'
  fi
  if is-socket-required ; then
    socketcommand='-S /home/pair/tmux-socket'
  else
    socketcommand=''
  fi
  echo $path
  tmux $socketcommand -2 new-session -d -n 'delete' -s $name
  tmux $socketcommand -2 new-window -P -t $name -c $path -n 'editor'
  tmux $socketcommand send-keys -t 'editor' 'vim -c "OpenSession '$name'"' Enter
  tmux $socketcommand kill-window -t 'delete'
  tmux $socketcommand -2 new-window -P -t $name -c $path -n 'shell'
  echo "running command"
  echo "$2"
  tmux $socketcommand -2 send-keys -t 'shell' "$2" Enter
  tmux $socketcommand split-window -h -c $path
  tmux $socketcommand split-window -v -c $path
  if is-socket-required ; then
    chmod 0777 /home/pair/tmux-socket
  fi
}

name=$1
if [[ $1 ]]; then
  create-tmux-session $2 "$3"
else
  echo 'please enter the name of session'
  exit 1
fi
