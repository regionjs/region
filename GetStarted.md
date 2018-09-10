# Get Started

```bash
npm i redux-loadings
```

create a file named `load.js`

```javascript
import { load } from 'redux-loadings';
import { fetchUser } from './api'; // somewhere with axios
export const loadUser = (params) => {
  load('user', fetchUser, { params });
}
```

Then create your Component

```jsx harmony
import React, { PureComponent } from 'react';
import { connect } from 'redux-loadings';
import { loadUser } from './load';

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
