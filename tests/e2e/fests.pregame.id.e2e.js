// fests.pregame.id.e2e.js

     
const Nightmare = require('nightmare')
var o = require("ospec")
let nightmare

o.beforeEach(function() {
        nightmare = new Nightmare()
    })


o("FestiGram", function(done, timeout) {
	timeout(30000)
    nightmare
      .goto('http://localhost:8080')
      .wait(".ft-card")
      .evaluate(() => window.location.href)
      .end()
      .then(link => {
        o(link).equals("http://localhost:8080/#!/launcher")
        done()
      })
      .catch(err => {
      	o(err).equals('dead')
      	done()
      })
})
o("FestiGram festivals unlogged", function(done, timeout) {
	timeout(30000)
    nightmare
      .goto('http://localhost:8080')
      .wait(".festivals-upcoming")
      .click(".festivals-upcoming")
      .evaluate(() => window.location.href)
      .end()
      .then(link => {
        o(/fests\/pregame\//.test(link)).equals(true)
        done()
      })
      .catch(err => {
      	o(err).equals('dead')
      	done()
      })


    })
o("FestiGram festivals unlogged not attending", function(done, timeout) {
  timeout(30000)
    nightmare
      .goto('http://localhost:8080')
      .wait(".festivals-upcoming")
      .click(".festivals-upcoming")
      .wait('.ft-toggle-control input[type=checkbox]')
      .evaluate(() => document.querySelector('.ft-toggle-control input[type=checkbox]').checked)
      .end()
      .then(link => {
        o(link).equals(false)
        done()
      })
      .catch(err => {
        o(err).equals('dead')
        done()
      })
      
})