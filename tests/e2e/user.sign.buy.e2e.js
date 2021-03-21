// fests.pregame.id.e2e.js

     
const puppeteer = require('puppeteer')
var o = require("ospec")
let browser = {}
const baseUrl = 'http://localhost:8080'
/*
*/
var email, username, password

import userData from '../apiData/login.json'

const createdUserLogin = userData[0]

o.spec("Sign up and buy access", function() {
o.beforeEach(function() {
        browser = puppeteer.launch(
          {
            headless: false,
            args:[
               '--start-maximized' // you can also use '--start-fullscreen'
            ]
          }
        )
    })
  o("FestiGram Sign up", function(done) {
    o.timeout(60000)
    browser
      .then(b => b.newPage())
      .then(p => p.goto(baseUrl, {waitUntil: 'networkidle0'})
        .then(() => p.waitForSelector(".fa-sign-in-alt"))
        .then(el => el.click())
        .then(() => p.waitForSelector(".ft-ui-button"))
        .then(el => el.click())
        //.then(() => p.waitForNavigation())
        .then(() => p.waitForTimeout(3000))
        //.then(() => p.waitForSelector("a:not([class])"))
        .then(() => p.$("a:not([class])"))
        //.then(els => console.log('els: ', els) || els)
        //.then(els => els.find(n => n.textContent === 'Sign Up'))
        .then(el => el.click())
        //.then(() => p.waitForNavigation())
        .then(() => p.waitForSelector("input[name=email]"))
        .then(() => p.$("input[name=email]"))
        .then(el => el.type(email = Date.now() + createdUserLogin.email))
        .then(() => p.$("input[name=username]"))
        .then(el => el.type((username = createdUserLogin.username + Date.now()).slice(-12, -1)))
        .then(() => p.$("input[name=password]"))
        .then(el => el.type(password = createdUserLogin.password))
        .then(() => p.$("button.auth0-lock-submit"))
        .then(el => el.click())
        .then(() => p.waitForNavigation())
        .then(() => p.waitForTimeout(1000))
        .then(() => p.$("button#allow"))
        .then(el => el.click())
        .then(() => p.waitForNavigation())
        .then(() => p.waitForSelector(".ft-card-festival.ft-festivals-upcoming"))
        .then(() => p.$(".ft-card-festival.ft-festivals-upcoming"))
        .then(el => el.click())
        .then(() => p.waitForSelector("img[src='img/live-access.svg']"))
        .then(() => p.$("img[src='img/live-access.svg']"))
        .then(el => el.click())
        .then(() => p.waitForTimeout(1000))
        .then(() => p.$("h3[name='FestiBucks']"))
        .then(el => el.click())
        .then(() => p.waitForTimeout(100))
        .then(() => p.$("button[name='BuyBucks']"))
        .then(el => el.click())
        .then(() => p.waitForNavigation({waitUntil: 'networkidle0'}))
        .then(() => console.log('clciked Buy bucks'))
        .then(() => p.waitForSelector("input[name=email]"))
        .then(() => p.$("input[name=email]"))
        .then(el => el.type(email))
        .then(() => p.$("input[name=cardNumber]"))
        .then(el => el.type('4242' + '4242' + '4242' + '4242', {delay: 10}))
        .then(() => p.$("input[name=cardExpiry]"))
        .then(el => el.type('424'))
        .then(() => p.$("input[name=cardCvc]"))
        .then(el => el.type('424'))
        .then(() => p.$("input[name=billingName]"))
        .then(el => el.type(username))
        .then(() => p.$("input[name=billingPostalCode]"))
        .then(el => el.type('42424'))
        .then(() => p.waitForTimeout(100))
        .then(() => p.keyboard.press('Enter'))
        .then(() => p.waitForNavigation())
        .then(() => p.waitForSelector("img[src='img/live-access.svg']"))
        .then(() => p.$("img[src='img/live-access.svg']"))
        .then(el => el.click())
        .then(() => p.waitForTimeout(1000))
        .then(() => p.$("h3[name='Access']"))
        .then(el => el.click())
        .then(() => p.waitForTimeout(10000))
        /*
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
        */
        .then(() => {
          //browser.then((b) => b.close())

          //done()

        })
        .catch(err => {
          o(err).equals('dead')
          //done()
        })
      )
  })
})