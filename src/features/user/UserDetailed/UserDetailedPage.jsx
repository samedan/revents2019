import React, { Component } from 'react';
import { Card, Grid, Header, Image, Menu, Segment } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import UserDetailedHeader from './UserDetailedHeader';
import UserDetailedDescription from './UserDetailedDescription';
import UserDetailedPhotos from './UserDetailedPhotos';
import { firestoreConnect, isEmpty } from 'react-redux-firebase';
import { userDetailedQuery } from '../userQueries';
import UserDetailedSidebar from './UserDetailedSidebar';
import LoadingComponent from '../../../app/layout/LoadingComponent';

// console.log(query); // returns the array of photos

class UserDetailedPage extends Component {
  render() {
    const { profile, photos, auth, match, requesting } = this.props;
    const isCurrentUser = auth.uid === match.params.id; // boolean
    const loading = Object.values(requesting)
      // if any values in firestore/status/requesting is 'true'
      .some(a => a === true);
    if (loading) return <LoadingComponent />;

    return (
      <Grid>
        <UserDetailedHeader profile={profile} />
        <UserDetailedDescription profile={profile} />
        <UserDetailedSidebar isCurrentUser={isCurrentUser} />

        {photos && photos.length > 0 && <UserDetailedPhotos photos={photos} />}

        <Grid.Column width={12}>
          <Segment attached>
            <Header icon="calendar" content="Events" />
            <Menu secondary pointing>
              <Menu.Item name="All Events" active />
              <Menu.Item name="Past Events" />
              <Menu.Item name="Future Events" />
              <Menu.Item name="Events Hosted" />
            </Menu>

            <Card.Group itemsPerRow={5}>
              <Card>
                <Image src={'/assets/categoryImages/drinks.jpg'} />
                <Card.Content>
                  <Card.Header textAlign="center">Event Title</Card.Header>
                  <Card.Meta textAlign="center">
                    28th March 2018 at 10:00 PM
                  </Card.Meta>
                </Card.Content>
              </Card>

              <Card>
                <Image src={'/assets/categoryImages/drinks.jpg'} />
                <Card.Content>
                  <Card.Header textAlign="center">Event Title</Card.Header>
                  <Card.Meta textAlign="center">
                    28th March 2018 at 10:00 PM
                  </Card.Meta>
                </Card.Content>
              </Card>
            </Card.Group>
          </Segment>
        </Grid.Column>
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
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting // sort of loading...
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect((auth, userUid) => userDetailedQuery(auth, userUid))
)(UserDetailedPage);
