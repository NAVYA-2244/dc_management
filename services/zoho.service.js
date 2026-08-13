const axios = require("axios");

const config = require("../config/zoho.config");
const db = require("../models"); 


const { getAccessToken } = require("./token.service");

exports.getOrganizations = async () => {
  const token = await getAccessToken();

  const response = await axios.get(
    `${config.API_URL}/books/v3/organizations`,

    {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    },
  );

  return response.data;
};


exports.getContacts = async () => {
  const token = await getAccessToken();

  const response = await axios.get(`${config.API_URL}/books/v3/contacts`, {
    params: {
      organization_id: config.ORGANIZATION_ID,
      page: 1,
      per_page: 10,
    },
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  });

  return response.data.contacts;
};



exports.getAllDeliveryChallans = async (page, limit,search) => {

  const token = await getAccessToken();

  const all = [];

  if (page && limit) {

    const response = await axios.get(
      `${config.API_URL}/books/v3/deliverychallans`,
      {
        params: {
          organization_id: config.ORGANIZATION_ID,
          page,
          per_page: limit,
          search_text: search || undefined
        },
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      }
    );

    return response.data.deliverychallans || [];
  }

  // page/limit ivvakapothe anni fetch cheyyi
  let currentPage = 1;
  let more = true;

  while (more) {

    const response = await axios.get(
      `${config.API_URL}/books/v3/deliverychallans`,
      {
        params: {
          organization_id: config.ORGANIZATION_ID,
          page: currentPage,
          per_page: 200,
        },
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      }
    );

    all.push(...(response.data.deliverychallans || []));

    more = response.data.page_context?.has_more_page || false;
    currentPage++;
  }

  return all;
};


exports.getContactById = async (contactId) => {
  const token = await getAccessToken();

  const response = await axios.get(
    `${config.API_URL}/books/v3/contacts/${contactId}`,
    {
      params: {
        organization_id: config.ORGANIZATION_ID,
      },
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    },
  );

  return response.data;
};

exports.getDeliveryChallans = async (customerId = null) => {
  const token = await getAccessToken();

  let page = 1;
  let more = true;
  let all = [];

  while (more) {
    const response = await axios.get(
      `${config.API_URL}/books/v3/deliverychallans`,
      {
        params: {
          organization_id: config.ORGANIZATION_ID,
          customer_id: customerId || undefined,
          page,
          per_page: 200,
        },
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
        },
      },
    );

    all.push(...response.data.deliverychallans);

    more = response.data.page_context?.has_more_page || false;
    page++;
  }

  return all;
};

exports.getDeliveryChallanById = async (id) => {
  const token = await getAccessToken();

  const response = await axios.get(
    `${config.API_URL}/books/v3/deliverychallans/${id}`,
    {
      params: {
        organization_id: config.ORGANIZATION_ID,
      },
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
      },
    },
  );

  return response.data;
};
