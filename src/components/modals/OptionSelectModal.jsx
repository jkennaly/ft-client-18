// src/components/modals/OptionSelectModal.jsx


import m from 'mithril'
import _ from 'lodash'

// change selections
import MenuItem from '../ui/MenuItem.jsx';

const classes = attrs => 'ft-modal ' + (attrs.display ? '' : 'hidden')
var textValue = ''
const OptionSelectModal = {
	view: ({attrs}) => <div class={classes(attrs)}>
        {
            console.log('OptionSelectModal', attrs)
        }
        <div class="ft-modal-content">
        <div class="ft-quarter ft-close-click" onclick={e => {
            e.stopPropagation()
            attrs.hide()
          }}>
            <Icon name="cancel-circle" />
        </div>            {attrs.headerCard ? attrs.headerCard : ''}
            {attrs.options.map(opt => <MenuItem 
                data={opt}
                clickFunction={opt.itemClicked}
                key={opt.data.name}
            />)}
        </div>
    </div>
}

export default OptionSelectModal