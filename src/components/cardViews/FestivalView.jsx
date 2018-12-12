// FestivalView.jsx


import m from 'mithril'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import FestivalCard from '../../components/cards/FestivalCard.jsx';

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
	//console.log('base sortFunction')
	//console.log(baseFunc)
	const fieldName = selecterFields(currentSorts[1])[0]
	//console.log(currentSorts[1])
	//console.log(fieldName)
	return baseFunc(currentSorts[1], fieldName)
	
}

const filterFunction = () => getFilter(getAppContext(), getAppPerspective())


const nameReduce = targetId => (n, s) => n.length || s.id !== targetId ? n : s.name

const FestivalView = (auth) => { return {
	oninit: () => {
		remoteData.Festivals.loadList()
		remoteData.Series.loadList()
	},
	view: () => <div class="main-stage">
		
			<LauncherBanner 
				title="FestivalTime Years" 
			/>
		<CardContainer>
		{getAppContext() === 'pregame' ? <FestivalCard eventId={'new'}/> : ''}
			
			{
				remoteData.Festivals.list
					.filter(filterFunction())
					.sort(sortFunction())
					.map(data => <FestivalCard  
						seriesId={data.series}
						festivalId={data.id}
						eventId={data.id}
					/>)
			}
		</CardContainer>
	</div>
}}
export default FestivalView;