// DiscussModal.jsx
//review modals combine rating and comment messages into one modal


import m from 'mithril'
import _ from 'lodash'

// change selections
import UIButton from '../../components/ui/UIButton.jsx';

import ArtistReviewCard from '../../components/cards/ArtistReviewCard.jsx';

import {remoteData, subjectData} from '../../store/data';

const classes = attrs => {return 'modal ' + (attrs.display ? '' : 'hidden');}
var selectedId = 0

const displayComment = me => me.filter(m => m.messageType === 1 || m.messageType === 8)[0]

const id = ({messageArray}) => {

    const cm = displayComment(messageArray)
    const c = cm ? cm.id : ''
    return c
}
const DiscussModal = vnode => {
    var changeFlag = 1
    var comment = vnode.attrs.subject.sub ? subjectData.commentBy(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user) : ''
    //console.log('new DiscussModal  for ' + name + '@' + rating)
    var commentId = subjectData.commentId(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user)
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
        const activeId = id(attrs)
        if(newCommentMessage) remoteData.Messages.create({
            fromuser: attrs.user,
            subject: activeId,
            subjectType: 10,
            messageType: 8,
            content: localComment

        })
        remoteData.MessagesMonitors.markRead(activeId)
        //console.log('newRatingMessage ' + newRatingMessage)
        //console.log('newCommentMessage ' + newCommentMessage)
        e.stopPropagation()
    }
    return {
    	view: ({attrs}) => <div class={classes(attrs)}>
            <div class="modal-content">
                {attrs.headline ? <h3>{attrs.headline}</h3> : subjectData.name(attrs.subject.sub, attrs.subject.type)}
                {/* base comment with no discussion overlay */}
                {attrs.messageArray ? 
                    <ArtistReviewCard 
                        messageArray={attrs.messageArray} 
                        reviewer={attrs.reviewer}
                        shortDefault={true}
                        rating={attrs.rating}
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

export default DiscussModal;