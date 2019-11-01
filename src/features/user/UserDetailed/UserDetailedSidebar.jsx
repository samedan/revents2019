import React from 'react';
import { Grid, Segment, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const UserDetailedSidebar = ({
  isCurrentUser,
  followUser,
  profile,
  isFollowing,
  unfollowUser
}) => {
  return (
    <Grid.Column width={4}>
      {isCurrentUser && (
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
      )}
      {!isCurrentUser && !isFollowing && (
        <Segment>
          <Button
            onClick={() => followUser(profile)}
            color="teal"
            fluid
            basic
            content="Follow User"
          />
        </Segment>
      )}
      {!isCurrentUser && isFollowing && (
        <Segment>
          <Button
            onClick={() => unfollowUser(profile)}
            color="teal"
            fluid
            basic
            content="Unfollow"
          />
        </Segment>
      )}
    </Grid.Column>
  );
};

export default UserDetailedSidebar;
