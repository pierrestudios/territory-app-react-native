import {
  REACT_APP_GOOGLE_API_KEY,
  REACT_APP_PROXY_PORT,
  REACT_APP_PROXY_URL,
  REACT_APP_API_VERSION,
} from "react-native-dotenv";

export default {
  apiKey: REACT_APP_GOOGLE_API_KEY,
  apiVersion: REACT_APP_API_VERSION,
  serverUrl: `${REACT_APP_PROXY_URL}:${REACT_APP_PROXY_PORT}`,
};
