// rafc
import React, { Fragment } from 'react';
import { Header, Segment } from 'semantic-ui-react';

const EventActivity = () => {
  return (
    <Fragment>
      <Header attached="top" content="Recent Activity" />
      <Segment attached>
        <p>Receent activity</p>
      </Segment>
    </Fragment>
  );
};

export default EventActivity;
