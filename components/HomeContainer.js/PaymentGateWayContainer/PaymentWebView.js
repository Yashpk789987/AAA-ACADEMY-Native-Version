import React from 'react';
import { WebView, ToastAndroid, Alert } from 'react-native';
import { baseurl, endurl } from '../../../baseurl';
export default class PaymentWebView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      payment_updated_on_server: false
    };
  }

  onNavigationChange = webViewState => {
    let hitUrl = webViewState.url;
    if (hitUrl.includes('http://www.example.com/')) {
      let payment_final_id = hitUrl.split('payment_request_id=').pop();
      var response = {
        url: hitUrl,
        payment_final_id: payment_final_id
      };
      this.props.navigation.state.params.setTransactionFinalId(
        payment_final_id
      );
      this.props.navigation.goBack();
    }
  };

  static navigationOptions = {
    header: null
  };

  render() {
    let payment_request = this.props.navigation.getParam('payment_request');
    return (
      <WebView
        ref='webview'
        source={{ uri: payment_request.longurl }}
        onNavigationStateChange={this.onNavigationChange}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onMessage={event => console.log(event.nativeEvent.data)}
      />
    );
  }
}

// Response {
//     "_bodyInit": "{
//       \"success\": true,
//       \"payment_request\": {
//           \"id\": \"b40665a42be64280a4e06102dbc0b54b\",
//           \"phone\": \"+919630884259\",
//           \"email\": \"Yashpk789987@gmail.com\",
//           \"buyer_name\": \"yash kumar\",
//           \"amount\": \"10.00\",
//           \"purpose\": \"Online Test\",
//           \"expires_at\": null,
//           \"status\": \"Completed\",
//           \"send_sms\": false,
//           \"send_email\": false,
//           \"sms_status\": null,
//           \"email_status\": null,
//           \"shorturl\": \"https://imjo.in/epXc2D\",
//           \"longurl\": \"https://www.instamojo.com/@shshagrawal/b40665a42be64280a4e06102dbc0b54b\",
//           \"redirect_url\": \"http://www.example.com/redirect/\",
//           \"webhook\": \"http://www.example.com/webhook/\",
//           \"payments\": [
//               {
//                   \"payment_id\": \"MOJO9819G05D13607293\",
//                   \"status\": \"Credit\",
//                   \"currency\": \"INR\",
//                   \"amount\": \"10.00\",
//                   \"buyer_name\": \"yash kumar\",
//                   \"buyer_phone\": \"+919630884259\",
//                   \"buyer_email\": \"yashpk789987@gmail.com\",
//                   \"shipping_address\": null,
//                   \"shipping_city\": null,
//                   \"shipping_state\": null,
//                   \"shipping_zip\": null,
//                   \"shipping_country\": null,
//                   \"quantity\": 1,
//                   \"unit_price\": \"10.00\",
//                   \"fees\": \"3.20\",
//                   \"variants\": [],
//                   \"custom_fields\": {},
//                   \"affiliate_commission\": \"0\",
//                   \"payment_request\": \"https://www.instamojo.com/api/1.1/payment-requests/b40665a42be64280a4e06102dbc0b54b/\",
//                   \"instrument_type\": \"UPI\",
//                   \"billing_instrument\": \"UPI\",
//                   \"tax_invoice_id\": \"\",
//                   \"failure\": null,
//                   \"payout\": null,
//                   \"created_at\": \"2019-08-19T17:46:24.717984Z\"
//               }
//           ],
//           \"allow_repeated_payments\": true,
//           \"customer_id\": null,
//           \"created_at\": \"2019-08-19T17:46:06.546426Z\",
//           \"modified_at\": \"2019-08-19T17:47:07.865959Z\"
//       }
//   }
//   ",
//     "_bodyText": "{
//       \"success\": true,
//       \"payment_request\": {
//           \"id\": \"b40665a42be64280a4e06102dbc0b54b\",
//           \"phone\": \"+919630884259\",
//           \"email\": \"Yashpk789987@gmail.com\",
//           \"buyer_name\": \"yash kumar\",
//           \"amount\": \"10.00\",
//           \"purpose\": \"Online Test\",
//           \"expires_at\": null,
//           \"status\": \"Completed\",
//           \"send_sms\": false,
//           \"send_email\": false,
//           \"sms_status\": null,
//           \"email_status\": null,
//           \"shorturl\": \"https://imjo.in/epXc2D\",
//           \"longurl\": \"https://www.instamojo.com/@shshagrawal/b40665a42be64280a4e06102dbc0b54b\",
//           \"redirect_url\": \"http://www.example.com/redirect/\",
//           \"webhook\": \"http://www.example.com/webhook/\",
//           \"payments\": [
//               {
//                   \"payment_id\": \"MOJO9819G05D13607293\",
//                   \"status\": \"Credit\",
//                   \"currency\": \"INR\",
//                   \"amount\": \"10.00\",
//                   \"buyer_name\": \"yash kumar\",
//                   \"buyer_phone\": \"+919630884259\",
//                   \"buyer_email\": \"yashpk789987@gmail.com\",
//                   \"shipping_address\": null,
//                   \"shipping_city\": null,
//                   \"shipping_state\": null,
//                   \"shipping_zip\": null,
//                   \"shipping_country\": null,
//                   \"quantity\": 1,
//                   \"unit_price\": \"10.00\",
//                   \"fees\": \"3.20\",
//                   \"variants\": [],
//                   \"custom_fields\": {},
//                   \"affiliate_commission\": \"0\",
//                   \"payment_request\": \"https://www.instamojo.com/api/1.1/payment-requests/b40665a42be64280a4e06102dbc0b54b/\",
//                   \"instrument_type\": \"UPI\",
//                   \"billing_instrument\": \"UPI\",
//                   \"tax_invoice_id\": \"\",
//                   \"failure\": null,
//                   \"payout\": null,
//                   \"created_at\": \"2019-08-19T17:46:24.717984Z\"
//               }
//           ],
//           \"allow_repeated_payments\": true,
//           \"customer_id\": null,
//           \"created_at\": \"2019-08-19T17:46:06.546426Z\",
//           \"modified_at\": \"2019-08-19T17:47:07.865959Z\"
//       }
//   }
//   ",
//     "headers": Headers {
//       "map": Object {
//         "allow": "GET, POST, HEAD, OPTIONS",
//         "cache-control": "public, max-age=0",
//         "cf-ray": "508df39dcfbadc89-MAA",
//         "content-type": "application/json; charset=utf-8",
//         "date": "Mon, 19 Aug 2019 17:47:15 GMT",
//         "expect-ct": "max-age=604800, report-uri=\"https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct\"",
//         "p3p": "CP=\"Instamojo does not have a P3P policy\"",
//         "server": "cloudflare",
//         "set-cookie": "csrftoken=3tp7AHTxvp9Xydw36Poy7A53Asr1I7wrUHsfRPHIGvfWl73SEsGvAplaW5jVZsfh; expires=Mon, 17-Aug-2020 17:47:15 GMT; Max-Age=31449600; Path=/; Secure",
//         "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
//         "vary": "Cookie",
//         "x-content-type-options": "nosniff",
//         "x-frame-options": "SAMEORIGIN",
//         "x-xss-protection": "1; mode=block",
//       },
//     },
//     "ok": true,
//     "status": 200,
//     "statusText": undefined,
//     "type": "default",
//     "url": "https://www.instamojo.com/api/1.1/payment-requests/b40665a42be64280a4e06102dbc0b54b/",
//   }
//   Response {
//     "_bodyInit": "{
//       \"success\": true,
//       \"payment_request\": {
//           \"id\": \"b40665a42be64280a4e06102dbc0b54b\",
//           \"phone\": \"+919630884259\",
//           \"email\": \"Yashpk789987@gmail.com\",
//           \"buyer_name\": \"yash kumar\",
//           \"amount\": \"10.00\",
//           \"purpose\": \"Online Test\",
//           \"expires_at\": null,
//           \"status\": \"Completed\",
//           \"send_sms\": false,
//           \"send_email\": false,
//           \"sms_status\": null,
//           \"email_status\": null,
//           \"shorturl\": \"https://imjo.in/epXc2D\",
//           \"longurl\": \"https://www.instamojo.com/@shshagrawal/b40665a42be64280a4e06102dbc0b54b\",
//           \"redirect_url\": \"http://www.example.com/redirect/\",
//           \"webhook\": \"http://www.example.com/webhook/\",
//           \"payments\": [
//               {
//                   \"payment_id\": \"MOJO9819G05D13607293\",
//                   \"status\": \"Credit\",
//                   \"currency\": \"INR\",
//                   \"amount\": \"10.00\",
//                   \"buyer_name\": \"yash kumar\",
//                   \"buyer_phone\": \"+919630884259\",
//                   \"buyer_email\": \"yashpk789987@gmail.com\",
//                   \"shipping_address\": null,
//                   \"shipping_city\": null,
//                   \"shipping_state\": null,
//                   \"shipping_zip\": null,
//                   \"shipping_country\": null,
//                   \"quantity\": 1,
//                   \"unit_price\": \"10.00\",
//                   \"fees\": \"3.20\",
//                   \"variants\": [],
//                   \"custom_fields\": {},
//                   \"affiliate_commission\": \"0\",
//                   \"payment_request\": \"https://www.instamojo.com/api/1.1/payment-requests/b40665a42be64280a4e06102dbc0b54b/\",
//                   \"instrument_type\": \"UPI\",
//                   \"billing_instrument\": \"UPI\",
//                   \"tax_invoice_id\": \"\",
//                   \"failure\": null,
//                   \"payout\": null,
//                   \"created_at\": \"2019-08-19T17:46:24.717984Z\"
//               }
//           ],
//           \"allow_repeated_payments\": true,
//           \"customer_id\": null,
//           \"created_at\": \"2019-08-19T17:46:06.546426Z\",
//           \"modified_at\": \"2019-08-19T17:47:07.865959Z\"
//       }
//   }
//   ",
//     "_bodyText": "{
//       \"success\": true,
//       \"payment_request\": {
//           \"id\": \"b40665a42be64280a4e06102dbc0b54b\",
//           \"phone\": \"+919630884259\",
//           \"email\": \"Yashpk789987@gmail.com\",
//           \"buyer_name\": \"yash kumar\",
//           \"amount\": \"10.00\",
//           \"purpose\": \"Online Test\",
//           \"expires_at\": null,
//           \"status\": \"Completed\",
//           \"send_sms\": false,
//           \"send_email\": false,
//           \"sms_status\": null,
//           \"email_status\": null,
//           \"shorturl\": \"https://imjo.in/epXc2D\",
//           \"longurl\": \"https://www.instamojo.com/@shshagrawal/b40665a42be64280a4e06102dbc0b54b\",
//           \"redirect_url\": \"http://www.example.com/redirect/\",
//           \"webhook\": \"http://www.example.com/webhook/\",
//           \"payments\": [
//               {
//                   \"payment_id\": \"MOJO9819G05D13607293\",
//                   \"status\": \"Credit\",
//                   \"currency\": \"INR\",
//                   \"amount\": \"10.00\",
//                   \"buyer_name\": \"yash kumar\",
//                   \"buyer_phone\": \"+919630884259\",
//                   \"buyer_email\": \"yashpk789987@gmail.com\",
//                   \"shipping_address\": null,
//                   \"shipping_city\": null,
//                   \"shipping_state\": null,
//                   \"shipping_zip\": null,
//                   \"shipping_country\": null,
//                   \"quantity\": 1,
//                   \"unit_price\": \"10.00\",
//                   \"fees\": \"3.20\",
//                   \"variants\": [],
//                   \"custom_fields\": {},
//                   \"affiliate_commission\": \"0\",
//                   \"payment_request\": \"https://www.instamojo.com/api/1.1/payment-requests/b40665a42be64280a4e06102dbc0b54b/\",
//                   \"instrument_type\": \"UPI\",
//                   \"billing_instrument\": \"UPI\",
//                   \"tax_invoice_id\": \"\",
//                   \"failure\": null,
//                   \"payout\": null,
//                   \"created_at\": \"2019-08-19T17:46:24.717984Z\"
//               }
//           ],
//           \"allow_repeated_payments\": true,
//           \"customer_id\": null,
//           \"created_at\": \"2019-08-19T17:46:06.546426Z\",
//           \"modified_at\": \"2019-08-19T17:47:07.865959Z\"
//       }
//   }
//   ",
//     "headers": Headers {
//       "map": Object {
//         "allow": "GET, POST, HEAD, OPTIONS",
//         "cache-control": "public, max-age=0",
//         "cf-ray": "508df39faaecdc89-MAA",
//         "content-type": "application/json; charset=utf-8",
//         "date": "Mon, 19 Aug 2019 17:47:16 GMT",
//         "expect-ct": "max-age=604800, report-uri=\"https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct\"",
//         "p3p": "CP=\"Instamojo does not have a P3P policy\"",
//         "server": "cloudflare",
//         "set-cookie": "csrftoken=mR6TxEenXzxJF0foIlnKo8UdBhpIgPok21kDjaociwyA7np3cnyedNKjmhDaqVzx; expires=Mon, 17-Aug-2020 17:47:15 GMT; Max-Age=31449600; Path=/; Secure",
//         "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
//         "vary": "Cookie",
//         "x-content-type-options": "nosniff",
//         "x-frame-options": "SAMEORIGIN",
//         "x-xss-protection": "1; mode=block",
//       },
//     },
//     "ok": true,
//     "status": 200,
//     "statusText": undefined,
//     "type": "default",
//     "url": "https://www.instamojo.com/api/1.1/payment-requests/b40665a42be64280a4e06102dbc0b54b/",
//   }
