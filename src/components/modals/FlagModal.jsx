// src/components/modals/FlagModal.jsx
//review modals combine rating and comment messages into one modal


import m from 'mithril'
import _ from 'lodash'

// change selections
import UIButton from '../../components/ui/UIButton.jsx';
import CloudImageField from '../../components/fields/CloudImageField.jsx';

import ActivityCard from '../../components/cards/ActivityCard.jsx';

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'

const classes = attrs => {return 'c44-modal ' + (attrs.display ? '' : 'hidden');}
var selectedId = 0

const displayComment = me => me.filter(m => m.messageType === 1 || m.messageType === 8)[0]

const id = ({messageArray}) => {

    const cm = displayComment(messageArray)
    const c = cm ? cm.id : 0
    return c
}
const FlagModal = vnode => {
    var changeFlag = 1
    var comment = vnode.attrs.subject.sub ? subjectData.commentBy(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user) : ''
    //console.log('new FlagModal  for ' + name + '@' + rating)
    var commentId = subjectData.commentId(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user)
    var localComment = ''
    var sub = ''

    const submit = attrs => e => {
        console.log('FlagModal submit', attrs)
        //console.log(textValue)
        //console.log(selectedId)
        //if there is a selected id, return it
        //if not, create the artist, then return that id
        attrs.hide()
        //console.log('Save')
        //console.log('localRating ' + localRating)
        //console.log('localComment ' + localComment)
        /*
        const newCommentMessage = localComment
        const activeMessage = displayComment(attrs.messageArray)
        const activeId = activeMessage.id
        remoteData.MessagesMonitors.markRead(activeId)
        //console.log('newRatingMessage ' + newRatingMessage)
        //console.log('newCommentMessage ' + newCommentMessage)
        */
        remoteData.Flags.create({
            subject: attrs.subject,
            subjectType: attrs.subjectType,
            flagType: 1,
            content: localComment,
            

        })
        e.stopPropagation()
    }
    return {
    	view: ({attrs}) => <div class={classes(attrs)}>
            <div class="c44-modal-content">
                <h3>Flag For Review</h3>
                {/* base comment with no discussion overlay */}
                {
                    attrs.messageArray ?  <ActivityCard 
                        messageArray={attrs.messageArray} 
                        discusser={attrs.reviewer}
                        shortDefault={true}
                    /> : 
                    attrs.image ?  <CloudImageField 
                        addDisabled={true} 
                        hideFlag={true}
                        subjectType={attrs.image.subjectType} 
                        subject={attrs.image.subject} 
                        sources={['url']} 
                    /> : 
                ''}
                <label for="reason">Reason</label>
                <select id="reason" name="reason">
                    <option value={0}>Bad</option>
                </select>
                <label for="discuss">Explanation</label>
                {/* base comment with no discussion overlay */}
                {/* show each new discussion, and it's immdeiate predeccessor */}

                <textarea 
                    id="discuss" name="discuss"
                    onchange={e => {
        //console.log('e.target.value ' + e.target.value)
        //console.log('localComment ' + localComment)
                        localComment = e.target.value; 
                    }} 
                    class="modal-textarea"
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

export default FlagModal;