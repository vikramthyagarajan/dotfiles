#!/bin/zsh

# WARP DIRECTORY
# ==============
# Jump to custom directories in terminal
# because `cd` takes too long...
#
# @github.com/mfaerevaag/wd

# version
readonly PROJECT_VERSION=0.4.2

# colors
readonly PROJECT_BLUE="\033[96m"
readonly PROJECT_GREEN="\033[92m"
readonly PROJECT_YELLOW="\033[93m"
readonly PROJECT_RED="\033[91m"
readonly PROJECT_NOC="\033[m"

## functions

# helpers

project_print_msg()
{
    if [[ -z $project_quiet_mode ]]
    then
        local color=$1
        local msg=$2

        if [[ $color == "" || $msg == "" ]]
        then
            print " ${PROJECT_RED}*${PROJECT_NOC} Could not print message. Sorry!"
        else
            print " ${color}*${PROJECT_NOC} ${msg}"
        fi
    fi
}

project_exit_fail()
{
    local msg=$1

    project_print_msg $PROJECT_RED $msg
    PROJECT_EXIT_CODE=1
}

# core

project_add()
{
    local force=$1
    local point=$2

    if [[ $point =~ "^[\.]+$" ]]
    then
        project_exit_fail "Project point cannot be just dots"
    elif [[ $point =~ "[[:space:]]+" ]]
    then
        project_exit_fail "Project point should not contain whitespace"
    elif [[ $point == *:* ]]
    then
        project_exit_fail "Project point cannot contain colons"
    elif [[ $point == "" ]]
    then
        project_exit_fail "Project point cannot be empty"
    elif [[ ${points[$2]} == "" ]] || $force
    then
        project_remove $point > /dev/null
        echo "Command to be run in project (leave empty for none): "
        read command
        printf "%q:%s:%s\n" "${point}" "${PWD/#$HOME/~}" "${command}">> $PROJECT_CONFIG

        project_print_msg $PROJECT_GREEN "Project point added"

        # override exit code in case project_remove did not remove any points
        # TODO: we should handle this kind of logic better
        PROJECT_EXIT_CODE=0
    else
        project_exit_fail "Project point '${point}' already exists. Use 'edit' to overwrite."
    fi
}

project_remove()
{
    local point=$1

    if [[ ${points[$point+'.dir']} != "" ]]
    then
        local config_tmp=$PROJECT_CONFIG.tmp
        if sed -n "/^${point}:.*$/!p" $PROJECT_CONFIG > $config_tmp && mv $config_tmp $PROJECT_CONFIG
        then
            project_print_msg $PROJECT_GREEN "Project point removed"
        else
            project_exit_fail "Something bad happened! Sorry."
        fi
    else
        project_exit_fail "Project point was not found"
    fi
}

project_print_usage()
{
    cat <<- EOF
Usage: project [command] <point>

Commands:
	add <point>	  Add a new project point
	edit <point>	Edits an already existing project point
	rm <point>	  Removes the given project point
	show <point>	Print the options of the given point
	list | ls	    Print all stored warp points

	-v | --version	Print version
	-d | --debug	  Exit after execution with exit codes (for testing)

	help		Show this extremely helpful text
EOF
}

project_list_all()
{
    project_print_msg $PROJECT_BLUE "All warp points:"

    entries=$(sed "s:${HOME}:~:g" $PROJECT_CONFIG)

    max_warp_point_length=0
    while IFS= read -r line
    do
        arr=(${(s,:,)line})
        key=${arr[1]}

        length=${#key}
        if [[ length -gt max_warp_point_length ]]
        then
            max_warp_point_length=$length
        fi
    done <<< $entries

    while IFS= read -r line
    do
        if [[ $line != "" ]]
        then
            arr=(${(s,:,)line})
            key=${arr[1]}
            val=${arr[2]}
            cmd=${arr[3]}

            if [[ -z $project_quiet_mode ]]
            then
                printf "${fg[blue]}%${max_warp_point_length}s  ->\n${fg[default]} dir: %s\n cmd: %s\n" $key $val $cmd
            fi
        fi
    done <<< $entries
}

project_warp()
{
    local point=$1

    if [[ $point =~ "^\.+$" ]]
    then
        if [ $#1 < 2 ]
        then
            project_exit_fail "Warping to current directory?"
        else
            (( n = $#1 - 1 ))
            cd -$n > /dev/null
        fi
    elif [[ ${points[$point+'.dir']} != "" ]]
    then
        project_path=${points[$point+'.dir']/#\~/$HOME}
        cmd=${points[$point+'.command']}
        cd $project_path
        if [[ $cmd != "" ]]
        then
          eval $cmd
        fi
    else
        project_exit_fail "Unknown project point '${point}'"
    fi
}

local PROJECT_CONFIG=$HOME/.projectrc
local PROJECT_QUIET=0
local PROJECT_EXIT_CODE=0
local PROJECT_DEBUG=0

# Parse 'meta' options first to avoid the need to have them before
# other commands. The `-D` flag consumes recognized options so that
# the actual command parsing won't be affected.

zparseopts -D -E \
    c:=project_alt_config -config:=project_alt_config \
    q=project_quiet_mode -quiet=project_quiet_mode \
    v=project_print_version -version=project_print_version \
    d=project_debug_mode -debug=project_debug_mode

if [[ ! -z $project_print_version ]]
then
    echo "project version $PROJECT_VERSION"
fi

if [[ ! -z $project_alt_config ]]
then
    PROJECT_CONFIG=$project_alt_config[2]
fi

# check if config file exists
if [ ! -e $PROJECT_CONFIG ]
then
    # if not, create config file
    touch $PROJECT_CONFIG
fi

# load warp points
typeset -A points
while read -r line
do
    arr=(${(s,:,)line})
    key=${arr[1]}
    val=${arr[2]}
    command=${arr[3]}

    points[$key+'.dir']=$val
    points[$key+'.command']=$command
done < $PROJECT_CONFIG

# get opts
args=$(getopt -o a:r:c:lhs -l add:,rm:,clean\!,list,ls:,path:,help,show -- $*)

# check if no arguments were given, and that version is not set
if [[ ($? -ne 0 || $#* -eq 0) && -z $project_print_version ]]
then
    project_print_usage

    # check if config file is writeable
elif [ ! -w $PROJECT_CONFIG ]
then
    # do nothing
    # can't run `exit`, as this would exit the executing shell
    project_exit_fail "\'$PROJECT_CONFIG\' is not writeable."

else

    # parse rest of options
    for o
    do
        case "$o"
            in
            -a|--add|add)
                project_add false $2
                break
                ;;
            -e!|--edit!|edit)
                project_add true $2
                break
                ;;
            -r|--remove|rm)
                project_remove $2
                break
                ;;
            -l|list)
                project_list_all
                break
                ;;
            -ls|ls)
                project_list_all
                break
                ;;
            -h|--help|help)
                project_print_usage
                break
                ;;
            *)
                project_warp $o
                break
                ;;
            --)
                break
                ;;
        esac
    done
fi

## garbage collection
# if not, next time warp will pick up variables from this run
# remember, there's no sub shell

unset project_add
unset project_remove
unset project_list_all
unset project_print_msg
unset project_warp

unset args
unset points
unset val &> /dev/null # fixes issue #1

if [[ ! -z $project_debug_mode ]]
then
    exit $PROJECT_EXIT_CODE
else
    unset project_debug_mode
fi
