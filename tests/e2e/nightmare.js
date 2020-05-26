// nightmare.js
const Nightmare = require('nightmare')

const nightmare = Nightmare({show: true})
    nightmare
      .goto('https://duckduckgo.com')
      .type('#search_form_input_homepage', 'github nightmare')
      .click('#search_button_homepage')
      .wait('#links .result__a')
      .evaluate(() => document.querySelector('#links .result__a').href)
      .end()
		.then(console.log)
		.catch(error => {
		console.error('Search failed:', error)
		})