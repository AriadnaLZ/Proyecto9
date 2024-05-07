const puppeteer = require('puppeteer')
const fs = require('fs')

const charactersArray = []


const scrapper = async (url) => {
console.log(url)
let count = 0
let fallo = 0

const browser = await puppeteer.launch({headless: false})
const page = await browser.newPage()

await page.goto(url)
await page.setViewport({width: 1080, height: 1024})

const arrayDivs = await page.$$('.simple-card')


await page.evaluate(() => {
  window.scrollTo(0, document.body.scrollHeight);
})




for (const characterDiv of arrayDivs) {
  let description
  let img 
  let title
  count += 1
  // console.log(count)

  await page.waitForSelector('.flip0')
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
    img = await characterDiv.$eval('.flip0', (el) => el.src)
    if (img === "https://marvelsnapzone.com/wp-content/themes/blocksy-child/assets/media/blank.card.png?v1") {
      fallo += 1
      console.log(`Han fallado ${fallo}`)
      console.log(title)
    }
  
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

await browser.close()
}


const write = (charactersArray) => {
  fs.writeFile('personajes.json', JSON.stringify(charactersArray), () => {
    console.log('Archivo escrito')
  })
}


scrapper('https://marvelsnapzone.com/cards/')