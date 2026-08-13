const axios = require("axios");
const config = require("../config/zoho.config");

let accessToken = null;
let tokenExpiresAt = 0; // epoch ms
let refreshPromise = null; // in-flight refresh call ni share cheyadam kosam

async function fetchNewToken() {
  const response = await axios.post(
    `${config.ACCOUNTS_URL}/oauth/v2/token`,
    null,
    {
      params: {
        grant_type: "refresh_token",
        refresh_token: config.REFRESH_TOKEN,
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
      },
    },
  );

  accessToken = response.data.access_token;

  const expiresInSeconds = response.data.expires_in || 3600;
  tokenExpiresAt = Date.now() + (expiresInSeconds - 300) * 1000; // 5 min safety buffer

  return accessToken;
}

exports.getAccessToken = async () => {
  const now = Date.now();

  // Cached, valid token unte direct ga return
  if (accessToken && now < tokenExpiresAt) {
    return accessToken;
  }

  // Already evar? refresh chestunte (in-flight), ade promise ni share chesuko —
  // idi valla parallel requests anni okate Zoho call ni wait chestayi, veru veru calls cheyavu
  if (!refreshPromise) {
    refreshPromise = fetchNewToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};