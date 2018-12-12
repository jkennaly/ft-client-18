// FestivalTimePicker.jsx

import m from 'mithril'

const FestivalTimePicker = vnode => {
	var meridiem='AM'
	var hour = 0
	var minute = 0
	const hourChange = superChange => e => {
		hour = parseInt(e.target.value, 10)
		meridiem = hour > 1 && hour < 14 ? 'PM' : 'AM'
		superChange(hour * 60 + minute)
		//m.redraw()
	}
	const minuteChange = superChange => e => {
		minute = parseInt(e.target.value, 10)
		superChange(hour * 60 + minute)
		//m.redraw()
	}
	return {
		oncreate: ({ attrs }) => {
			hour = attrs.default ? Math.floor(attrs.default / 60) : 0
			minute = attrs.default ? (attrs.default % 60) : 0

		},
		view: ({ attrs }) => <div>
			<select class="time-picker-hour" name={attrs.name} onchange={hourChange(attrs.onchange)}>
				{['10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
				'10', '11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9']
					.map((v, i) => <option selected={attrs.default && (Math.floor(attrs.default / 60) === i)} value={i}>{v}</option>)
				}
			</select>
			{':'}
			<select class="time-picker-minute" onchange={minuteChange(attrs.onchange)}>
				{['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
					.map((v, i) => <option selected={attrs.default && (attrs.default % 60 === i * 5)} value={i * 5}>{v}</option>)
				}
			</select>
			{' ' + meridiem}
			</div>
}};

export default FestivalTimePicker;