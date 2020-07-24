const fs = require("fs");
const https = require('https');

module.exports = function saveImage(url, folder, imgName) {
    return new Promise((resolve, reject) => {
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

                process.stdout.write('[\x1b[01;33m' + (100.0 * current / len).toFixed(2) + '%\x1b[0m]    ' + '┫');
                for (var i = 0; i < current_bar; i++) {
                    process.stdout.write('█');
                }
                for (var i = 0; i < 10 - current_bar; i++) {
                    process.stdout.write(' ');
                }
                process.stdout.write('┣    ' + imgName + '');

            });

            stream.on('close', () => {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`[\x1b[01;32m100.00%\x1b[0m]    ┫█████████┣    ${total.toFixed(2)}mb    ${imgName}\n`);
                resolve()
            });
        }).on('close', () => {
            return 0
        });
    })
}