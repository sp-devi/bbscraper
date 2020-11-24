const FormData = require('form-data');
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.net.city.nagoya.jp/cgi-bin/sp04001';
const params = {
    syumoku: 'バスケットボール',
}

const formData = new FormData();
formData.append('vlinefield', '40968');

formData.append('system1', '0');
formData.append('system2', '0');

formData.append('syumokunm', 'バスケットボール');

formData.append('page', '0');
formData.append('flg', '0');

formData.append('kyoyo1nm', '07');
formData.append('kyoyo2nm', '07');
formData.append('chiikinm', '20');
formData.append('button', '照会')

const axiosParam = {
    method: 'post',
    url: 'https://www.net.city.nagoya.jp/cgi-bin/sp04001',
    data: formData,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
}


axios(axiosParam)
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err)
    })

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
