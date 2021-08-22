import fetchCountries from '../src/fetchCountries.js';
import markupCountry from './templates/countries.hbs';
import markupList from './templates/list.hbs';

import { alert, notice, info, success, error, defaults } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

defaults.delay = 2500;

const debounce = require('lodash.debounce');

const refs = {
  searchForm: document.querySelector('.input'),
  countryContainer: document.querySelector('.container'),
};

refs.searchForm.addEventListener('input', debounce(onInputChange, 500));

function onInputChange(el) {
  if (el.target.value.trim('') === '') {
    refs.countryContainer.textContent = '';
    return;
  }

  refs.countryContainer.textContent = '';
  fetchCountries(el.target.value.trim(''))
    .then(response => (response.ok ? response.json() : Promise.reject(response)))
    .then(countries => {
      if (countries.length === 1) {
        refs.countryContainer.innerHTML = markupCountry(countries[0]);
        success({ text: `Результат поиска.` });
        return;
      }
      if (countries.length > 1 && countries.length <= 10) {
        refs.countryContainer.innerHTML = markupList(countries);
        success({ text: `Поиск ведется.` });
        return;
      }
      error({
        text: 'Найдено слишком много стран, уточните поиск.',
      });
    })
    .catch(err => {
      if (err.status === 404) {
        error({
          text: `Oшибка. Такая страна не найдена.`,
        });
      } else {
        error({
          text: 'Ошибка. Возможно проблема со связью.',
        });
      }
    });
}
