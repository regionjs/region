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
import { connect } from 'redux-loadings';
import loadUser from './loadUser';

loadUser();

class ControlComponent extends PureComponent {
  render() {
    const { loading, user } = this.props;
    // return a component with loading, user
  }
}

export default connect('user')(ControlComponent);
```

or

```jsx harmony
import React, { PureComponent } from 'react';
import { connect } from 'redux-loadings';
import { loadUser, loadFollower } from './load';

loadUser();
loadFollower();

class ControlComponent extends PureComponent {
  render() {
    const { loading, user, follower } = this.props;
    // return a component with loading, user, follower
  }
}

export default connect(['user', 'follower'])(ControlComponent);
```
