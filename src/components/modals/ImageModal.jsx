// ImageModal.jsx
// src/components/modals


import m from 'mithril'
import _ from 'lodash'

import {remoteData} from '../../store/data';
import {subjectData} from '../../store/subjectData'

// change selections
import UIButton from '../ui/UIButton.jsx';
import CloudinaryUploadWidget from '../widgets/CloudinaryUpload.jsx'

const {
	Images: images
} = remoteData


const classes = attrs => 'ft-modal ' + (attrs.display ? '' : 'hidden')
var _widgetExists = false
var _title = ''
var _author = ''
var _sourceUrl = ''
var _license = ''
var _licenseUrl = ''
var _licenses = []

const jsx = function({attrs}) {
	function widgetExists(state) {if(_.isUndefined(state)) return _widgetExists; return _widgetExists = state}
	function license(state) {if(_.isUndefined(state)) return _license || attrs.license; return _license = state}
	function licenseUrl(state) {if(_.isUndefined(state)) return _licenseUrl || attrs.licenseUrl; return _licenseUrl = state}
	function title(state) {if(_.isUndefined(state)) return _title || attrs.title; return _title = state}
	function author(state) {if(_.isUndefined(state)) return _author || attrs.author; return _author = state}
	function sourceUrl(state) {if(_.isUndefined(state)) return _sourceUrl || attrs.sourceUrl; return _sourceUrl = state}
	function validated() {return title() && author() && sourceUrl() && license() && licenseUrl()}
	return {
	view: ({attrs}) => <div class={classes(attrs)}>
        <div class="ft-modal-content">
            <h1>Add {attrs.subjectName} Image</h1>
            <div>Image Title</div>
            <input type="text" 
                onchange={e => {title(e.target.value);}}
            />
            <div>Image Creator</div>
            <input type="text" 
                onchange={e => {author(e.target.value);}}
            />
            <div>Image Source URL</div>
            <input type="text" 
                onchange={e => {sourceUrl(e.target.value);}}
            />

            {
                attrs.licenses.length && attrs.phTitle ? <div class="ft-name-field">
		            <label for="license">
		                {`License Name`}
		            </label>
		                <select id="ft-license-selector" name="license" onchange={e => {
		                    license(e.target.innerHTML)
							licenseUrl(e.target.value)
		                    e.stopPropagation()
		                }}>
		                    {
		                        attrs.licenses
		                            .map((s, i) => <option selected={!i} value={s.licenseUrl}>{s.license}</option>)
		                    }
		                </select>
		        </div> : <div>
                    <div>Image License</div>
                    <input type="text" onchange={e => license(e.target.value)}/>
                    <div>License URL</div>
                    <input type="text" onchange={e => licenseUrl(e.target.value)}/>  
                </div>
            }


            <UIButton action={e => {
                attrs.hide()

            }} buttonName="Cancel" />
            <UIButton action={validated() ? e => {

                widgetExists(true)

                
            } : e => 0} buttonName={validated() ? "Accept" : "Enter image origin"} />
            {widgetExists() ? <CloudinaryUploadWidget 
                subject={attrs.subject}
                subjectType={attrs.subjectType}
                sources={attrs.sources}
                resultFunction={result => {
                    //fail silently
                    if(!result) return
                    //console.log(result)
                    if(result[0].secure_url.indexOf('image' > 0)) {
                        attrs.action({
                            subject: attrs.subject,
                            subjectType: attrs.subjectType,
                            url: result[0].secure_url,
                            title: title(),
                            sourceUrl: sourceUrl(),
                            author: author(),
                            license: license(),
                            licenseUrl: licenseUrl()
                        })
                        widgetExists(false)
                        attrs.hide()
                    }
                }}
            /> : ''}
        </div>
    </div>
}}

const ImageModal = {
	oninit: () => console.log('img modal'),
	view: ({attrs}) => {
		const licenses = _.uniqBy(images.getFiltered(x => true), 'licenseUrl')
		const mapping = {
			subject: attrs.subject,
            subjectType: attrs.subjectType,
			subjectName: subjectData.name(attrs.subject, attrs.subjectType),
			sources: attrs.sources,
			hide: attrs.hide,
			display: attrs.display,
			licenses: licenses,
            title: attrs.phTitle,
            sourceUrl: attrs.phSourceUrl,
            author: attrs.phCreator,
            license: licenses.length ? licenses[0].license : '',
            licenseUrl: licenses.length ? licenses[0].licenseUrl : '',
            action: attrs.action
		}
		return m(jsx, mapping)
	}
}
export default ImageModal;
