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
  tmux $socketcommand send-keys -t 'editor' 'vim .' Enter
  tmux $socketcommand kill-window -t 'delete'
  tmux $socketcommand -2 new-window -P -t $name -c $path -n 'shell'
  tmux $socketcommand split-window -h -c $path
  tmux $socketcommand split-window -v -c $path
  if is-socket-required ; then
    chmod 0777 /home/pair/tmux-socket
  fi
}

name=$1
if [[ $1 ]]; then
  create-tmux-session $2
else
  echo 'please enter the name of session'
  exit 1
fi

#old node code
#/home/ptotem/.nvm/versions/node/v4.1.1/bin/node
#//var exec = require('child_process').exec;
#//var async = require('async');

#//function cleanArguments(args, ignored_args) {
  #//if (!ignored_args) {
    #//ignored_args = [/node/i, /\.tmux/i];
  #//}
  #//var result = [];
  #//args.forEach(function(item, index, array){
    #//var isValid = true;
    #//for (var i = 0, len = ignored_args.length; i < len; i++) {
      #//if (item.match(ignored_args[i])) {
        #//isValid = false;
        #//break;
      #//}
    #//}
    #//if (isValid) {
      #//result.push(item);
    #//}
  #//}); 
  #//return result;
#//}

#//var arguments = cleanArguments(process.argv);
#//console.log('after');
#//console.log(arguments);

  # if [ $2 ] && [ -d $2 ]; then
    # echo 'valid working directory provided. using it'
    # tmux -2 new-session -d -n 'delete' -s $1
    # tmux -2 new-window -P -t $1 -c $2 -n 'editor'
    # tmux send-keys -t 'editor' 'vim .' Enter
    # tmux kill-window -t 'delete'
    # tmux -2 new-window -P -t $1 -c $2 -n 'shell'
    # tmux split-window -h -c $2
    # tmux split-window -v -c $2
    # fi
  # else
    # echo 'valid working directory not provided. using current.'
    # tmux -2 new-session -P -d -s $1 -n 'shell'
    # tmux -2 new-window -P -t $1 -n 'editor' 'vim .'
    # tmux select-window -t 'shell'
    # tmux split-window -h
    # tmux split-window -v
  # fi
