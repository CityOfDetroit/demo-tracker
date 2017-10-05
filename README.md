# demo-tracker

A map showing demolition and land bank activity in the city of Detroit.

Live demo: https://cityofdetroit.github.io/demo-tracker

## Development

Behind the scenes, we use Babel to compile, Browserify and Watchify to bundle, and Uglify to minify our code.

### Prereqs

You should be running Node and NPM.

This project assumes you have three global dependencies: Browserify, Watchify and Uglify

If you don't, install them:
```
npm install -g browserify watchify uglify-js
```

### Develop

Clone this project:
```
git clone https://github.com/CityOfDetroit/demo-tracker.git
cd demo-tracker
npm install
```

### Build

Run `npm run watch` and open `public/index.html` in your browser.

This is listening for changes in `src/main.js` and will automatically rebuild, so you just need to refresh your browswer to see changes.

### Deploy

Run `npm run deploy`. This pipes `src/main.js` through Uglify to minify it, writes to `public/bundle.js`, and then publishes to gh-pages.
