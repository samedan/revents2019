import React from 'react';
import { Grid, Segment, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const UserDetailedSidebar = ({ isCurrentUser }) => {
  return (
    <Grid.Column width={4}>
      {isCurrentUser ? (
        <Segment>
          <Button
            as={Link}
            to="/settings"
            color="teal"
            fluid
            basic
            content="Edit Profile"
          />
        </Segment>
      ) : (
        <Segment>
          <Button color="teal" fluid basic content="Follow User" />
        </Segment>
      )}
    </Grid.Column>
  );
};

export default UserDetailedSidebar;
