const jwt = require('jsonwebtoken');
const axios = require('axios');

const sendSMS = async (phone, fullname, otp) => {
  const apiKeySid = process.env.API_SID_KEY;
  const apiSecret = process.env.API_SECRET_KEY;
  
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600;

  const header = {
    "typ": "JWT",
    "alg": "HS256",
    "cty": "stringee-api;v=1"
  }
  const payload = {
    jti: apiKeySid + "-" + now,
    iss: apiKeySid,
    exp: exp,
    rest_api: true
  };

  const token = jwt.sign(payload, apiSecret, { algorithm: 'HS256', header: header })

  // console.log("Token:", token);
  try {
    const response = await axios.post('https://api.stringee.com/v1/sms', {
      "sms": [
        {
          from: 'Stringee',
          to: phone,
          text: `Hello ${fullname}. Your OTP is ${otp}. Do not share with anyone!`,
        }
      ]
    }, {
      headers: {
        'X-STRINGEE-AUTH': token,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('SMS sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error.response.data);
    throw new Error('Failed to send SMS');
  }
};

module.exports = sendSMS;