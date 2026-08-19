// const axios = require("axios");
// const config = require("../config/zoho.config");

// let accessToken = null;
// let tokenExpiresAt = 0; // epoch ms
// let refreshPromise = null; // in-flight refresh call ni share cheyadam kosam

// async function fetchNewToken() {
//   const response = await axios.post(
//     `${config.ACCOUNTS_URL}/oauth/v2/token`,
//     null,
//     {
//       params: {
//         grant_type: "refresh_token",
//         refresh_token: config.REFRESH_TOKEN,
//         client_id: config.CLIENT_ID,
//         client_secret: config.CLIENT_SECRET,
//       },
//     },
//   );

//   accessToken = response.data.access_token;

//   const expiresInSeconds = response.data.expires_in || 3600;
//   tokenExpiresAt = Date.now() + (expiresInSeconds - 300) * 1000; // 5 min safety buffer

//   return accessToken;
// }

// exports.getAccessToken = async () => {
//   const now = Date.now();

//   // Cached, valid token unte direct ga return
//   if (accessToken && now < tokenExpiresAt) {
//     return accessToken;
//   }

//   // Already evar? refresh chestunte (in-flight), ade promise ni share chesuko  
//   // idi valla parallel requests anni okate Zoho call ni wait chestayi, veru veru calls cheyavu
//   if (!refreshPromise) {
//     refreshPromise = fetchNewToken().finally(() => {
//       refreshPromise = null;
//     });
//   }

//   return refreshPromise;
// };




const axios = require("axios");
const config = require("../config/zoho.config");

let accessToken = null;
let tokenExpiresAt = 0;
let refreshPromise = null;

async function fetchNewToken() {
  console.log("=== ZOHO TOKEN REQUEST ===");

  console.log({
    accountsUrl: config.ACCOUNTS_URL,
    hasRefreshToken: !!config.REFRESH_TOKEN,
    hasClientId: !!config.CLIENT_ID,
    hasClientSecret: !!config.CLIENT_SECRET,
  });

  try {
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
      }
    );

    console.log("=== ZOHO TOKEN RESPONSE ===");

    console.log({
      hasAccessToken: !!response.data.access_token,
      expiresIn: response.data.expires_in,
      keys: Object.keys(response.data),
    });

    if (!response.data.access_token) {
      throw new Error(
        `Zoho access token missing: ${JSON.stringify(response.data)}`
      );
    }

    accessToken = response.data.access_token;

    const expiresInSeconds = response.data.expires_in || 3600;

    tokenExpiresAt =
      Date.now() + Math.max(expiresInSeconds - 300, 60) * 1000;

    return accessToken;
  } catch (error) {
    console.error("=== ZOHO TOKEN ERROR ===");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);

    throw error;
  }
}

exports.getAccessToken = async () => {
  const now = Date.now();

  // Existing valid token
  if (accessToken && now < tokenExpiresAt) {
    console.log("Using cached Zoho access token");
    return accessToken;
  }

  // Refresh already in progress
  if (!refreshPromise) {
    console.log("Fetching new Zoho access token...");

    refreshPromise = fetchNewToken().finally(() => {
      refreshPromise = null;
    });
  } else {
    console.log("Waiting for existing Zoho token request...");
  }

  return refreshPromise;
};