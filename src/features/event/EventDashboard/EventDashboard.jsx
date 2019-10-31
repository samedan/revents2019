import React, { Component, createRef } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import { connect } from 'react-redux';
import { getEventsForDashboard } from '../eventActions';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import EventActivity from '../EventActivity/EventActivity';
import { firestoreConnect } from 'react-redux-firebase';

const query = [
  { collection: 'activity', orderBy: ['timestamp', 'desc'], limit: 5 }
];

class EventDashboard extends Component {
  // gets he element (DOM) that it refers to
  contextRef = createRef();

  state = {
    moreEvents: false,
    loadingInitial: true,
    loadedEvents: []
  };

  async componentDidMount() {
    let next = await this.props.getEventsForDashboard();

    if (next && next.docs && next.docs.length > 1) {
      this.setState({
        moreEvents: true,
        loadingInitial: false
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.events !== prevProps.events) {
      this.setState({
        loadedEvents: [...this.state.loadedEvents, ...this.props.events]
      });
    }
  }

  // if there are 2 more events to come, load next 2 events
  getNextEvents = async () => {
    const { events } = this.props;
    let lastEvent = events && events[events.length - 1];

    let next = await this.props.getEventsForDashboard(lastEvent);

    if (next && next.docs && next.docs.length <= 1) {
      this.setState({
        moreEvents: false
      });
    }
  };

  render() {
    const { loading, activities } = this.props;
    const { moreEvents, loadedEvents } = this.state;

    if (this.state.loadingInitial)
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
          <div ref={this.contextRef}>
            <EventList
              loading={loading}
              events={loadedEvents}
              moreEvents={moreEvents}
              getNextEvents={this.getNextEvents}
            />
          </div>

          {/* <Button
            loading={loading}
            content="More"
            color="green"
            floated="right"
            onClick={this.getNextEvents}
            disabled={!this.state.moreEvents}
          /> */}
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity activities={activities} contextRef={this.contextRef} />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loading} />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  events: state.events.events,
  loading: state.async.loading,
  activities: state.firestore.ordered.activity
});

const mapDispatchToProps = {
  getEventsForDashboard
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(firestoreConnect(query)(EventDashboard));
