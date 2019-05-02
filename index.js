const https = require('https');
const fs = require("fs");
const cheerio = require("cheerio");
const Nightmare = require('Nightmare');
nightmare = new Nightmare({
    show: false,
    webPreferences: {
        images: false
    }
});

var src = new String;
var urls = [];
const [,, ...args] = process.argv;
main(args);


async function main(args) {
    if (args[0] === '-f') { //leitura das URLs de arquivo
        args = readURLsFromFile(args[1]);
    }

    process.stdout.write(`Preparing to save ${args.length} image(s)`);
    let countDown = args.length;
        for (u of args) {
            await nightmare
                .goto(u)
                .wait(200)
                .evaluate(() => {
                    console.log(document.body.innerHTML);
                    return document.body.innerHTML;
                })
                .then((body) => {
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    process.stdout.write('wait ' + countDown);
                    countDown--;
                    scrapPage(body)
                })
        }
        for (i of urls) {
            saveImage(i.url, i.folder, i.imgName);
        }
        await nightmare.end()
}

function readURLsFromFile(filePath) {
    let file = fs.readFileSync(filePath, 'utf-8');
    file = file.split(/[\r\n]/g);
    return file.filter((v) => {
        return v !== ''
    })
}

function scrapPage(body) {
    var $ = cheerio.load(body);
    src = $('.disableSave-mobile').attr("src");
    let username = $('.DetailViewUserInfo-username').text();
    //tenta fazer substituição válida
    src = src.replace('//im.vsco.co/1/', 'https://image.vsco.co/1/');
    src = src.replace('//im.vsco.co/aws-us-west-2/', 'https://image-aws-us-west-2.vsco.co/');
    //utilizado para nomear a imagem
    let endName = src.lastIndexOf('.jpg');
    let startname = src.lastIndexOf('/');
    // console.log('CHEERIO :: page converted');
    urls.push({
        url: src,
        folder: './imgs',
        imgName: username + '_' + src.slice(startname + 1, endName) + '.jpg'
    })
}

function saveImage(url, folder, imgName) {
    return new Promise(function() {
        if (!fs.existsSync(folder)) { //se a pasta não existir, cria
            fs.mkdirSync(folder);
        }
        https.get(url, (response) => {
            let stream = response.pipe(fs.createWriteStream(folder + '/' + imgName));

            let len = parseInt(response.headers['content-length'], 10);
            let total = len / 1048576;
            let current = 0;

            response.on('data', (chunk) => {
                current += chunk.length;
                process.stdout.clearLine();
                process.stdout.cursorTo(0);

                let current_bar = (10.0 * current / len).toFixed(2);

                process.stdout.write('[\x1b[01;33m'+ (100.0 * current / len).toFixed(2) +'%\x1b[0m]    '+'┫');
                for (var i = 0; i < current_bar; i++) {
                    process.stdout.write('█');
                }
                for (var i = 0; i < 10 - current_bar ; i++) {
                    process.stdout.write(' ');
                }
                process.stdout.write('┣    ' + imgName + '');

            });

            stream.on('close', () => {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`[\x1b[01;32m100.00%\x1b[0m]    ┫██████████┣    ${total.toFixed(2)}mb    ${imgName}\n`);
                return;
            });
        }).on('close', () => {
            return;
        });
    });
}
