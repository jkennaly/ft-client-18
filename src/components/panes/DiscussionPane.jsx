// DiscussionPane.jsx

//given a list of bands to research, this widget 
//filters out unneded ones, sorts the rest and displays artist cards



import m from 'mithril'
import _ from 'lodash'

import UIButton from '../../components/ui/UIButton.jsx';

import DiscussModal from '../modals/DiscussModal.jsx';
import WidgetContainer from '../layout/WidgetContainer.jsx';

import DiscussionWidget from '../widgets/canned/DiscussionWidget.jsx';
import {remoteData, subjectData} from '../../store/data';


let count = 3		

const DiscussionPane = vnode => {
	var discussing = false
	var subjectObject = {}
	var removed = []
	let messageArray = []	
	let recentDiscussions = []	
					
	return {
		oninit: ({attrs}) => recentDiscussions = remoteData.Messages.recentDiscussions(attrs.userId),
		view: ({attrs}) => <WidgetContainer>
			{
				//find each message about this artist and order by user
				_.map(_.take(recentDiscussions, count)
					.filter(x => x)
				//	.map(x => {console.log(x);return x;}
					,
					me => <DiscussionWidget 
						messageArray={[me]} 
						userId={attrs.userId}
						supressModal={true}
						discussSubject={(s, me) => {
							subjectObject = _.clone(s)
							messageArray = _.clone(me)
							//console.log('ArtistDetail ArtistReviewCard discussSubject me length ' + me.length)
							discussing = true
						}}
						headerCard={true}
					/>
				)
			}
			{recentDiscussions.length > count ? 
                <UIButton action={e => {
                    //attrs.hide()
                    e.stopPropagation()
                    //console.log('pre rating ' + rating)
                    //console.log('pre baselineRating ' + baselineRating)
                    //comment = ''
                    //console.log('post rating ' + rating)
                    //console.log('post baselineRating ' + baselineRating)
                    //console.log('cancel')
                    count += 3
                    m.redraw()

                }} buttonName="Show More" /> : ''}
		{messageArray.length ? <DiscussModal
			display={discussing} 
			hide={sub => {discussing = false;}}
			subject={subjectObject}
			messageArray={messageArray}
			reviewer={messageArray[0].fromuser}
			user={attrs.userId}
		/> : ''}
		</WidgetContainer>
}};

export default DiscussionPane;

/*
<DiscussionWidget 
							messageArray={me} 
							discussSubject={(s, me) => {
								subjectObject = _.clone(s)
								messageArray = _.clone(me)
								//console.log('ArtistDetail ArtistReviewCard discussSubject me length ' + me.length)
								discussing = true
							}}
						/>
					)
				}
			</WidgetContainer>
			{messageArray.length ? <DiscussModal
				display={discussing} 
				hide={sub => {discussing = false;}}
				subject={subjectObject}
				messageArray={messageArray}
				reviewer={messageArray[0].fromuser}
				user={userId}
*/