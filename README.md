#nightlife 2#

An automatic episode (re-)namer utility for tv-shows for windows, linux and darwin using [atom-shell](https://github.com/atom/atom-shell).

###installation###

1. Download a [atom-shell release](https://github.com/atom/atom-shell/releases) suits your needs and extract it into your ```apps``` directory.
2. Download a [Nightlife 2 release](https://github.com/christian-raedel/nightlife2/releases) and extract it into the ```atom-shell/resources```
directory.
3. Run ```atom-shell/atom``` or ```atom-shell\atom.exe```.
4. Go to the settings page and setup Nightlife 2. Make sure ```atom-shell/resources/app/config.yml``` is writable or specify another config file
using the ```atom --config path/to/your/config.yml``` commandline switch.

###known issues###

1. At the moment, the user interface is only available in german language.
2. Nightlife 2 copies the renamed files to the output directory without checking existing files. These will be overwritten without confirmation.
There exists an ```atom --debug``` commandline switch, which replaces file operations with a short delay for testing.
