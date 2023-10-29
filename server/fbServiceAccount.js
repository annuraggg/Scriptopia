const serviceAccount = {
  type: "service_account",
  project_id: process.env.FB_PROJECT_ID,
  private_key_id: process.env.FB_PRIVATE_KEY_ID,
  private_key:process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FB_CLIENT_EMAIL,
  client_id: "107828000792257898848",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FB_CLIENT_CERT_URL,
  universe_domain: "googleapis.com",
};

export default serviceAccount;
