// src/services/authwrapper.js
import { remoteData } from "../store/data"
import m from 'mithril'
import _ from 'lodash'


export default (auth, ModalBox, Launcher, bannerTitle, eventBadge, focusSubject, bucksUpdate, popModal, appStartTime) => (resolveComponent, rejectComponent) => async (rParams) => {
    //console.log('authing...')
    const params = { titleSet: bannerTitle, eventSet: eventBadge }
    const baseAttrs = {
        titleSet: bannerTitle,
        eventSet: eventBadge,
        focusSubject: focusSubject,
        auth: auth,
        popModal: popModal,
        appStartTime: appStartTime
    }
    const security = {
        gtt: auth.userGtt(),
        userId: auth.userId(),
        roles: auth.userRoles()
    }
    try {
        //console.log('getting token now')
        //const token = await auth.getAccessToken()
        //if (!token) throw 'no token'
        if (resolveComponent.preload) resolveComponent.preload(Object.assign({}, rParams, params, security))
        console.log('resolve component', resolveComponent)
    } catch (err) {
        console.log('reject component', rejectComponent)
        bannerTitle("")
        eventBadge("")
        return rejectComponent && rejectComponent.length ? rejectComponent :
            rejectComponent ? { view: () => m(rejectComponent, baseAttrs) } :
                Launcher
    }
    try {


        await security.userId && remoteData.Users.getLocalPromise(security.userId)
        await security.userId && remoteData.Flags.remoteCheck()
        await security.userId && remoteData.Intentions.remoteCheck()
        await security.userId && remoteData.Interactions.remoteCheck()
        await security.userId && remoteData.MessagesMonitors.remoteCheck()
        await security.userId &&
            remoteData.Messages.acquireListSupplement(
                "filter=" +
                JSON.stringify({
                    where: {
                        fromuser: security.userId,
                        messageType: CHECKIN
                    }
                }),
                undefined,
                true
            )
    } catch (err) {
        console.error('status update error')
        console.error(err)
    }
    console.log('resolving')
    return {
        oninit: () => {
            //console.log(`component init`, acb, resolveComponent)
            /*
    .catch(err => {
        console.error('init fail', rParams)
	
    })
    */
        },
        view: ({ attrs }) => {
            const attrIds = _.reduce(
                attrs,
                (passing, v, k) => {
                    if (passing[k]) return passing
                    const kOk =
                        /^id$/.test(k) || /Id$/.test(k) || /^subject/.test(k)
                    const useV = kOk && (_.isInteger(v) || /^\d+$/.test(v))
                    passing[k] = _.isInteger(v) ? v : _.toInteger(v)
                    return passing
                },
                { filter: attrs.filter }
            )
            const mainAttrs = Object.assign({}, attrIds, baseAttrs, security)
            //console.log(`component resolving`, resolveComponent, mainAttrs)
            return [
                m(ModalBox, {
                    auth: auth,
                    bucksUpdate: bucksUpdate
                }),
                m(resolveComponent, mainAttrs)
            ]
        }
    }
}