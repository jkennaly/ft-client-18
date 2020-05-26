// src/components/cards/ImageCard.jsx


import m from 'mithril'
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-2012-2022.min'

import CloudImageField from '../fields/CloudImageField.jsx'
import  UserAvatarField from '../fields/UserAvatarField.jsx';
import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData';




const ImageCard = {
    view: ({ attrs }) =>
      <div class="c44-card-large" onclick={attrs.clickFunction ? attrs.clickFunction : e => true}>
            <h2>{subjectData.name(attrs.image)}</h2>

          <div class="c44-horizontal-fields c44-flex-grow">
            <div class="c44-vertical-fields">
              <UserAvatarField data={attrs.image.user} />
              <span>{moment(attrs.image.timestamp).utc().fromNow()}</span>
            </div>
              <span class="c44-flex-grow">
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