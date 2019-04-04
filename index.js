const https = require('https');
const fs = require("fs");
const cheerio = require("cheerio");
const Nightmare = require('Nightmare');
nightmare = new Nightmare({
    show: false
});

var src = new String;
const [,, ... args] = process.argv;

main(args[0]);


function main(url) {
    nightmare
    .goto(url)
    .wait(200)
    .evaluate(() => {
        console.log(document.body.innerHTML);
        return document.body.innerHTML;
    })
    .end()
    .then((body) => {
        var $ = cheerio.load(body);
        src = $('.css-6j68gn').attr("src");
        let username = $('.DetailViewUserInfo-username').text();
        //tenta fazer substituição válida
        src = src.replace('//im.vsco.co/1/', 'https://image.vsco.co/1/');
        src = src.replace('//im.vsco.co/aws-us-west-2/', 'https://image-aws-us-west-2.vsco.co/');
        //utilizado para nomear a imagem
        let endName = src.lastIndexOf('.jpg');
        let startname =  src.lastIndexOf('/');
        saveImage(src, './imgs', username + '_' + src.slice(startname + 1, endName) + '.jpg')
    })
}

function saveImage(url, folder, imgName) {
    if (!fs.existsSync(folder)){    //se a pasta não existir, cria
        fs.mkdirSync(folder);
    }
    var file = fs.createWriteStream(folder + '/' + imgName);
    try {
        var request = https.get(url, (response) => {
            console.log('SAVED!');
            response.pipe(file);
        });
        return 0;
    } catch (e) {
        console.log('ERROR');
        console.log(url);
        return 1;
    }
}
