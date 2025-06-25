import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Auth0ProviderApp } from "./auth/Auth0ProviderApp.tsx";
import { BrowserRouter } from "react-router";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* provider de auth0 */}
      <Auth0ProviderApp>
        {/* esta es mi app */}
        <App />
      </Auth0ProviderApp>
    </BrowserRouter>
  </React.StrictMode>,
)
