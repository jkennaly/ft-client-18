// SeriesView.jsx


import m from 'mithril'
const _ = require("lodash");

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';

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

const sortFunction = () => {
	const baseFunc = getSort(getAppContext(), getAppPerspective())
	const currentSorts = _.uniq(getCurrentSorts(getAppContext(), getAppPerspective()))
	if(currentSorts.length < 2) return baseFunc
	const fieldName = selecterFields(currentSorts[1])[0]
	//console.log('base sortFunction')
	//console.log(baseFunc)
	//console.log(currentSorts)
	//console.log(fieldName)
	return baseFunc(currentSorts[1], fieldName)
	
}

const filterFunction = () => getFilter(getAppContext(), getAppPerspective())


const SeriesView = (auth) => { return {
	oninit: remoteData.Series.loadList,
	view: () => <div class="main-stage">
		
		
			<LauncherBanner 
				title="Festivals" 
			/>
		<CardContainer>
			{getAppContext() === 'pregame' ? <SeriesCard eventId={'new'}/> : ''}
			{

				remoteData.Series.list
					.filter(filterFunction())
					.sort(sortFunction())
					.map(series => <SeriesCard data={series} eventId={series.id}/>)
			}
		</CardContainer>
	</div>
}}
export default SeriesView;
