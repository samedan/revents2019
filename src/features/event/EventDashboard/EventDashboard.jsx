import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import { connect } from 'react-redux';
import { createEvent, deleteEvent, updateEvent } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';

class EventDashboard extends Component {
  handleDeleteEvent = id => {
    this.props.deleteEvent(id);
  };

  render() {
    const { events, loading } = this.props;
    if (loading)
      return (
        <Grid>
          <Grid.Column width={10}>
            <LoadingComponent />
          </Grid.Column>
          <Grid.Column width={6}>
            <h2>Activity Feed</h2>
          </Grid.Column>
        </Grid>
      );
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList deleteEvent={this.handleDeleteEvent} events={events} />
        </Grid.Column>
        <Grid.Column width={6}>
          <h2>Activity Feed</h2>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events,
  loading: state.async.loading
});

const mapDispatchToProps = {
  createEvent,
  updateEvent,
  deleteEvent
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventDashboard);
