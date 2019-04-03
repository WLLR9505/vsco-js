# vsco-js

Ferramenta para download de imagem do site vsco.co utilizando web scraping

---

## Dependências
- cheerio
- nightmare

---

## Uso

Execute o comando abaixo substituindo *imageURL* pela url da imagem desejada  

`node index imageURL`

Será gerada uma pasta './imgs' com a imagem salva

---

## Como funciona?

- A url passada como argumento é processada pelo **nightmare** que retorna a página  
- A pagina é processada pelo **cheerio** procurando pela classe *.css-6j68gn*  
- A URL para a imagem comprimida fica no *src* desta classe  
- É feita uma conversão para uma nova URL que redirecione para a imagem original  
- A nova URL é processado pela função *saveImage* que faz sua solicitação **https** e salva a imagem retornada na pasta *imgs*
