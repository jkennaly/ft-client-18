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
    try {
        //console.log('getting token now')
        const [token] = await auth.getAccessToken()
        if (!token) throw 'no token'
        if (resolveComponent.preload) resolveComponent.preload(Object.assign({}, rParams, params))
        //console.log('got token')
    } catch (err) {
        //console.log('reject component', rejectComponent)
        bannerTitle("")
        eventBadge("")
        return rejectComponent && rejectComponent.length ? rejectComponent :
            rejectComponent ? { view: () => m(rejectComponent, baseAttrs) } :
                Launcher
    }
    const [gtt, ...acb] = await Promise.all([auth.getGttDecoded(), auth.getFtUserId(), auth.getRoles()])
    //console.log('acb', acb)
    baseAttrs.userId = acb[0]
    baseAttrs.userRoles = acb[1]
    baseAttrs.gtt = gtt ? gtt : {}
    await acb[0] && remoteData.Users.getLocalPromise(acb[0])
    await acb[0] && remoteData.Flags.remoteCheck()
    await acb[0] && remoteData.Intentions.remoteCheck()
    await acb[0] && remoteData.Interactions.remoteCheck()
    await acb[0] && remoteData.MessagesMonitors.remoteCheck()
    await acb[0] &&
        remoteData.Messages.acquireListSupplement(
            "filter=" +
            JSON.stringify({
                where: {
                    fromuser: acb[0],
                    messageType: CHECKIN
                }
            }),
            undefined,
            true
        )
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
            const mainAttrs = Object.assign({}, attrIds, baseAttrs)
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