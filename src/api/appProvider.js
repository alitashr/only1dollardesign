import HttpClient from './httpClient';
export const domain = 'https://explorug.com/v2';
let provider = 'appprovider.aspx';
const API_KEY = 'apikey';

const postHttpClient = (data, config) => HttpClient.post(`${domain}/${provider}`, data, config).then((response) => response.data);

const postWithRetry = (data) => {
  return new Promise((resolve, reject) => {
    let numtries = 0;
    const fetchData = () => {
      postHttpClient(data)
        .then(resolve)
        .catch((err) => {
          numtries++;
          if (numtries <= 5) fetchData();
          else reject(err);
        });
    };
    fetchData();
  });
};

const getApiKey = () => sessionStorage.getItem(API_KEY);

const fetchApiKey = ({username, password}) => {
  let data = new FormData();
  data.append('action', 'login');
  data.append('username', username);
  data.append('password', password);
  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        const key = res;
        if (!key || key === '') reject('INVALID CREDENTIALS');
        else {
          sessionStorage.setItem(API_KEY, key);
          sessionStorage.setItem('relogin', false);
          sessionStorage.setItem('page', username);
          resolve(key);
        }
      })
      .catch(reject);
  });
};

const fetchDesignList = (params) => {
  let data = new FormData();
  data.append('action', 'designlist');
  data.append('key', getApiKey());
  console.log(getApiKey());
  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        const data = res;
        if (data === '') reject('designlist is blank');
        else {
          resolve(data);
        }
      })
      .catch(reject);
  });
};
const fetchDesignThumbNails = ({designsFullPathlist, backColor = '#ffffff'}) => {
  let data = new FormData();
  data.append('action', 'designthumbs');
  data.append('key', getApiKey());
  data.append('files', JSON.stringify(designsFullPathlist));
  data.append('backcolor', backColor);

  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        const data = res;
        if (data === '') reject('designthumbs is blank');
        else {
          resolve(data);
        }
      })
      .catch(reject);
  });
};

const fetchDesignDetails = ({selectedDesign, backColor = "#ffffff"}) => {
  let data = new FormData();
  data.append('action', 'designdetails');
  data.append('key', getApiKey());
  data.append('file', selectedDesign);
  data.append('backcolor', backColor);

  return new Promise((resolve, reject) => {
    postWithRetry(data)
      .then((res) => {
        let designdetails = res;
        if (designdetails === '') reject('designthumbs is blank');
        else {
          resolve(designdetails);
        }
      })
      .catch(reject);
  });
};

const AppNewProvider = {
  fetchApiKey,
  fetchDesignList,
  fetchDesignThumbNails,
  fetchDesignDetails
};
export default AppNewProvider;
