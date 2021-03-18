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


o.spec("Test Festival Screens", function() {
  o("FestiGram Launcher", function(done) {
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
  o("FestiGram Festival List", function(done) {
    o.timeout(30000)
    browser
      .then(b => b.newPage())
      .then(p => p.goto(baseUrl, {waitUntil: 'networkidle0'})
        .then(() => p.waitForSelector(".fa-bars"))
        .then(() => p.click(".ft-nav-menu-button"))
        .then(() => {
          p.$x("//span[contains(., 'Festivals')]")
            //.then(els => console.log('Festivals', els) || els)
            .then(els => els[0].click())
        })
        
        .then(() => p.waitForNavigation({waitUntil: 'networkidle0'}))
        .then(() => p.evaluate(() => {
          return document.querySelector('.ft-stage-title').textContent
          //done()
        }))
        .then(r => {
          o('FestiGram').equals(r)
        })
        .catch(err => {
          o(err).equals('dead')
          //done()
        })
        .finally(() => {
          browser.then((b) => b.close())

          done()

        })
      )
  })
})