# vsco-js
<a href="https://codeclimate.com/github/WLLR9505/vsco-js/maintainability"><img src="https://api.codeclimate.com/v1/badges/14c549094f9bbea42001/maintainability" /></a>

Ferramenta para download de imagem do site vsco.co utilizando web scraping

---

## Dependências
- cheerio
- nightmare
- target-menu

---

## Uso

Execute o comando abaixo substituindo *imageURL* pela url da imagem desejada  

`node index.js imageURL`
Será gerada uma pasta './imgs' com a imagem salva

`node index.js -c`
Será iniciado o CLI

---

## Como funciona?

- A url passada como argumento é processada pelo **nightmare** que retorna a página  
- A pagina é processada pelo **cheerio** procurando pela classe *.disableSave-mobile*  
- A URL para a imagem comprimida fica no *src* desta classe  
- É feita uma conversão para uma nova URL que redirecione para a imagem original  
- A nova URL é processado pela função *saveImage* que faz sua solicitação **https** e salva a imagem retornada na pasta *imgs*
