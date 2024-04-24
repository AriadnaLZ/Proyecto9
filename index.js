const puppeteer = require('puppeteer')
const fs = require('fs')

const charactersArray = []

const scrapper = async (url) => {
console.log(url)

const browser = await puppeteer.launch({headless: false})
const page = await browser.newPage()
await page.goto(url)
await page.setViewport({width: 1080, height: 1024})

repeatScrapper(page)
// write(charactersArray)
}

const repeatScrapper = async (page) => {
  const arrayDivs = await page.$$('#item-area')
for (const characterDiv of arrayDivs) {
let description
let img 
  let title

   try {
    title =   await characterDiv.$eval('.item-name', (el) => el.textContent)
   } catch (error) {
    title = ' '
   }
  try {
    description = await characterDiv.$eval('.item-ability', (el) => el.textContent)
  } catch (error) {
    description = ' '
  }

  try {
    img = await characterDiv.$eval('img', (el) => el.src)
  } catch (error) {
    img = 'Image not found'
  }


  const character = {
    title,
    description,
    img
  }

  charactersArray.push(character)
  console.log(character)
}
await page.$eval('[title="Next Page"]', (el) => el.click())
await page.waitForNavigation()
console.log('Pasamos a la siguiente página')
repeatScrapper(page)
}

const write = (charactersArray) => {
  fs.writeFile('personajes.json', JSON.stringify(charactersArray), () => {
    console.log('Archivo escrito')
  })
}


scrapper('https://marvelsnap.io/card-database/?&sort=name&limit=20&offset=0')