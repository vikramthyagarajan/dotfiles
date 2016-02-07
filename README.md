# Dotfiles
Herein lies my configuration for all my applications. Designed to install all that I need to get started developing. Feel free to fork it and add your own rules. This dotfile project is designed to be extensible. It uses a combination of bash scripting and json to simplify the management of dotfiles. It is written in NodeJS, and follows a simple framework for storing and sharing your dotfiles. The convention it follows is-

## Installation
git clone https://github.com/vikramthyagarajan/dotfiles.git

cd dotfiles

npm install

npm start

##Usage
The dotfile framework provides certain commands to do operations with your dotfiles. These are-
- node . install <module-name>: Installs module specified by module-name, otherwise installs all modules
- node . inspect: Checks all modules to make sure if any config files are not symlinked to this dotfiles repository

## How it Works
The dotfiles are split into modules. Each module has 3 important files/folders. All of these are optional. Include them depending on your need.
- **config**: Directory that contains files which have configuration data in them. All files here are symlinked to the home directory. They can be symlinked to different directories, by passing them in the module.json file.
- **install.sh**: File which contains the bash script to install the module. If this file exists, then it is the first that is run. However, script to install can also be provided via string or filename in the module.json file. This way, you can have multiple .sh files and link them in the module.json file
- **module.json**: File which contains the options which specify how the module will be built. See [Configuration](#configuration) for more details

** NOTE:-- all directories named lib/ and docs/ will be ignored as these are used by dotfile framework for different operations **

Hooks are provided at different points for modules in order to run scripts at those times. The hooks are-
- install
- initialize
- configure

Modules can contain other modules. These modules will be installed only after the parent module has finished its process. There are 2 ways these submodules can be defined-
- Create a subdirectory in the parent module. This is akin to how a module is defined. It works the exact same way. Use this if the submodule has configuration to manage or has more submodules under it
- Add a configuration object within the parent module.json file. Use this if the submodule only needs to run scripts or simple operations

## Configuration
All configuration information is passed through the module.json file. If it doesnt exist, then the defaults are assumed. These are-
- The script file install.sh is run
- All files in the config folder are symlinked to the home directory

These defaults can be overriden with the module.json file.
```javascript
{
  "install": "sudo apt-get install vim", //inline bash script in string form, or name of file in the module directory which is a bash script
  "initialize": "mv ~/.vimrc ~/backup", //inline or filename of bash script which runs after installation and before config files are moved
  "configure": "configure.sh", //inline or bash filename. Run after config files are symlinked
  "config": {
    "global": {
      "path": "$HOME/.config" //sets the global path option for the config folder. This means all files in config will by symlinked at this new path
    },
    "filename/foldername": {
      "path": "$HOME/.config/vim", //file or folder level options within the config folder. These options will apply for filename/foldername
      "symlinks": {
        "init.vim": "$HOME/.vimrc" //the symlinks option is only available for folders. This makes sure any file that matches the names in the symlinks object will be symlinked to those specific paths.
      }
    }
  }
}
```

## Test
Tests are available to make sure that your dotfiles can be installed and are configured properly. These tests are available to run-

- **npm test configure**: Runs tests to see if everything is configured properly
- **npm test install**: Runs a test which doesn't overwrite your file system, but checks that whether all files and commands that are provided work properly
