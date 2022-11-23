// This sample assumes that the application is using a CKEditor 5 editor built from source.
import React from 'react';
// @ts-ignore
import { CKEditor } from '@ckeditor/ckeditor5-react';
// @ts-ignore
import ClassicEditor from './custom';

const App = () => {
    return (
        <div className="App">
            <h2>Using the CKeditor 5 context feature in React</h2>
            <CKEditor
                editor={ClassicEditor}
                data="<p>Hello from the first editor working with the context!</p>"
                onReady={(editor: any) => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor1 is ready to use!', editor);
                }}
            />
        </div>
    );
};

export default App;
