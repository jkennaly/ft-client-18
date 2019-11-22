// ReviewModal.jsx
//review modals combine rating and comment messages into one modal


import m from 'mithril'
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

// change selections
import UIButton from '../../components/ui/UIButton.jsx';

import ComposedNameField from '../../components/fields/ComposedNameField.jsx';
import MyRatingField from '../../components/fields/MyRatingField.jsx';

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'

var selectedId = 0
const ReviewModal = vnode => {
    var changeFlag = 1
    var name = vnode.attrs.subject.subject ? subjectData.name(vnode.attrs.subject.subject, vnode.attrs.subject.subjectType) : ''
    var rating = vnode.attrs.subject.subject ? subjectData.ratingBy(vnode.attrs.subject.subject, vnode.attrs.subject.subjectType, vnode.attrs.user) : 0
    var comment = vnode.attrs.subject.subject ? subjectData.commentBy(vnode.attrs.subject.subject, vnode.attrs.subject.subjectType, vnode.attrs.user) : ''
    //console.log('new ReviewModal  for ' + name + '@' + rating)
    var baselineRating = rating + 0
    var baselineComment = comment + '' 
    var ratingId = subjectData.ratingId(vnode.attrs.subject.subject, vnode.attrs.subject.subjectType, vnode.attrs.user)
    var commentId = subjectData.commentId(vnode.attrs.subject.subject, vnode.attrs.subject.subjectType, vnode.attrs.user)
    var localRating = 0
    var localComment = ''
    var sub = ''

    const submit = attrs => e => {
        //console.log('ReviewModal')
        //console.log(textValue)
        //console.log(selectedId)
        //if there is a selected id, return it
        //if not, create the artist, then return that id
        e.stopPropagation()
        attrs.hide(attrs.subject)
        //console.log('Save')
        //console.log('localRating ' + localRating)
        //console.log('localComment ' + localComment)
        const newRatingMessage = localRating && localRating !== baselineRating
        const newCommentMessage = localComment && localComment !== baselineComment
        return Promise.all([
            newRatingMessage ? remoteData.Messages.create({
                //fromuser: attrs.user,
                subject: attrs.subject.subject,
                subjectType: attrs.subject.subjectType,
                messageType: 2,
                content: '' + localRating
            }) : true,
            !newRatingMessage && baselineRating ? remoteData.Messages.updateInstance(
            {timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            ratingId
        }
        ) : true,
            newCommentMessage ? remoteData.Messages.create({
            //fromuser: attrs.user,
            subject: attrs.subject.subject,
            subjectType: attrs.subject.subjectType,
            messageType: 1,
            content: localComment

        }) : true,
            !newCommentMessage && baselineComment ? remoteData.Messages.updateInstance(
            {timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            commentId
        }
        ) : true
        ])
            .then(() => m.redraw()) 
    }
    const init = vnode => {
        if(!vnode.attrs.subject) throw new Error('No subject for ReviewModal')
            //console.log('consider updating ReviewModal  for ', vnode.attrs.subject)
            //console.log('consider updating ReviewModal  for user ' + vnode.attrs.user)
            const newSub = '' + vnode.attrs.subject.subject + '-' + vnode.attrs.subject.subjectType + '-' + vnode.attrs.user
            if(sub === newSub) return
            name = subjectData.name(vnode.attrs.subject.subject, vnode.attrs.subject.subjectType)
            rating = subjectData.ratingBy(vnode.attrs.subject.subject, vnode.attrs.subject.subjectType, vnode.attrs.user),
            comment = subjectData.commentBy(vnode.attrs.subject.subject, vnode.attrs.subject.subjectType, vnode.attrs.user)
            sub = '' + newSub
            baselineRating = rating + 0
            baselineComment = comment + '' 
            ratingId = subjectData.ratingId(vnode.attrs.subject.subject, vnode.attrs.subject.subjectType, vnode.attrs.user)
            commentId = subjectData.commentId(vnode.attrs.subject.subject, vnode.attrs.subject.subjectType, vnode.attrs.user)
            localRating = rating + 0
            changeFlag = changeFlag + 1
            if(changeFlag > 1000000) changeFlag = 1
            //m.redraw()
            //console.log('ReviewModal updated  for ' + name + '@' + rating)
            //console.log('localRating ' + localRating)
            //console.log('changeFlag ' + changeFlag)
    }
const classes = vnode => {init(vnode);return 'modal ' + (vnode.attrs.display ? '' : 'hidden');}
    return {
        onupdate: init,
        oninit: init,
    	view: (vnode) => <div class={classes(vnode)}>
            <div class="modal-content">
                <ComposedNameField fieldValue={name} />
                <MyRatingField 
                    currentRating={rating} 
                    changeFlag={changeFlag}
                    action={newRating => {
                        //console.log('ReviewModal MyRatingField action newRating ' + newRating)
                        if(!newRating) return
                        localRating = newRating; 
                        rating = localRating;
                    }} 
                />
                <label for="review-comment">Comment</label>
                <textarea 
                    id="review-comment" name="review-comment"
                    oninput={e => {
        //console.log('comment ' + comment)
        //console.log('e.target.value ' + e.target.value)
        //console.log('localComment ' + localComment)
                        localComment = e.target.value; 
                        comment = localComment
                    }} 
                    class="modal-textarea"
                    
                    onkeypress={e => {
                        if(e.keyCode === 13) return submit(vnode.attrs)(e)
                    }}

                
                >{comment}</textarea>

                <UIButton action={e => {
                    vnode.attrs.hide()
                    e.stopPropagation()
                    //console.log('pre rating ' + rating)
                    //console.log('pre baselineRating ' + baselineRating)
                    rating = baselineRating + 0
                    comment = baselineComment + ''
                    //console.log('post rating ' + rating)
                    //console.log('post baselineRating ' + baselineRating)
                    //console.log('cancel')
                    m.redraw()

                }} buttonName="Cancel" />
                <UIButton action={submit(vnode.attrs)} 
                buttonName="Save" />
            </div>
        </div>
}};

export default ReviewModal;