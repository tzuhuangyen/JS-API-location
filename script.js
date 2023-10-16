'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
//https://restcountries.com/v3.1/name/${countryName}
//https://restcountries.com/v3.1/alpha/${country}
///////////////////////////////////////

const getJSON = function (url, errorMsg = 'this Country is an island') {
  return fetch(url).then(res => {
    console.log(res);
    if (!res.ok) throw new Error(`${errorMsg} (${res.status})`);
    return res.json();
  });
};
//渲染畫面
const renderCountry = function (data, className = '') {
  //const language = Object.values(data.languages)[0];
  //const language = data.languages;
  //const { name: symbol } = Object.values(data.currencies);

  const html = `
  <article class="country ${className}">
      <img class="country__img" src="${data.flags?.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name?.common} - <span>${
    data.capital
  }</span></h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 100000
        ).toFixed(1)} people</p>
        <p class="country__row"><span>🗣️</span>${
          Object.values(data.languages)[0]
        }</p>
        <p class="country__row"><span>💰</span>${
          Object.values(data.currencies)[0].name
        } </p>

        </div>
    </article>
    `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};
//渲染錯誤訊息
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};
//fetch API

//fetch countryData
const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      console.log(data);
      renderCountry(data[0]);
      // const neighbour = data[0].borders?.[0];
      const neighbour = data[0].borders;

      if (!neighbour) throw new Error(':This country is an island');

      //neighbour
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour[0]}`,
        'Country not found'
      );
    })
    .then(data => {
      console.log(data);
      renderCountry(data[0], 'neighbour');
    })
    .catch(err => {
      console.error(`${err}`);
      renderError(`something went wrong ${err.message}. Try again!`);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};
//getCountryData('spain');
//按鈕;
// btn.addEventListener('click', function () {
//   getCountryData('spain');
//   //whereAmI();
// });

//使用座標來渲染國家畫面
// const whereAmI = function (lat, lng) {
//   fetch(
//     `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
//   )
//     .then(res => {
//       if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
//       return res.json();
//     })
//     .then(data => {
//       console.log(data);
//       console.log(`you are in ${data.city}, ${data.countryName}`);
//       getCountryData(data.countryName);

//       return fetch(`https://restcountries.com/v2/name/${country}`);
//     })
//     .then(res => {
//       if (!res.ok) throw new Error(`Country not found(${res.status})`);
//       return res.json();
//     })
//     .then(data => {
//       console.log(data);
//       //console.log(data[0]);
//     })
//     //如果console出現“Uncaught(...)Error
//     .catch(err => console.log(`${err.message}`));
// };
// whereAmI(52.508, 13.381);
//btn.addEventListener('click', whereAmI);

//challeage #2
// const wait = function (seconds) {
//   return new Promise(resolve => {
//     setTimeout(resolve, seconds * 1000);
//   });
// };

// const imgContainer = document.querySelector('.images');

// const createImage = function (imgPath) {
//   return new Promise((resolve, reject) => {
//     const img = document.createElement('img');
//     img.src = imgPath;

//     img.addEventListener('load', () => {
//       imgContainer.append(img);
//       resolve(img);
//     });
//     img.addEventListener('error', () => {
//       reject(new Error('Image not found'));
//     });
//   });
// };

// let currentImg;
// createImage('img/img-1.jpg')
//   .then(img => {
//     currentImg = img;
//     currentImg;
//     console.log('image 1 loaded');
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//     return createImage('img/img-2.jpg');
//   })
//   .then(img => {
//     currentImg = img;
//     console.log('image 2 loaded');
//     return wait(2);
//   })
//   .then(() => {
//     currentImg.style.display = 'none';
//   })
//   .catch(err => console.error(err));

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation = getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
// getPosition().then(pos => console.log(pos));

// const whereAmI = function () {
//   getPosition()
//     .then(pos => {
//       const { latitude: lat, longitude: lng } = pos.coords;

//       return fetch(
//         `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
//       );
//     })
//     .then(res => {
//       if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
//       return res.json();
//     })
//     .then(data => {
//       console.log(data);
//       console.log(`you are in ${data.city}, ${data.countryName}`);
//       getCountryData(data.countryName);

//       return fetch(`https://restcountries.com/v2/name/${country}`);
//     })
//     .then(res => {
//       if (!res.ok) throw new Error(`Country not found(${res.status})`);
//       return res.json();
//     })
//     .then(data => {
//       console.log(data);
//       //console.log(data[0]);
//     })
//     //如果console出現“Uncaught(...)Error
//     .catch(err => console.log(`${err.message}`));
// };
// btn.addEventListener('click', whereAmI);

//use async await
const whereAmI = async function (country) {
  //geolocation
  const pos = await getPosition();
  const { latitude: lat, longitude: lng } = pos.coords;

  //reverse geocoding
  const resGeo = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=
    ${lat}&longitude=${lng}`
  );
  const dataGeo = await resGeo.json();
  console.log(dataGeo);

  //country data
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${dataGeo.countryName}`
  );
  const data = await res.json();
  console.log(data);
  renderCountry(data[0]);
};
whereAmI();
console.log('first');
