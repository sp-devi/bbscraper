const FormData = require('form-data');
const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.net.city.nagoya.jp/cgi-bin/sp04001';
const params = {
    syumoku: 'バスケットボール',
}

const formData = new FormData();
formData.append('syumoku', 'バスケットボール');
formData.append('month', '12');
formData.append('day', '05');
formData.append('joken', '2');
formData.append('kyoyo1', '07');
formData.append('kyoyo2', '07');
formData.append('chiiki', '20');
formData.append('submit', 'submit')

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

// formData.submit(url, (err, res) => {
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
