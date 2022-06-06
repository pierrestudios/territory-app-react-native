import {
  REACT_APP_GOOGLE_API_KEY,
  REACT_APP_PROXY_PORT,
} from "react-native-dotenv";

export default {
  apiKey: REACT_APP_GOOGLE_API_KEY,
  serverUrl: `http://localhost:${REACT_APP_PROXY_PORT}`,
};
