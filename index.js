const target = require('target-menu');
const RL = require('readline-sync');
const fs = require("fs");
const prepareDownload = require('./src/prepareToDownload');
const readURLsFromFile = require('./src/readFromFile');
const input = require('./src/inputLinks');

const Nightmare = require('Nightmare');
const {
    resolve
} = require('path');
nightmare = new Nightmare({
    show: false,
    webPreferences: {
        images: false
    }
});

var src = new String;
var urls = [];
const [, , ...args] = process.argv;
var menu = ['single image', 'multiple images', 'exit']
var control = new target.Controls();

async function startMenu() {
    return new Promise(async () => {
        while (control.pos1 >= 0) {
            target.menu(control, 'white', menu);
            switch (control.pos1) {
                case -1:
                    await nightmare.end();
                    console.clear();
                    break;
                case 0:
                    await prepareDownload([input.inputLink()]);
                    break;
                case 1:
                    await prepareDownload(input.inputMultipleLinks());
                    break;
                case 2:
                    process.exit()
            }
        }
    })
}

async function main(args) {
    switch (args[0]) {
        case '-f':
            await prepareDownload(readURLsFromFile(args[1]));
            process.exit()
            break;
        case '-c':
            await startMenu()
            break;
        default:
            await prepareDownload([args[0]])
            process.exit()
            break;
    }
}

main(args);