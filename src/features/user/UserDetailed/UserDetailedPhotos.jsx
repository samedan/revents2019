import React, { Fragment } from 'react';
import { Grid, Segment, Header, Image } from 'semantic-ui-react';
import LazyLoad from 'react-lazyload';

const UserDetailedPhotos = ({ photos }) => {
  return (
    <Fragment>
      <Grid.Column width={12}>
        <Segment attached>
          <Header icon="image" content="Photos" />

          <Image.Group size="small">
            {photos.map(photo => (
              <LazyLoad
                key={photo.id}
                height={150}
                placeholder={<Image src="/assets/user.png" />}
                // offset={-150} pixels where the images are hidden
              >
                <Image src={photo.url} />
              </LazyLoad>
            ))}
          </Image.Group>
        </Segment>
      </Grid.Column>
    </Fragment>
  );
};

export default UserDetailedPhotos;
