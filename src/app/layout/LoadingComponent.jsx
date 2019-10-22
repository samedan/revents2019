// rafc

import React from 'react';
import { Dimmer, Loader, Image } from 'semantic-ui-react';

const LoadingComponent = ({ inverted = true }) => {
  return (
    <Dimmer inverted={inverted} active={true} style={{ padding: '50px' }}>
      <Loader content="Loading..." />
      {/* <Image src="/assets/short-paragraph.png" class="ui image" /> */}
    </Dimmer>
  );
};

export default LoadingComponent;
