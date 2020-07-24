const RL = require('readline-sync')

module.exports = {
     inputLink() {
        return RL.question('paste a link and press ENTER\n')
    },    
    inputMultipleLinks() {
        var links = new Array(0);
        var link = ''
        do {
            link = RL.question('paste a link [press ENTER to finish]\n');
            link == '' ? null : links.push(link);
        } while (link.length > 7)
        return links;
    }
}