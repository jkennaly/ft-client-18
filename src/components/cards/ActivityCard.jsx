// src/components/cards/ActivityCard.jsx

import m from "mithril";
import _ from "lodash";
import moment from "dayjs";
var relativeTime = require('dayjs/plugin/relativeTime')
moment.extend(relativeTime)

import ComposedNameField from "../fields/ComposedNameField.jsx";
import NameField from "../fields/NameField.jsx";
import AverageRatingField from "../fields/AverageRatingField.jsx";
import UserAvatarField from "../fields/UserAvatarField.jsx";
import Icon from '../fields/Icon.jsx'
import DiscussOverlay from "../cardOverlays/DiscussOverlay.jsx";
import UserCard from "../cards/UserCard.jsx";
import { remoteData } from "../../store/data";

const displayComment = (me) =>
  me.filter((m) => m.messageType === 1 || m.messageType === 8)[0];

const id = ({ messageArray }) => {
  const cm = displayComment(messageArray);
  const c = cm ? cm.id : "";
  return c;
};

const year = ({ messageArray }) => {
  const cm = displayComment(messageArray)
    ? displayComment(messageArray)
    : messageArray[0];
  const mYear = moment(cm.timestamp)
    .utc()
    .fromNow();
  return mYear;
};

const comment = ({ messageArray }) => {
  const cm = displayComment(messageArray);
  const c = cm ? cm.content : "";
  return c;
};

const classes = ({ messageArray, userId, discusser }) => {
  const reviewMessage = messageArray.find((m) => m.messageType !== 2);
  const reviewId = _.get(reviewMessage, "id");
  const ownReview = userId && discusser === userId;
  const reviewUnread =
    reviewId && !ownReview && remoteData.MessagesMonitors.unread(reviewId);
  //console.log('ActivityCard classes', userId, ownReview, reviewUnread, reviewMessage)
  return `ft-card-large ft-activity-card ${
    ownReview ? "ft-own-content" : !reviewUnread ? "ft-already-read" : ""
  }`;
};
const ActivityCard = (vnode) => {
  var showLong = false;

  const defaultClick = (msg) => (e) => {
    //console.log('span click');
    e.stopPropagation();
    if (showLong) m.route.set("/messages/related", { messageId: msg.id });
    showLong = true;
  };
  return {
    view: ({ attrs }) => (
      <div
        class={classes(attrs)}
        onclick={attrs.clickFunction ? attrs.clickFunction : defaultClick}
      >
        {
          //console.log('ActivityCard discusser user', attrs.discusser, attrs.userId)
        }
        {attrs.overlay === "discuss" &&
        attrs.discussSubject &&
        attrs.messageArray ? (
          <DiscussOverlay
            discussSubject={attrs.discussSubject}
            messageArray={attrs.messageArray}
            headline={attrs.headline}
            rating={attrs.rating}
            fallbackClick={defaultClick(attrs.messageArray[0])}
          />
        ) : (
          ""
        )}
        <div class="ft-vertical-fields ft-flex-grow">
          <div class="ft-horizontal-fields ft-card-above-overlay">
            {attrs.headline ? (
              <span
                class="ft-card-title"
                onclick={attrs.headact ? attrs.headact : () => 0}
              >
                {attrs.headline}
              </span>
            ) : (
              ""
            )}
            {attrs.discusser === attrs.userId ||
            !remoteData.MessagesMonitors.unread(id(attrs)) ? (
              ""
            ) : (
              <div
                class="ft-quarter ft-close-click"
                onclick={(e) => {
                  //console.log('ft-quarter click')
                  //console.log('MessagesMonitors length ' + remoteData.MessagesMonitors.list.length)
                  if (attrs.discusser !== attrs.userId)
                    remoteData.MessagesMonitors.markRead(id(attrs));
                  e.stopPropagation();
                }}
              >
                <Icon class="cancel-circle" />
              </div>
            )}
          </div>
          <div class="ft-horizontal-fields ft-flex-grow">
            <div
              class="ft-vertical-fields ft-card-above-overlay"
              onclick={(e) => {
                //console.log('span click', attrs.discusser);
                e.stopPropagation();
                m.route.set(`/users/pregame/${attrs.discusser}`);
              }}
            >
              <UserAvatarField
                data={attrs.discusser}
                itemClicked={(e) => {}}
                userId={attrs.userId}
              />
              {attrs.rating ? (
                <AverageRatingField averageRating={attrs.rating} />
              ) : (
                ""
              )}
              <span>{year(attrs)}</span>
            </div>
            <span
              class="ft-flex-grow"
              onclick={defaultClick(attrs.messageArray[0])}
            >
              {!attrs.shortDefault || showLong || !comment(attrs)
                ? comment(attrs)
                : comment(attrs).substring(0, 50) + "...(+expand)"}
            </span>
          </div>
        </div>
      </div>
    ),
  };
};

export default ActivityCard;
