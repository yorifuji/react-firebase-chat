import React from 'react';
import Message from './Message';

const Timeline = (props) => {
  const timeline = props.timeline
  const components = timeline.map((message,index) =>
    <Message message={message} key={index} />
  )

  return (
    <div>
      {components}
    </div>
  )
}

export default Timeline;
