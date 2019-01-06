// SeriesView.jsx


import m from 'mithril'
import _ from 'lodash'

import LauncherBanner from '../ui/LauncherBanner.jsx';
import CardContainer from '../../components/layout/CardContainer.jsx';
import SeriesCard from '../../components/cards/SeriesCard.jsx';

import {remoteData} from '../../store/data';

const SeriesView = (auth) => { return {
	oninit: remoteData.Series.loadList,
	view: () => <div class="main-stage">
		
		
			<LauncherBanner 
				title="Festivals" 
			/>
		<CardContainer>
			<SeriesCard eventId={'new'}/>
			{

				remoteData.Series.list
					.map(series => <SeriesCard data={series} eventId={series.id}/>)
			}
		</CardContainer>
	</div>
}}
export default SeriesView;
