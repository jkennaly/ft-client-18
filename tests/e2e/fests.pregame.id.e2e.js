// fests.pregame.id.e2e.js

     
const puppeteer = require('puppeteer')
var o = require("ospec")
let browser = {}
const baseUrl = 'http://localhost:8080'

o.beforeEach(function() {
        browser = puppeteer.launch(
          {
            headless: false
          }
        )
    })


o("FestiGram", function(done) {
	o.timeout(30000)
  browser
    .then(b => b.newPage())
    .then(p => p.goto(baseUrl, {waitUntil: 'networkidle0'}).then(r => p))
    .then(p => p.waitForSelector(".ft-card").then(r => p))
    .then(p => p.evaluate(() => {
      return document.querySelector('.ft-stage-title').textContent
      //done()
    }))
    .then(r => {
      o('FestiGram Launcher').equals(r)
    })
    .catch(err => {
    	o(err).equals('dead')
    	//done()
    })
    .finally(() => {
      browser.then((b) => b.close())

      done()

    })
})