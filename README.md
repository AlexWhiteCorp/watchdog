# WatchDog
Tool for GitHub to keep repositories you are interested in 
and their pull requests in one place and up-to-date. 
More info in User Guide.

## User Guide
https://alexwhitecorp.github.io/watchdog

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
## Build

### Compiles and minifies
- for current OS
```
npm run electron:build
```
- for *MacOS ARM* (build: `dist_electron/WatchDog-{version}-arm64.dmg`)
```
npm run electron:build:mac-arm
```
- for *MacOS x64* (build: `dist_electron/WatchDog-{version}.dmg`)
```
npm run electron:build:mac64
```
- for *Windows x64* (build: `dist_electron/WatchDog Setup {version}.exe`)
```
npm run electron:build:win64
```

### Lints and fixes files
```
npm run lint
```
