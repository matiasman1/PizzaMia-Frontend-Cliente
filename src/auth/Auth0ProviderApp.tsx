import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { FC } from "react";
import { useNavigate } from "react-router";

const VITE_AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const VITE_AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const VITE_AUTH0_CALLBACK_URL = import.meta.env.VITE_AUTH0_CALLBACK_URL;
const VITE_AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

type Props = {
  children: JSX.Element;
};

export const Auth0ProviderApp: FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState: AppState | undefined) => {
    navigate(appState?.returnTo || "/");
  };

  if (!(VITE_AUTH0_DOMAIN && VITE_AUTH0_CLIENT_ID && VITE_AUTH0_CALLBACK_URL)) {
    return null;
  }
  return (
    <Auth0Provider
      domain={VITE_AUTH0_DOMAIN}
      clientId={VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        audience: VITE_AUTH0_AUDIENCE,
        redirect_uri: VITE_AUTH0_CALLBACK_URL,
      }}
      onRedirectCallback={onRedirectCallback} //me redigire al principio de la app
    >
      {/* esta seria la app */}
      {children} 
    </Auth0Provider>
  );
};
