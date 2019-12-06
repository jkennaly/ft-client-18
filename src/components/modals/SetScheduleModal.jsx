// SetScheduleModal.jsx


import m from 'mithril'
import _ from 'lodash'

// change selections
import ComposedNameField from '../../components/fields/ComposedNameField.jsx';
import StageNameField from '../../components/fields/StageNameField.jsx';
import ArtistNameField from '../../components/fields/ArtistNameField.jsx';
import UIButton from '../../components/ui/UIButton.jsx';
import FestivalTimePicker from '../../components/ui/FestivalTimePicker.jsx';
import {remoteData} from '../../store/data';

const upsertSet = data => 0
const classes = attrs => 'ft-modal ' + (attrs.display ? '' : 'hidden')
var startTime = 0
var endTime = 0
var selectedId = 0
const SetScheduleModal = {
	view: ({attrs}) => <div class={classes(attrs)}>
        <div class="ft-modal-content">
            <ComposedNameField fieldValue={remoteData.Days.getEventName(attrs.set.day)} />
            <StageNameField stageId={attrs.set.stage} />
            <ArtistNameField artistId={attrs.set.band} />
            <label for="start-time">Enter set start time</label>
            <FestivalTimePicker name="start-time" onchange={e => startTime = e} default={attrs.set.start ? attrs.set.start : startTime} />
            <label for="end-time">Enter set end time</label>
            <FestivalTimePicker name="end-time" onchange={e => endTime = e} default={attrs.set.end ? attrs.set.end : endTime} />
            {
                //show the day name
                //show the stage name
                //show the artist name
                //pick start time
                //pick end time
            }
            <UIButton action={e => {
                attrs.hide()

            }} buttonName="Cancel" />

            <UIButton action={e => {

                //times are minutes after 10:00 AM
                const data = {
                    id: attrs.set.id,
                    day: attrs.set.day,
                    stage: attrs.set.stage,
                    band: attrs.set.band,
                    start: startTime,
                    end: endTime,
                    user: attrs.user
                }
                const verb = data.id ? 'updateInstance' : 'create'
                if(attrs.set && endTime && endTime > startTime) attrs.action(data, verb)(remoteData.Sets.upsert(data))
                if(endTime && endTime > startTime) attrs.hide()


                //
            }} buttonName="Create/Update" />

            {!attrs.set.end ? '' : <UIButton action={e => {
                
                const data = {
                    id: attrs.set.id
                }
                const verb = 'delete'
                if(attrs.set) attrs.action(data, verb)(remoteData.Sets.delete(data))
                if(attrs.set) attrs.hide()


                //
            }} buttonName="Remove" />}
        </div>
    </div>
};

export default SetScheduleModal;