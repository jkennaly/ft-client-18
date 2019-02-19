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

const classes = attrs => {return 'modal ' + (attrs.display ? '' : 'hidden');}
var selectedId = 0
const ReviewModal = vnode => {
    var changeFlag = 1
    var name = vnode.attrs.subject.sub ? subjectData.name(vnode.attrs.subject.sub, vnode.attrs.subject.type) : ''
    var rating = vnode.attrs.subject.sub ? subjectData.ratingBy(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user) : 0
    var comment = vnode.attrs.subject.sub ? subjectData.commentBy(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user) : ''
    //console.log('new ReviewModal  for ' + name + '@' + rating)
    var baselineRating = rating + 0
    var baselineComment = comment + '' 
    var ratingId = subjectData.ratingId(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user)
    var commentId = subjectData.commentId(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user)
    var localRating = 0
    var localComment = ''
    var sub = ''

    const submit = attrs => e => {
        //console.log('ReviewModal')
        //console.log(textValue)
        //console.log(selectedId)
        //if there is a selected id, return it
        //if not, create the artist, then return that id
        attrs.hide(attrs.subject)
        //console.log('Save')
        //console.log('localRating ' + localRating)
        //console.log('localComment ' + localComment)
        const newRatingMessage = localRating && localRating !== baselineRating
        const newCommentMessage = localComment && localComment !== baselineComment
        if(newRatingMessage) remoteData.Messages.create({
            //fromuser: attrs.user,
            subject: attrs.subject.sub,
            subjectType: attrs.subject.type,
            messageType: 2,
            content: '' + localRating

        })
        if(!newRatingMessage && baselineRating) remoteData.Messages.updateInstance(
            ratingId,
            {timestamp: moment().format('YYYY-MM-DD HH:mm:ss')}
        )
        if(newCommentMessage) remoteData.Messages.create({
            //fromuser: attrs.user,
            subject: attrs.subject.sub,
            subjectType: attrs.subject.type,
            messageType: 1,
            content: localComment

        })
        if(!newCommentMessage && baselineComment) remoteData.Messages.updateInstance(
            commentId,
            {timestamp: moment().format('YYYY-MM-DD HH:mm:ss')}
        )
        //console.log('newRatingMessage ' + newRatingMessage)
        //console.log('newCommentMessage ' + newCommentMessage)
        e.stopPropagation()
        m.redraw()
    }
    const initDom = vnode => {
            //console.log('consider updating ReviewModal  for ' + name)
            //console.log('consider updating ReviewModal  for user ' + vnode.attrs.user)
            const newSub = '' + vnode.attrs.subject.sub + '-' + vnode.attrs.subject.type + '-' + vnode.attrs.user
            if(sub === newSub) return
            name = subjectData.name(vnode.attrs.subject.sub, vnode.attrs.subject.type)
            rating = subjectData.ratingBy(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user),
            comment = subjectData.commentBy(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user)
            sub = '' + newSub
            baselineRating = rating + 0
            baselineComment = comment + '' 
            ratingId = subjectData.ratingId(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user)
            commentId = subjectData.commentId(vnode.attrs.subject.sub, vnode.attrs.subject.type, vnode.attrs.user)
            localRating = rating + 0
            changeFlag = changeFlag + 1
            if(changeFlag > 1000000) changeFlag = 1
            m.redraw()
            //console.log('ReviewModal updated  for ' + name + '@' + rating)
            //console.log('localRating ' + localRating)
            //console.log('changeFlag ' + changeFlag)
    }
    return {
        onupdate: initDom,
        oncreate: initDom,
    	view: ({attrs}) => <div class={classes(attrs)}>
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
                        if(e.keyCode === 13) return submit(attrs)(e)
                    }}

                
                >{comment}</textarea>

                <UIButton action={e => {
                    attrs.hide()
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
                <UIButton action={submit(attrs)} 
                buttonName="Save" />
            </div>
        </div>
}};

export default ReviewModal;