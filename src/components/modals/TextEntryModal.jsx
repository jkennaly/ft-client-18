// TextEntryModal.jsx


import m from 'mithril'
import _ from 'lodash'

// change selections
import UIButton from '../ui/UIButton.jsx';

const classes = attrs => 'c44-modal ' + (attrs.display ? '' : 'hidden')
var textValue = ''
const TextEntryModal = {
	view: ({attrs}) => <div class={classes(attrs)}>
        <div class="c44-modal-content">
            <div>{attrs.prompt}</div>
            <div>{attrs.textInsert}</div>
            <input type="text" onchange={e => textValue = e.target.value}/>
            <UIButton action={e => {
                attrs.hide()
                if(attrs.cancelAction) attrs.cancelAction(textValue)


            }} buttonName={attrs.cancelText ? attrs.cancelText : "Cancel"} />
            <UIButton action={e => {
                attrs.hide()
                attrs.action(textValue)
            }} buttonName={attrs.actionText ? attrs.actionText : "Accept"} />
        </div>
    </div>
}

export default TextEntryModal