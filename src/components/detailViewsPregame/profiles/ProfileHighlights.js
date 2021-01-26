// ProfileHighlights.js
// components: login/components

/*
userData | Object | No | userData to construct the form
*/

import m from 'mithril'
import _ from 'lodash'

const emptyUser = `data:image/svg+xml;utf8,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3C!-- Written by Treer (gitlab.com/Treer) --%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='600' height='600' fill='white' color='%2300d7d7'%3E%3Ctitle%3EAbstract user icon%3C/title%3E%3Cdefs%3E%3CclipPath id='circular-border'%3E%3Ccircle cx='300' cy='300' r='280' /%3E%3C/clipPath%3E%3CclipPath id='avoid-antialiasing-bugs'%3E%3Crect width='100%25' height='498' /%3E%3C/clipPath%3E%3C/defs%3E%3Ccircle cx='300' cy='300' r='280' fill='currentcolor' clip-path='url(%23avoid-antialiasing-bugs)' /%3E%3Ccircle cx='300' cy='230' r='115' /%3E%3Ccircle cx='300' cy='550' r='205' clip-path='url(%23circular-border)' /%3E%3C/svg%3E`

const ProfileHighlights = {
	//oncreate: console.log('Launched'),
	//onupdate: () => console.log('ProfileHighlights update'),
	view: ({attrs}) => 
        m('.c44-h-160px.c44-w-480px.c44-tac.c44-ca.c44-l-0.c44-r-0.c44-b-0.c44-mla.c44-mra.c44-fvf.c44-fjcsa', {},
            m('h1.c44-pr', {}, 
                _.get(attrs, 'userData.name', 'User Name')
            ),
            m('.c44-df.c44-fjcsa', {}, 
                _.take(_.get(attrs, 'userData.bites', [
                    {
                        title: 'Quick Stat',
                        value: 1E6
                    },
                    {
                        title: 'Another Stat',
                        value: 0
                    },
                    {
                        title: 'Final Stat',
                        value: 4.1
                    }
                ]), 3)
                    .map(b => m('.c44-df.c44-fvf.c44-bl1ca.c44-br1ca.c44-fg1', {}, 
                        m('span', {}, b.title),
                        m('span', {}, b.value)
                    ))
            )
        )
}
export default ProfileHighlights;
