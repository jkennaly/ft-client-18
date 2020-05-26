// OptionSelectModal.jsx


import m from 'mithril'
import _ from 'lodash'

// change selections
import MenuItem from '../ui/MenuItem.jsx';

const classes = attrs => 'c44-modal ' + (attrs.display ? '' : 'hidden')
var textValue = ''
const OptionSelectModal = {
	view: ({attrs}) => <div class={classes(attrs)}>
        {
            console.log('OptionSelectModal', attrs)
        }
        <div class="c44-modal-content">
        <div class="c44-quarter c44-close-click" onclick={e => {
            e.stopPropagation()
            attrs.hide()
          }}>
            <i class="fas fa-times"/>
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