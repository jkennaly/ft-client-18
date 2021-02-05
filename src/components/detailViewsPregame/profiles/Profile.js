// Profile.js
// components: user-profile/components

/*
userData | Object | No | userData to construct the form |
self | boolean | No | Show private fields |
private | Array<ContentItem> | No | Array of content item objects |
mixed | Array<ContentItem> | No | Array of content item objects |
*/

import m from 'mithril'
import _ from 'lodash'
import Highlights from './ProfileHighlights'
import Item from './ContentItem'

const emptyUser = `data:image/svg+xml;utf8,%3C%3Fxml version='1.0' encoding='UTF-8' standalone='no'%3F%3E%3C!-- Written by Treer (gitlab.com/Treer) --%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='600' height='600' fill='white' color='%2300d7d7'%3E%3Ctitle%3EAbstract user icon%3C/title%3E%3Cdefs%3E%3CclipPath id='circular-border'%3E%3Ccircle cx='300' cy='300' r='280' /%3E%3C/clipPath%3E%3CclipPath id='avoid-antialiasing-bugs'%3E%3Crect width='100%25' height='498' /%3E%3C/clipPath%3E%3C/defs%3E%3Ccircle cx='300' cy='300' r='280' fill='currentcolor' clip-path='url(%23avoid-antialiasing-bugs)' /%3E%3Ccircle cx='300' cy='230' r='115' /%3E%3Ccircle cx='300' cy='550' r='205' clip-path='url(%23circular-border)' /%3E%3C/svg%3E`

const Profile = {
	//oncreate: console.log('Launched'),
	//onupdate: () => console.log('Profile update'),
	view: ({attrs}) => m('div.c44-up-container.c44-fvf.c44-fjcc.c44-w-600px', {},
        //console.log('Profile attrs', attrs),
        m('header.c44-up-header.c44-pr.c44-fvf', {}, 
            m(`img.c44-h-ma50vh.c44-of-con`, {src: _.get(attrs, 'userData.imgs.profile.src', emptyUser)}),
            m(Highlights, {userData: attrs.userData})
        ),
        attrs.interactive ? m('hr.c44-w-100') : '',
        attrs.interactive ? attrs.interactive : '',
        m('hr.c44-w-100'),
        m('section.c44-up-content-private', {}, 
            (_.isArray(attrs.private) ? attrs.private : [])
                .map(i => m(Item, i))

        ),
        m('hr.c44-w-100'),
        m('section.c44-up-content-mixed', {}, 
            m('section.c44-up-mixed-public', {},
            (_.isArray(attrs.mixed) ? attrs.mixed : [])
                .filter(i => i.public)
                .map(i => m(Item, i))

            ),
            m('section.c44-up-mixed-private', {},
            (_.isArray(attrs.mixed) ? attrs.mixed : [])
                .filter(i => !i.public)
                .map(i => m(Item, i))

            ),
        ),
        m('header.c44-up-header')
    )
}
export default Profile;
