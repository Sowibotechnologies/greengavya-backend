const {google} = require('googleapis');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly';
require('dotenv/config');
const key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');
const jwt = new google.auth.JWT(process.env.CLIENT_EMAIL, null, key, scopes);
const view_id = "197917698";

module.exports = {
    getDataByBrowser: async function()  {
        const response = await jwt.authorize()
        const result = await google.analytics('v3').data.ga.get({
          'auth': jwt,
          'ids': 'ga:' + view_id,
          'start-date': '30daysAgo',
          'end-date': 'today',
          'metrics': 'ga:users,ga:pageviews,ga:entranceRate,ga:exitRate',
          'dimensions': 'ga:browser'
        })
        return result;
    },
    getDataByPath: async function()  {
        const response = await jwt.authorize()
        const result = await google.analytics('v3').data.ga.get({
          'auth': jwt,
          'ids': 'ga:' + view_id,
          'start-date': '30daysAgo',
          'end-date': 'today',
          'metrics': 'ga:users,ga:pageviews,ga:timeOnPage,ga:avgTimeOnPage,ga:entranceRate,ga:exitRate',
          'dimensions': 'ga:pagePath'
        })
        return result;
    },
    getDataBySource: async function()  {
        const response = await jwt.authorize()
        const result = await google.analytics('v3').data.ga.get({
          'auth': jwt,
          'ids': 'ga:' + view_id,
          'start-date': '30daysAgo',
          'end-date': 'today',
          'metrics': 'ga:users,ga:pageviews,ga:timeOnPage,ga:avgTimeOnPage',
          'dimensions': 'ga:source'
        })
        return result;
    },
    getDataByCity: async function()  {
        const response = await jwt.authorize()
        const result = await google.analytics('v3').data.ga.get({
          'auth': jwt,
          'ids': 'ga:' + view_id,
          'start-date': '30daysAgo',
          'end-date': 'today',
          'metrics': 'ga:users,ga:pageviews,ga:timeOnPage,ga:avgTimeOnPage,ga:entranceRate,ga:exitRate',
          'dimensions': 'ga:city'
        })
        return result;
    }
}
