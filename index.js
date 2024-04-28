const puppeteer = require('puppeteer')
const fs = require('fs')

const charactersArray = []

const scrapper = async (url) => {
console.log(url)

const browser = await puppeteer.launch({headless: false})
const page = await browser.newPage()
await page.goto(url)
await page.setViewport({width: 1080, height: 1024})

const arrayDivs = await page.$$('.simple-card')
for (const characterDiv of arrayDivs) {
  let description
  let img 
  let title

   try {
    title =   await characterDiv.$eval('.cardname', (el) => el.textContent)
   } catch (error) {
    title = ' '
   }
  try { 
    description = await characterDiv.$eval('.card-description', (el) => el.textContent)
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

}


write(charactersArray)
}


const write = (charactersArray) => {
  fs.writeFile('personajes.json', JSON.stringify(charactersArray), () => {
    console.log('Archivo escrito')
  })
}


scrapper('https://marvelsnapzone.com/cards/')