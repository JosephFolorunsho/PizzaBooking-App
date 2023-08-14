import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise((_, reject) => {
    setTimeout(function () {
      reject(new Error(`Request took too long, Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchPro = await fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};

// .........REFACTORING THE GET AND SEND JSON FUNCTIONS................
/*export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : await fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};
*/
