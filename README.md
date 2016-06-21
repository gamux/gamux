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

### The Three Pillars

  1. __Actions:__ Handles user interaction.
  2. __State:__ Holds environment variables and configurations.
  3. __Plugins:__ Handles and loads plugins, there are currently two kinds
  of plugins.

## Initialization Modes

The system has 3 initialization modes:

* __Diagnose:__ Full initialization, displays the game list.
* __Update:__ Full initialization that deploys updates.
* __Play:__ Initializes just what is needed to play the game.

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
* Save Backup

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
