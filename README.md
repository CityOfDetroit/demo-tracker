# iet-template

Project skeleton

## Development

Behind the scenes, we use Babel to compile, Browserify and Watchify to bundle, and Uglify to minify our code.

### Prereqs

You should be running Node and NPM.

This project assumes you have three global dependencies: Browserify, Watchify and Uglify

If you don't, install them:
```
npm install -g browserify watchify uglify-js
```

### Install

Clone this project:
```
git clone https://github.com/CityOfDetroit/iet-template.git
cd iet-template
npm install
```

### Build

Run `npm run watch` and open `public/index.html` in your browser.

This is listening for changes in `src/main.js` and will automatically rebuild, so you just need to refresh your browswer to see changes.

### Deploy

Run `npm run deploy`. This pipes `src/main.js` through Uglify to minify it, writes to `build/bundle.js`, and then publishes to gh-pages (kinda, still figuring this piece out).