// fests.pregame.id.e2e.js

     
const Nightmare = require('nightmare')
var o = require("ospec")


o("FestiGram", function(done, timeout) {
	timeout(30000)
	const nightmare = Nightmare({show: true})
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
	const nightmare = Nightmare({show: true})
    nightmare
      .goto('http://localhost:8080')
      .wait(".ft-card")
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

/*
    nightmare
    	.back()
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
      */
})