export default {
  Env:
      process.env.NEXT_PUBLIC_ENVIRON === 'PROD'
          ? 'https://affiliatemanager-378714.as.r.appspot.com'
          : process.env.NEXT_PUBLIC_ENVIRON === 'STAGING'
              ? 'https://affiliatemanagerstaging.as.r.appspot.com'
              : 'http://127.0.0.1:8888',
};