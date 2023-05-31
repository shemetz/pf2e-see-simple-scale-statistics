# Changelog
All notable changes to this project will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2023-05-31
- Fixed AC and Perception calculations for pf2e v4.12.x compatibility (#9)

## [1.2.5] - 2023-05-16
- Fixed math parsing issue for some special attacks like Web

## [1.2.4] - 2023-02-17
- Fixed bug with level 25+ creatures (the Tarrasque is literally off the charts)

## [1.2.3] - 2023-01-07
- Fixed compatibility for weaknesses+resistances after recent PF2E system update
- Added setting to treat broad IWR as more important

## [1.2.1] - 2022-10-29
- Fixed strike and spellcasting stats (secondary styles) not being colored (#3)
- Fixed color scale toggle not being active when it should (#4)

## [1.2.0] - 2022-10-23
- Added colorblind support/accessibility - using borders (#2)

## [1.1.3] - 2022-10-18
- Changed selector error to console warning, added logging to be able to debug later

## [1.1.1] - 2022-08-28
- Fixed missing data for Low HP and for some level -1 creatures

## [1.1.0] - 2022-08-26
- Changed to Foundry v10 compatibility
- Added color legend
- Added extreme HP (using my made-up definition, just like with Terrible HP)
- Changed highlight effect to be a colored shadow rather than colored text
- Added coloring of resistances and weaknesses

## [1.0.4] - 2022-04-26
- Fixed assumption that Math.js is available (#1) 

## [1.0.3] - 2022-04-18
- Reduced horizontal padding from 4px to 1px

## [1.0.2] - 2022-03-27
- Minor API change
- Fixed missing style file
- Fixed handling of unparseable damage expressions

## [1.0.0] - 2022-03-26
- Added the rest of the functionality, module should be good now!

## [0.1.0] - 2022-03-26
- Created the module with all basic functionality

## See also: [Unreleased]

[0.1.0]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/0.1.0...0.1.0
[1.0.0]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/0.1.0...1.0.0
[1.0.1]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.0.0...1.0.1
[1.0.2]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.0.1...1.0.2
[1.0.3]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.0.2...1.0.3
[1.0.4]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.0.3...1.0.4
[1.1.0]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.0.4...1.1.0
[1.1.1]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.1.0...1.1.1
[1.1.3]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.1.1...1.1.3
[1.2.0]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.1.3...1.2.0
[1.2.1]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.2.0...1.2.1
[1.2.3]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.2.1...1.2.3
[1.2.4]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.2.3...1.2.4
[1.2.5]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.2.4...1.2.5
[1.3.0]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.2.5...1.3.0
[Unreleased]: https://github.com/itamarcu/pf2e-see-simple-scale-statistics/compare/1.3.0...HEAD
