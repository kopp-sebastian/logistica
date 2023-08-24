import React from 'react'
import ReactDOM from 'react-dom/client'
import {NodesProvider} from "./providers/NodesContext.tsx";
import {EdgesProvider} from "./providers/EdgesContext.tsx";
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <NodesProvider>
            <EdgesProvider>
                <App/>
            </EdgesProvider>
        </NodesProvider>
    </React.StrictMode>,
)
