import React from 'react';
import { connect } from 'react-redux';
import queryStirng from 'query-string';
import { TEST_DECREMENT, TEST_INCREMENT } from 'javascript/redux/action';
import ReduxTest from 'javascript/component/test/ReduxTest';

function TestPage(props) {
  const counter = props.counter;
  const increment = props.increment;
  const decrement = props.decrement;
  const location = props.location;

  const query = queryStirng.parse(location.search);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '1010px',
      margin: '32px'
    }}>
      <div className="Panel focus">
        TEST
      </div>
      <ReduxTest count={counter.count} onDecrement={() => decrement()} onIncrement={() => increment()} />
      <div className="Panel">
        query string : {location.search}, query object : {JSON.stringify(query)}
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  counter: state.test
});

const mapDispatchToProps = dispatch => ({
  increment: () => dispatch({type: TEST_INCREMENT}),
  decrement: () => dispatch({type: TEST_DECREMENT})
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestPage);
