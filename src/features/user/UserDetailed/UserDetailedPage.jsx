import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedPhotos from './UserDetailedPhotos';
import UserDetailedEvents from './UserDetailedEvents';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { userDetailedQuery } from '../userQueries';
import UserDetailedSidebar from './UserDetailedSidebar';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { getUserEvents } from '../userActions';

// console.log(query); // returns the array of photos

class UserDetailedPage extends Component {
  async componentDidMount() {
    let events = await this.props.getUserEvents(this.props.userUid);
    console.log(events);
  }

  changeTab = (e, data) => {
    this.props.getUserEvents(this.props.userUid, data.activeIndex);
  };

  render() {
    const {
      profile,
      photos,
      auth,
      match,
      requesting,
      events,
      eventsLoading
    } = this.props;
    const isCurrentUser = auth.uid === match.params.id; // boolean
    const loading = Object.values(requesting)
      // if any values in firestore/status/requesting is 'true'
      .some(a => a === true);
    if (loading) return <LoadingComponent inverted={true} />;

    return (
      <Grid>
        <UserDetailedHeader profile={profile} />
        <UserDetailedDescription profile={profile} />
        <UserDetailedSidebar isCurrentUser={isCurrentUser} />

        {photos && photos.length > 0 && <UserDetailedPhotos photos={photos} />}

        <UserDetailedEvents
          changeTab={this.changeTab}
          events={events}
          eventsLoading={eventsLoading}
        />
      </Grid>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let userUid = null;
  let profile = {};

  if (ownProps.match.params.id === state.auth.uid) {
    // my profile is teh same as auth
    profile = state.firebase.profile;
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) &&
      state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }
  return {
    auth: state.firebase.auth,
    profile,
    userUid,
    events: state.events.userEvents,
    eventsLoading: state.async.loading,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting // sort of loading...
  };
};

const mapDispatchToProps = {
  getUserEvents
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))
)(UserDetailedPage);
