                            ___           ___           ___           ___           __
                           /  /\         /  /\         /  /\         /  /\         |  |\
                          /  /::\       /  /::\       /  /::|       /  /:/         |  |:|
                         /  /:/\:\     /  /:/\:\     /  /:|:|      /  /:/          |  |:|
                        /  /:/  \:\   /  /::\ \:\   /  /:/|:|__   /  /:/           |__|:|__
                       /__/:/_\_ \:\ /__/:/\:\_\:\ /__/:/_|::::\ /__/:/     /\ ____/__/::::\
                       \  \:\__/\_\/ \__\/  \:\/:/ \__\/  /~~/:/ \  \:\    /:/ \__\::::/~~~~
                        \  \:\ \:\        \__\::/        /  /:/   \  \:\  /:/     |~~|:|
                         \  \:\/:/        /  /:/        /  /:/     \  \:\/:/      |  |:|
                          \  \::/        /__/:/        /__/:/       \  \::/       |__|:|
                           \__\/         \__\/         \__\/         \__\/         \__\|

# Gamux

Gamux is a environment for running non-steam games and emulated games.

## Structure

### The Four Pillars

  1. __State:__ Holds environment variables and behavior configuration.
  2. __Game:__ Game format used by _Plugins_ and _Extensions_, holds game
  information.
  3. __Extension:__ Loads _Extensions_, extensions are used to extend gamux
  behaviour.
  4. __Plugin:__ Loads _Plugins_, plugins are simple game loaders.

### Miscellaneous

  * __Util:__ Some utility functions not found on _Ramda_.
  * __Main:__ Handles boot, mainly used by _Cli_.
  * __Cli:__ Handles command line options.

## API

The system has 2 initialization modes:

* __Update:__ Full initialization that updates the game list.
* __Play:__ Initializes just what is needed to play the game.

### Extension API

Extensions have 3 phases:

1. __Initialization:__ Every extension is initialized at same time.
2. __Process:__ Right after resolving the last initialization promise,
every extension is processed.
3. __Termination:__ Right after resolving the last termination promise,
very extension is terminated, and after that gamux exits.

#### initialize

This function receives the current state and returns a promise

#### process

This function receives a gamux object with useful functions and a
list of games.

#### terminate

This function receives a gamux object with useful functions and .



## Batteries Included

### Plugins

* YAML Game Format
* Enhanced PSX Emulator
* VisualBoyAdvance-M
* Kega Fusion
* Snes9X
* Nestopia
* DeSmuME
* PCSX2
* PPSSPP

### Extensions

* Steam Integration
* Game Launcher
* Save Backup
* Config Backup

## License

    Copyright 2016 Christian Ferraz Lemos de Sousa

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
