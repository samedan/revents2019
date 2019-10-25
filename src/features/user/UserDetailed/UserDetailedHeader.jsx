import React from 'react';
import { Grid, Segment, Item, Header } from 'semantic-ui-react';
import { differenceInYears } from 'date-fns/esm';
import LazyLoad from 'react-lazyload';

const UserDetailedHeader = ({ profile }) => {
  let age;
  if (profile.dateOfBirth) {
    // console.log(profile.dateOfBirth.toDate());
    // console.log(Date.now());
    age = differenceInYears(Date.now(), profile.dateOfBirth.toDate());
  } else {
    age = 'unknown age';
  }
  return (
    <Grid.Column width={16}>
      <Segment>
        <Item.Group>
          <Item>
            <LazyLoad
              height={150}
              placeholder={<Item.Image size="small" src="/assets/user.png" />}
              // offset={-150} pixels where the images are hidden
            >
              <Item.Image
                avatar
                size="small"
                src={profile.photoURL || '/assets/user.png'}
              />
            </LazyLoad>
            <Item.Content verticalAlign="bottom">
              <Header as="h1">{profile.displayName}</Header>
              <br />
              <Header as="h3">{profile.occupation}</Header>
              <br />
              <Header as="h3">
                {age}, Lives in {profile.city || 'unknown city'}
              </Header>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedHeader;
