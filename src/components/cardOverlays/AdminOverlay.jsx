// src/componenets/cardOverlays/AdminOverlay.jsx

import m from 'mithril'

import { remoteData } from '../../store/data';
import DiscussButton from './fifty/DiscussButton.jsx'
import FiftyButton from './fifty/FiftyButton.jsx'
import Icon from '../fields/Icon.jsx'
import globals from "../../services/globals"


const opened = {
  prompt: 'Initial Response',
  icon: <span class="fa-layers fa-2x fa-fw ft-icon-stack">
    <Icon name="flag" />
    <Icon name="eye"
      classes="ft-icon-stack-lower-right"


    />
  </span>

}
const review = {
  prompt: 'Report Action',
  icon: <span class="fa-layers fa-2x fa-fw ft-icon-stack">
    <Icon name="flag" />
    <Icon name="comment"
      classes="ft-icon-stack-lower-right"


    />
  </span>
}
const responded = (popModal, flag, discussFlag) => {
  return {
    prompt: 'Accept Response',
    icon: <span class="fa-layers fa-2x fa-fw ft-icon-stack">
      <Icon name="flag" />
      <Icon name="checkmark"
        classes="ft-icon-stack-lower-right"


      />
    </span>,
    actionText: 'Accept this response',
    cancelText: 'Discuss this response',
    cancelAction: text => {
      remoteData.Flags.advance('d1scussion', flag.id)
        .catch(console.error)
      popModal('discuss', {
        headline: `Discuss Flag ${flag.id}`,
        subjectObject: { subject: flag.id, subjectType: globals.FLAG },
        startText: text,
        flag: flag
      })
    },
    textInsert: flag.response
  }
}
const responseUpdate = {
  prompt: 'Update Response',
  icon: <span class="fa-layers fa-2x fa-fw ft-icon-stack">
    <Icon name="flag" />
    <Icon name="checkbox-checked"
      classes="ft-icon-stack-lower-right"


    />
  </span>
}
const close = {
  prompt: 'Close',
  icon: <span class="fa-layers fa-2x fa-fw ft-icon-stack">
    <Icon name="flag" />
    <Icon name="exit"
      classes="ft-icon-stack-lower-right"


    />
  </span>
}
const objectedClose = {
  prompt: 'Close',
  icon: <span class="fa-layers fa-2x fa-fw ft-icon-stack">
    <Icon name="flag" />
    <Icon name="exit"
      classes="ft-icon-stack-lower-right"


    />
  </span>
}


const nextStatus = ({ flag, asAdmin, popModal, discussFlag }) => flag.status === 1 ? opened :
  flag.status === 2 ? review :
    flag.status === 3 ? responded(popModal, flag, discussFlag) :
      flag.status === 5 && asAdmin ? responseUpdate :
        close

const AdminOverlay = {
  //oninit: ({attrs}) => console.log('AdminOverlay init', attrs),
  view: ({ attrs }) => <div class="ft-card-overlay" onclick={attrs.fallbackClick}>
    {attrs.flag.status === 5 ? <DiscussButton
      subjectType={globals.FLAG}
      subject={attrs.flag.id}
      discussSubject={attrs.discussFlag}
    /> : ''}
    {[
      opened, review, responded(attrs.popModal, attrs.flag, attrs.discussFlag), responseUpdate, close
    ]
      .filter((x, i) => i === 0 && attrs.flag.status === 1 && attrs.asAdmin ||
        i === 1 && attrs.flag.status === 2 && attrs.asAdmin ||
        i === 2 && attrs.flag.status === 3 && attrs.asUser ||
        i === 3 && attrs.flag.status === 5 && attrs.asAdmin ||
        i === 4 && attrs.flag.status === 5 && (attrs.asAdmin || attrs.asUser)

      )
      .map(button => <FiftyButton
        clickFunction={e => {
          attrs.popModal('text', {
            prompt: button.prompt,
            actionText: button.actionText ? button.actionText : 'Save',
            cancelText: button.cancelText ? button.cancelText : 'Cancel',
            action: button.action ? button.action(attrs.flag.id) : text => remoteData.Flags.advance(text, attrs.flag.id),
            cancelAction: button.cancelAction ? button.cancelAction : undefined,
            textInsert: button.textInsert ? button.textInsert : undefined
          })
          e.stopPropagation()
        }} >

        {button.icon}
      </FiftyButton>)

    }

  </div>

};

export default AdminOverlay;