const axios = require("axios");

async function getCsrfToken() {
  const BASE_URL = "http://127.0.0.1:8002";
  try {
    const response = await axios.get(
      `${BASE_URL}/api/method/frappe.core.doctype.csrf_token.csrf_token.generate`
    );
    const csrfToken = response.data.csrf_token;
    return csrfToken;
  } catch (error) {
    console.error("Error retrieving CSRF token:", error);
    return null;
  }
}

export default getCsrfToken;
