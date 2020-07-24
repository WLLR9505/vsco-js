const fs = require("fs");

module.exports = function readURLsFromFile(filePath) {
    let file = fs.readFileSync(filePath, 'utf-8');
    file = file.split(/[\r\n]/g);
    return file.filter((v) => {
        return v !== ''
    })
}