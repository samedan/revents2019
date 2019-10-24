import React, { Fragment } from 'react';
import { Grid, Segment, Button, Header, Image } from 'semantic-ui-react';
import UserDetailedSidebar from './UserDetailedSidebar';

const UserDetailedPhotos = ({ photos }) => {
  return (
    <Fragment>
      <UserDetailedSidebar />

      <Grid.Column width={12}>
        <Segment attached>
          <Header icon="image" content="Photos" />

          <Image.Group size="small">
            {photos.map(photo => (
              <Image key={photo.id} src={photo.url} />
            ))}
          </Image.Group>
        </Segment>
      </Grid.Column>
    </Fragment>
  );
};

export default UserDetailedPhotos;
