# Get Started

```bash
npm i redux-loadings
```

```javascript
// loadUser.js
import { load } from 'redux-loadings';
import { fetchUser } from './api'; // somewhere with axios
export default () => {
  load('user', fetchUser);
}
```

```jsx harmony
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { mapResultToProps } from 'redux-loadings';
import loadUser from './loadUser';

class ControlComponent extends PureComponent {
  componentDidMount() {
    loadUser();
  }

  render() {
    const { loading, user } = this.props;
    // return a component with loading, user
  }
}

const mapStateToProps = mapResultToProps('user');

export default connect(mapStateToProps)(ControlComponent);
```

or

```jsx harmony
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { mapResultToProps } from 'redux-loadings';
import { loadUser, loadFollower } from './load';

class ControlComponent extends PureComponent {
  componentDidMount() {
    loadUser();
    loadFollower();
  }

  render() {
    const { loading, user, follower } = this.props;
    // return a component with loading, user, follower
  }
}

const mapStateToProps = mapResultToProps(['user', 'follower']);

export default connect(mapStateToProps)(ControlComponent);
```
