import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';

import {Provider} from "react-redux";
import { createStore } from 'redux';
import rootReducers from './reducers';

const store = createStore(rootReducers);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('.container'));