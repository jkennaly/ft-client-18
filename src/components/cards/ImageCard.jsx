// src/components/cards/ImageCard.jsx


import m from 'mithril'
import _ from 'lodash'
import moment from 'dayjs'

import CloudImageField from '../fields/CloudImageField.jsx'
import  UserAvatarField from '../fields/UserAvatarField.jsx';
import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData';




const ImageCard = {
    view: ({ attrs }) =>
      <div class="ft-card-large" onclick={attrs.clickFunction ? attrs.clickFunction : e => true}>
            <h2>{subjectData.name(attrs.image)}</h2>

          <div class="ft-horizontal-fields ft-flex-grow">
            <div class="ft-vertical-fields">
              <UserAvatarField data={attrs.image.user} userId={attrs.userId} />
              <span>{moment(attrs.image.timestamp).utc().fromNow()}</span>
            </div>
              <span class="ft-flex-grow">
                <CloudImageField
                  addDisabled={true} 
                  hideFlag={true}
                  imageId={attrs.image.id} 
                />
              </span>
          </div>
      </div>
    
}

export default ImageCard;