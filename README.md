            _＿_
    　 　  　／＞　  フ
    　　  　| 　^ ^ l
    　  　／` ミ＿_x_ノ
    　　 /　   ヽ　　 ﾉ
    ／￣|　　  |　|　|
    | (￣ヽ＿_ヽ_)__)
    ＼二つ

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
