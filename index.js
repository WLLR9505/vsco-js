const https = require('https');
const fs = require("fs");
const cheerio = require("cheerio");
const Nightmare = require('Nightmare');
nightmare = new Nightmare({
    show: false
});

var src = new String;
var urls = [];
const [,, ...args] = process.argv;

main(args);


async function main(args) {
        for (u of args) {
            await nightmare
                .goto(u)
                .wait(200)
                .evaluate(() => {
                    console.log(document.body.innerHTML);
                    return document.body.innerHTML;
                })
                .then(async (body) => {
                    // console.log('NIGHTMARE :: page loaded');
                    scrapPage(body)
                })
        }
        for (i of urls) {
            saveImage(i.url, i.folder, i.imgName);
        }
        await nightmare.end()
}

function scrapPage(body) {
    var $ = cheerio.load(body);
    src = $('.css-6j68gn').attr("src");
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
        console.log('saving image');
        if (!fs.existsSync(folder)) { //se a pasta não existir, cria
            fs.mkdirSync(folder);
        }
        https.get(url, (response) => {
            response.pipe(fs.createWriteStream(folder + '/' + imgName));
        }).on('error', e => {
            console.error(e);
        });
    });
}
