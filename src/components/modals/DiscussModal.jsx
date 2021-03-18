// src/components/modals/DiscussModal.jsx
//review modals combine rating and comment messages into one modal


import m from 'mithril'
import _ from 'lodash'

// change selections
import UIButton from '../../components/ui/UIButton.jsx';

import ActivityCard from '../../components/cards/ActivityCard.jsx';

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'

const classes = attrs => {return 'ft-modal ' + (attrs.display ? '' : 'hidden');}
var selectedId = 0

const displayComment = me => me.filter(m => m.messageType === 1 || m.messageType === 8)[0]

const id = ({messageArray}) => {

    const cm = displayComment(messageArray)
    const c = cm ? cm.id : 0
    return c
}
const DiscussModal = vnode => {
    var changeFlag = 1
    var comment = vnode.attrs.subjectObject.subject ? subjectData.commentBy(vnode.attrs.subjectObject.subject, vnode.attrs.subjectObject.subjectType, vnode.attrs.user) : ''
    //console.log('new DiscussModal  for ' + name + '@' + rating)
    var commentId = subjectData.commentId(vnode.attrs.subjectObject.subject, vnode.attrs.subjectObject.subjectType, vnode.attrs.user)
    var localComment = ''
    var sub = ''

    const submit = attrs => e => {
        //console.log('DiscussModal')
        //console.log(textValue)
        //console.log(selectedId)
        //if there is a selected id, return it
        //if not, create the artist, then return that id
        attrs.hide()
        //console.log('Save')
        //console.log('localRating ' + localRating)
        //console.log('localComment ' + localComment)
        const newCommentMessage = localComment
        const activeMessage = attrs.flag ? attrs.flag : displayComment(attrs.messageArray)
        const activeId = activeMessage.id
        if(newCommentMessage) remoteData.Messages.create({
            fromuser: attrs.user,
            subject: activeId,
            subjectType: activeMessage.flagType ? FLAG : MESSAGE,
            messageType: 8,
            content: localComment,
            baseMessage: activeMessage.baseMessage ? activeMessage.baseMessage : 
                activeMessage.flagType ? undefined :
                activeId

        })
        if(remoteData.MessagesMonitors.unread(activeId)) remoteData.MessagesMonitors.markRead(activeId)
        //console.log('newRatingMessage ' + newRatingMessage)
        //console.log('newCommentMessage ' + newCommentMessage)
        e.stopPropagation()
    }
    return {
        oncreate: ({dom, attrs}) => {
            if(!attrs.startText) return
            dom.querySelector('#discuss').value = attrs.startText
            localComment = attrs.startText

        },
    	view: ({attrs}) => <div class={classes(attrs)}>
            <div class="ft-modal-content">
                {attrs.headline ? <h3>{attrs.headline}</h3> : subjectData.name(attrs.subjectObject.subject, attrs.subjectObject.subjectType)}
                {/* base comment with no discussion overlay */}
                {attrs.messageArray ? 

                    <ActivityCard 
                        messageArray={attrs.messageArray} 
                        discusser={attrs.reviewer}
                        overlay={'discuss'}
                        shortDefault={true}
                    /> : ''}
                <label for="discuss">Discussion</label>
                {/* base comment with no discussion overlay */}
                {/* show each new discussion, and it's immdeiate predeccessor */}

                <textarea 
                    id="discuss" name="discuss"
                    onchange={e => {
        //console.log('e.target.value ' + e.target.value)
        //console.log('localComment ' + localComment)
                        localComment = e.target.value; 
                    }} 
                    class="ft-modal-textarea"
                    onkeypress={e => {
                        if(e.keyCode === 13) return submit(attrs)(e)
                    }}

                ></textarea>

                <UIButton action={e => {
                    attrs.hide()
                    e.stopPropagation()
                    //console.log('pre rating ' + rating)
                    //console.log('pre baselineRating ' + baselineRating)
                    comment = ''
                    //console.log('post rating ' + rating)
                    //console.log('post baselineRating ' + baselineRating)
                    //console.log('cancel')
                    m.redraw()

                }} buttonName="Cancel" />
     {           <UIButton action={submit(attrs)} 
                buttonName="Save" />
            }
            </div>
        </div>
}};

export default DiscussModal;