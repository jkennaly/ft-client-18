// SetView.jsx


const m = require("mithril");
const _ = require('lodash');


import StageBanner from '../../components/ui/StageBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SetCard from '../../components/cards/SetCard.jsx';

import {remoteData} from '../../store/data';

import {getFilter} from '../../store/ui';
import {getFilterNames} from '../../store/ui';
import {getFilterPreLoad} from '../../store/ui';
import {getSort} from '../../store/ui';
import {getSortName} from '../../store/ui';
import {getCurrentSorts} from '../../store/ui';


import {availableSelecters} from '../../store/sort';
import {selecterFields} from '../../store/sort';
// Local state
import {getAppPerspective} from '../../store/ui';
import {getAppContext} from '../../store/ui';
		//<span>{getFilter(getAppContext(), getAppPerspective())}</span>
		//<span>{getAppPerspective()}</span>

const sortFunction = () => {
	const baseFunc = getSort(getAppContext(), getAppPerspective())
	const currentSorts = _.uniq(getCurrentSorts(getAppContext(), getAppPerspective()))
	if(currentSorts.length < 2) return baseFunc
	//console.log('base sortFunction')
	//console.log(baseFunc)
	const fieldName = selecterFields(currentSorts[1])[0]
	//console.log(currentSorts[1])
	//console.log(fieldName)
	return baseFunc(currentSorts[1], fieldName)
	
}

const filterFunction = () => getFilter(getAppContext(), getAppPerspective())


const SetView = (auth) => { return {
	oninit: () => {
		remoteData.Series.loadList()
		remoteData.Festivals.loadList()
		remoteData.Dates.loadList()
		remoteData.Days.loadList()
		remoteData.Sets.loadList()
		remoteData.Artists.loadList()
		remoteData.Lineups.loadList()
		remoteData.Places.loadList()
		remoteData.Messages.loadList()
		remoteData.ArtistPriorities.loadList()
	},
	view: () => <div class="main-stage">
		<StageBanner 
			action={() => auth.logout()} 
			title="Set" 
			idFields={remoteData.Sets.idFields()}
		/>
		<CardContainer>
			{
				_.take(remoteData.Sets.list
					.filter(filterFunction())
					.sort(sortFunction())
				, 25)
				.map(data => <SetCard superId={data.day}
					nameFrag={''}
					artistName={remoteData.Artists.getName(data.band)}
					averageRating={remoteData.Messages.setAverageRating(data.id)}
					stageId={data.stage}
					dayId={data.day}
					eventId={data.id}
					dateId={remoteData.Days.getDateId(data.day)}
					festivalId={remoteData.Days.getFestivalId(data.day)}
					seriesId={remoteData.Days.getSeriesId(data.day)}
					artistPriorityName={remoteData.ArtistPriorities.getName(remoteData.Lineups.getPriFromArtistFest(data.band, remoteData.Days.getFestivalId(data.day)))}
					/>)
			}
		</CardContainer>
	</div>
}}
export default SetView;