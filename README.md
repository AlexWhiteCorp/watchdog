# WatchDog
Tool for GitHub/GitLab to keep 
Repositories/Projects you are interested in 
and their Pull/Merge Requests in desktop Tray Menu. More info in User Guide.

## User Guide
https://alexwhitecorp.github.io/watchdog

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run electron:serve
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
