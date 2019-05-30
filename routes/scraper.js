const rp = require('request-promise');
const cheerio = require('cheerio');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const House = mongoose.model('House');

/* GET users listing. */
router.get('/TEST', function(req, res, next) {
  const requestOptions = {
    method: 'GET',
    uri: 'https://www.idealista.com/alquiler-viviendas/madrid-madrid/',
    headers:
      {
        'scheme': 'https',
        'path': '/alquiler-viviendas/madrid-madrid/',
        'method': 'GET',
        'authority': 'www.idealista.com',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        // 'accept-encoding': 'gzip, deflate, br',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'upgrade-insecure-requests': '1',
        'pragma': 'no-cache',
        'cache-control': 'no-cache,no-cache',
        'accept-language': 'es-ES,es;q=0.9,en;q=0.8',
        'cookie': `userUUID=c19f68626-348d-4c3c-9156-b806ef222865; cookieDirectiveClosed=true; vid=5d4b0f50-fe92-11e7-95e5-f1141749248a; _pxvid=5d4b0f50-fe92-11e7-95e5-f1141749248a; WEBSERVERID=R|WmRll|WmRlg; pxvid=5d4b0f50-fe92-11e7-95e5-f1141749248a; _pxhd=5584b12911d70218b58dbc0794217fea1951191ef7eecb3d560363c541745434:5d4b0f50-fe92-11e7-95e5-f1141749248a; STID=7d28f287540edece|XJ0fw|XJ0ft; sende51d0e25-8b71-4329-993a-6acc022a9e2a="{'friendsEmail':null,'email':null,'message':null}"; contact73fed7a1-aa81-455e-9e6a-c7600963bea2="{'email':null,'phone':null,'phonePrefix':null,'friendEmails':null,'name':null,'message':null,'message2Friends':null,'maxNumberContactsAllow':10,'defaultMessage':true}"; SESSION=73fed7a1-aa81-455e-9e6a-c7600963bea2; cookieSearch-1="/alquiler-viviendas/madrid-madrid/:1559248447100"; WID=e87100649bd6e940|XPA+Q|XPA4/`
      }
  };
  //
  // const house = new IdealistaHouse();
  // console.log(house.name);
  // house.name = 'pepe';
  // console.log(house.name);
  
  
  rp(requestOptions).then((data) => {
    parseData(data);
    // res.send(data);
    res.send('ok');
  })
    .catch((error) => {
      console.log('error');
      console.log(error);
      res.send(`error: ${error}`)
    });
  // res.send('ok');
});

router.get('/', function(req, res, next) {
  for (let i = 1; i <= 1; i++) {
    scrapingRequest(i);
  }
  
  res.send('ok');
  
});

const scrapingRequest = (page) => {
  const requestOptions = {
    method: 'GET',
    uri: `https://www.idealista.com/alquiler-viviendas/madrid-madrid/pagina-${page}.htm`,
    headers:
      {
        'scheme': 'https',
        'path': '/alquiler-viviendas/madrid-madrid/pagina-${page}.htm',
        'method': 'GET',
        'authority': 'www.idealista.com',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        // 'accept-encoding': 'gzip, deflate, br',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36',
        'upgrade-insecure-requests': '1',
        'pragma': 'no-cache',
        'cache-control': 'no-cache,no-cache',
        'accept-language': 'es-ES,es;q=0.9,en;q=0.8',
        'cookie': `userUUID=2c19f68626-348d-4c3c-9156-b806ef222865; cookieDirectiveClosed=true; vid=5d4b0f50-fe92-11e7-95e5-f1141749248a; _pxvid=5d4b0f50-fe92-11e7-95e5-f1141749248a; WEBSERVERID=R|WmRll|WmRlg; pxvid=5d4b0f50-fe92-11e7-95e5-f1141749248a; _pxhd=5584b12911d70218b58dbc0794217fea1951191ef7eecb3d560363c541745434:5d4b0f50-fe92-11e7-95e5-f1141749248a; STID=7d28f287540edece|XJ0fw|XJ0ft; sende51d0e25-8b71-4329-993a-6acc022a9e2a="{'friendsEmail':null,'email':null,'message':null}"; contact73fed7a1-aa81-455e-9e6a-c7600963bea2="{'email':null,'phone':null,'phonePrefix':null,'friendEmails':null,'name':null,'message':null,'message2Friends':null,'maxNumberContactsAllow':10,'defaultMessage':true}"; SESSION=73fed7a1-aa81-455e-9e6a-c7600963bea2; cookieSearch-1="/alquiler-viviendas/madrid-madrid/pagina-${page}.htm:1559248447100"; WID=e87100649bd6e940|XPA+Q|XPA4/`
      }
  };
  
  
  rp(requestOptions).then((data) => {
    parseData(data);
    // res.send(data);
  })
    .catch((error) => {
      console.log('error');
      console.log(error);
      // res.send(`error: ${error}`)
    });
  // res.send('ok');
};

const parseData = (data) => {
  const $ = cheerio.load(data);
  console.log($('#main-content > section > article:nth-child(1) > div > a').html());
  
  const containers = $('#main-content > section article.item');
  if (containers.length) {
    containers.each(function(i, elem) {
      // console.log($(this).text());
      const idHouse = $(this).attr('data-adid');
      setHouseSummary($(this).html(), idHouse);
    });
  }
};

const setHouseSummary = async(data, idHouse) => {
  // const house = new House();
  // const result = await House.findOneAndUpdate({ idSource: idHouse }).select("idSource").lean();
  const $ = cheerio.load(data);
  const dataHouse = {};
  
  dataHouse.title = $('.item-info-container .item-link').text();
  dataHouse.origin = 'idealista';
  dataHouse.idSource = idHouse;

  const result = await House.findOneAndUpdate({ idSource: idHouse }, dataHouse, { upsert: true, new: true, setDefaultsOnInsert: true });
  // house.save();
  // console.log(house);
  console.log(result);
};

class IdealistaHouse {
  constructor(data = {}) {
    this.data = data;
  }

  set name(name) {
    this.data['name'] = name;
  }
  
  get name() {
    return this.data['name'];
  }
  
  set price(price) {
    this.data['price'] = price;
  }
  
  get price() {
    return this.data['price'];
  }
}

module.exports = router;
