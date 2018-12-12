// TextEntryModal.jsx


import m from 'mithril'
const _ = require("lodash");

// change selections
import UIButton from '../ui/UIButton.jsx';

const classes = attrs => 'modal ' + (attrs.display ? '' : 'hidden')
var textValue = ''
const TextEntryModal = {
	view: ({attrs}) => <div class={classes(attrs)}>
        <div class="modal-content">
            <div>{attrs.prompt}</div>
            <input type="text" onchange={e => textValue = e.target.value}/>
            <UIButton action={e => {
                attrs.hide()

            }} buttonName="Cancel" />
            <UIButton action={e => {
                attrs.hide()
                attrs.action(textValue)
            }} buttonName="Accept" />
        </div>
    </div>
};

export default TextEntryModal;