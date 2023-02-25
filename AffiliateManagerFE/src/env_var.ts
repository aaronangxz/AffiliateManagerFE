export default {
  Env:
    import.meta.env.VITE_ENV === 'PROD'
      ? 'https://affiliatemanager-378714.as.r.appspot.com'
      : import.meta.env.VITE_ENV === 'STAGING'
      ? 'https://affiliatemanagerstaging.as.r.appspot.com'
      : 'http://127.0.0.1:8888',
};
