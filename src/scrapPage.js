const cheerio = require('cheerio');

module.exports = function scrapPage(body, urls, src) {
    var $ = cheerio.load(body);
    src = $('.disableSave-mobile').attr("src");
    let username = $('.ejb7ykf1').text();
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