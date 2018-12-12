// ReviewModal.jsx
//review modals combine rating and comment messages into one modal


import m from 'mithril'
const _ = require("lodash");

// change selections
import UIButton from '../../components/ui/UIButton.jsx';

import ComposedNameField from '../../components/fields/ComposedNameField.jsx';
import MyRatingField from '../../components/fields/MyRatingField.jsx';

import {remoteData, subjectData} from '../../store/data';

const classes = attrs => {return 'modal ' + (attrs.display ? '' : 'hidden');}
var selectedId = 0
const ReviewModal = vnode => {
    var name = subjectData.name(vnode.attrs.subject.sub, vnode.attrs.subject.type)
    var rating = subjectData.ratingBy(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user)
    var comment = subjectData.commentBy(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user)
    var localRating = 0
    var localComment = ''
    return {
        onupdate: vnode => {
            name = subjectData.name(vnode.attrs.subject.sub, vnode.attrs.subject.type)
            rating = subjectData.ratingBy(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user),
            comment = subjectData.commentBy(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user)
    },
    	view: ({attrs}) => <div class={classes(attrs)}>
            <div class="modal-content">
                <ComposedNameField fieldValue={name} />
                <MyRatingField 
                    currentRating={localRating ? localRating : rating} 
                    action={newRating => localRating = newRating} 
                />
                <textarea 
                    onchange={e => localComment = e.target.value} 
                    value={comment} 
                    class="modal-textarea"
                    />
                {
                    /*

                    */
                //subject name

                //rating stars

                //comment entry
            }
            
                

                <UIButton action={e => {
                    attrs.hide()
                    console.log('cancel')

                }} buttonName="Cancel" />
                <UIButton action={e => {
                    //console.log('ReviewModal')
                    //console.log(textValue)
                    //console.log(selectedId)
                    //if there is a selected id, return it
                    //if not, create the artist, then return that id
                    attrs.hide()
                    console.log('Save')
                    console.log('localRating ' + localRating)
                    console.log('localComment ' + localComment)
                    const newRatingMessage = localRating && localRating !== rating
                    const newCommentMessage = localComment && localComment !== comment
                    if(newRatingMessage) remoteData.Messages.create({
                        fromuser: attrs.user,
                        subject: attrs.subject.sub,
                        subjectType: attrs.subject.type,
                        messageType: 2,
                        content: '' + localRating

                    })
                    if(newCommentMessage) remoteData.Messages.create({
                        fromuser: attrs.user,
                        subject: attrs.subject.sub,
                        subjectType: attrs.subject.type,
                        messageType: 1,
                        content: localComment

                    })
                    //
                }} buttonName="Save" />
            </div>
        </div>
}};

export default ReviewModal;