const Nightmare = require('Nightmare');
const RL = require('readline-sync');
const saveImage = require('./saveImage')
const scrapPage = require('./scrapPage')

nightmare = new Nightmare({
    show: false,
    webPreferences: {
        images: false
    }
});

module.exports = async function prepareDownload(link) {
    return new Promise(async (resolve) => {
        var urls = [],
            src = new String;

        process.stdout.write(`Preparing to save ${link.length} image(s)`);
        let countDown = link.length;

        for (let i = 0; i < link.length; i++) {
            await nightmare
                .goto(link[i])
                .wait(400)
                .evaluate(() => {
                    console.log(document.body.innerHTML);
                    return document.body.innerHTML;
                })
                .then((body) => {
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    countDown--;
                    scrapPage(body, urls, src)
                }).then(async () => {
                    await saveImage(urls[i].url, urls[i].folder, urls[i].imgName)
                })
        }
        resolve()
    }).then(async () => {
        RL.keyIn('press any key to continue')
        return 0
    })
}