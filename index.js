const FormData = require('form-data');
const axios = require('axios');
const cheerio = require('cheerio');
const querystring = require('querystring');
const urlQuery = require('url');
const url = 'https://www.net.city.nagoya.jp/cgi-bin/sp04001';

const searchParams = new urlQuery.URLSearchParams({
    syumoku: '023',
    month: '12',
    day: '04',
    joken: '2',
    kyoyo1: '07',
    kyoyo2: '07',
    chiiki: '20',

    vlinefield: '40968',
    tran_div: ' ',
    system1: '0',
    system2: '0',

    mae_riymd: ' ',
    mae_cnt: '0',
    mae_shcd: ' ',
    mae_kyocd: ' ',

    page: '0',
    flg: '0',

    syumokunm: 'バスケットボール',
    kyoyo1nm: '全供用',
    kyoyo2nm: '全供用',
    chiikinm: '全地域',
    button: '照会'
});

const paramsUrl = new URLSearchParams();
paramsUrl.append('syumoku', '023');
paramsUrl.append('month', '12');
paramsUrl.append('day', '04');
paramsUrl.append('joken', '2');
paramsUrl.append('kyoyo1', '07');
paramsUrl.append('kyoyo2', '07');
paramsUrl.append('chiiki', '20');

paramsUrl.append('vlinefield', '40968');
paramsUrl.append('tran_div', ' ');
paramsUrl.append('system1', '0');
paramsUrl.append('system2', '0');

paramsUrl.append('mae_riymd', ' ');
paramsUrl.append('mae_cnt', '0');
paramsUrl.append('mae_shcd', ' ');
paramsUrl.append('mae_kyocd', ' ');

paramsUrl.append('page', '0');
paramsUrl.append('flg', '0');

paramsUrl.append('syumokunm', 'バスケットボール');
paramsUrl.append('kyoyo1nm', '全供用');
paramsUrl.append('kyoyo2nm', '全供用');
paramsUrl.append('chiikinm', '全地域');
paramsUrl.append('button', '照会')

// -------------------------

// const formData = new FormData();

// formData.append('syumoku', '023');
// formData.append('month', '12');
// formData.append('day', '04');
// formData.append('joken', '2');
// formData.append('kyoyo1', '07');
// formData.append('kyoyo2', '07');
// formData.append('chiiki', '20');

// formData.append('vlinefield', '40968');
// formData.append('tran_div', ' ');
// formData.append('system1', '0');
// formData.append('system2', '0');

// formData.append('mae_riymd', ' ');
// formData.append('mae_cnt', '0');
// formData.append('mae_shcd', ' ');
// formData.append('mae_kyocd', ' ');

// formData.append('page', '0');
// formData.append('flg', '0');

// formData.append('syumokunm', 'バスケットボール');
// formData.append('kyoyo1nm', '全供用');
// formData.append('kyoyo2nm', '全供用');
// formData.append('chiikinm', '全地域');
// formData.append('button', '照会')

// const axiosParam = {
//     method: 'post',
//     url: 'https://www.net.city.nagoya.jp/cgi-bin/sp04001',
//     data: formData,
//     headers: {
//         'Content-Type': 'multipart/form-data; charset=x-sjis;'
//     }
// }


async function getData() {
    // const res =  await axios.post(url, formData, { headers: formData.getHeaders() })
    // console.log(res);
    // const res = await axios.post(url, searchParams);
    // console.log(res);
   const res =  await axios.post(url, paramsUrl);
   console.log(res);
}

getData();
// const res =  axios.post(url, formData, { headers: axiosParam.headers })
//     .then(res => {
//         console.log(res.);
//     })
//     .catch(err => {
//         console.log(err);
//     })

// axios(axiosParam)
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log(err)
//     })

// var result = formData.submit(url, (err, res) => {
//     console.log(res.statusCode);
//     console.log(res) 
// });



// axios(url, formData)
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log(err)
//     })

// axios(.post(url, params)
//     .then(res => {
//         console.log(res.data);
//     })
//     .catch(err => {
//         console.log(err);)
//     })
