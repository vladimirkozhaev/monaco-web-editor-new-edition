import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Editor } from './components/Editor/Editor';


import { setupLanguage } from './language-service/setup';
import { languageID } from './language-service/config';

setupLanguage();
const App = () => <Editor language={languageID}></Editor>;

ReactDOM.render(<App />, document.getElementById('container'));