import './bootstrap';

import Alpine from 'alpinejs';

// Import Chart.js
import { Chart } from 'chart.js';

// Import flatpickr
import flatpickr from 'flatpickr';

// Import TailwindCSS variables
import { tailwindConfig, formatDate, requestOptions } from './utils';

// import component from './components/component';
import dashboardCard01 from './components/dashboard-card-01';
import dashboardCard02 from './components/dashboard-card-02';
import dashboardCard03 from './components/dashboard-card-03';
import dashboardCard04 from './components/dashboard-card-04';
import map from './components/map';
import GSheetReader from 'g-sheets-api';

// Call Alpine
window.Alpine = Alpine;
Alpine.start();


// Define Chart.js default settings
/* eslint-disable prefer-destructuring */
Chart.defaults.font.family = '"Inter", sans-serif';
Chart.defaults.font.weight = '500';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.displayColors = false;
Chart.defaults.plugins.tooltip.mode = 'nearest';
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.tooltip.position = 'nearest';
Chart.defaults.plugins.tooltip.caretSize = 0;
Chart.defaults.plugins.tooltip.caretPadding = 20;
Chart.defaults.plugins.tooltip.cornerRadius = 4;
Chart.defaults.plugins.tooltip.padding = 8;

// Register Chart.js plugin to add a bg option for chart area
Chart.register({
  id: 'chartAreaPlugin',
  // eslint-disable-next-line object-shorthand
  beforeDraw: (chart) => {
    if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
      const ctx = chart.canvas.getContext('2d');
      const { chartArea } = chart;
      ctx.save();
      ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
      // eslint-disable-next-line max-len
      ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
      ctx.restore();
    }
  },
});

document.addEventListener('DOMContentLoaded', async () => {
  // Light switcher
  const lightSwitches = document.querySelectorAll('.light-switch');
  if (lightSwitches.length > 0) {
    lightSwitches.forEach((lightSwitch, i) => {
      if (localStorage.getItem('dark-mode') === 'true') {
        lightSwitch.checked = true;
      }
      lightSwitch.addEventListener('change', () => {
        const { checked } = lightSwitch;
        lightSwitches.forEach((el, n) => {
          if (n !== i) {
            el.checked = checked;
          }
        });
        document.documentElement.classList.add('[&_*]:!transition-none');
        if (lightSwitch.checked) {
          document.documentElement.classList.add('dark');
          document.querySelector('html').style.colorScheme = 'dark';
          localStorage.setItem('dark-mode', true);
          document.dispatchEvent(new CustomEvent('darkMode', { detail: { mode: 'on' } }));
        } else {
          document.documentElement.classList.remove('dark');
          document.querySelector('html').style.colorScheme = 'light';
          localStorage.setItem('dark-mode', false);
          document.dispatchEvent(new CustomEvent('darkMode', { detail: { mode: 'off' } }));
        }
        setTimeout(() => {
          document.documentElement.classList.remove('[&_*]:!transition-none');
        }, 1);
      });
    });
  }

  let availableDates = [];
  let userSelectedDate = "";
  let ph = [];
  let cd = [];
  let suhu = [];
  let battery = [];
  let jam = [];
  let longlat = "";
  const getDates = {
    apiKey: 'AIzaSyDqj9ScgeEgvOtLL4eytjIrbJa5MWo4ykU',
    sheetId: '1s5ndCbUqb__KIYJ0_UNulOAMmr3gRnU2TyEpcxKHHsk',
    sheetName: 'Sheet1',
    returnAllResults: true,
    filter: {
    },
    filterOptions: {
      operator: 'or',
      matching: 'loose'
    }
  }
  GSheetReader(getDates, results => {
    results.forEach(result => {
      var dateParts = result["TANGGAL"].split("/");
      var dateObject = new Date("20" + dateParts[2], dateParts[1] - 1, +dateParts[0]);
      if (!availableDates.includes(dateObject)) {
        availableDates.push(dateObject);
      }
      // console.log(Date.parse(result['TANGGAL']));
    });


  }).then(() => {
    console.log(availableDates);
    let chart1;
    let chart2;
    let chart3;
    let chart4;
    let map_component;
    flatpickr('.datepicker', {
      mode: 'single',
      static: true,
      monthSelectorType: 'static',
      dateFormat: 'M j, Y',
      defaultDate: availableDates.at(-1),
      enable: availableDates,
      prevArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
      nextArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
      onReady: (selectedDates, dateStr, instance) => {
        // eslint-disable-next-line no-param-reassign
        instance.element.value = dateStr.replace('to', '-');
        const customClass = instance.element.getAttribute('data-class');
        instance.calendarContainer.classList.add(customClass);
        userSelectedDate = formatDate(dateStr);
        const options = {
          apiKey: 'AIzaSyDqj9ScgeEgvOtLL4eytjIrbJa5MWo4ykU',
          sheetId: '1s5ndCbUqb__KIYJ0_UNulOAMmr3gRnU2TyEpcxKHHsk',
          sheetName: 'Sheet1',
          returnAllResults: false,
          filter: {
            'TANGGAL': userSelectedDate,
          },
          filterOptions: {
            operator: 'or',
            matching: 'loose'
          }
        }
        GSheetReader(options, results => {
          ph = [];
          cd = [];
          suhu = [];
          battery = [];
          jam = [];
          results.forEach(result => {
            ph.push(result['PH']);
            cd.push(result['CD']);
            suhu.push(result['SUHU']);
            battery.push(result['BATTERY']);
            jam.push(result['JAM']);
            longlat = result['LOCATION'];

          });
        }).then(() => {
          chart1 = dashboardCard01(jam, ph);
          chart2 = dashboardCard02(jam, cd);
          chart3 = dashboardCard03(jam, suhu);
          chart4 = dashboardCard04(jam, battery);
          map_component = map(longlat);
        });
        // dashboardCard01(userSelectedDate);
      },
      onChange: (selectedDates, dateStr, instance) => {
        // eslint-disable-next-line no-param-reassign
        instance.element.value = dateStr.replace('to', '-');
        userSelectedDate = formatDate(dateStr);
        const options = {
          apiKey: 'AIzaSyDqj9ScgeEgvOtLL4eytjIrbJa5MWo4ykU',
          sheetId: '1s5ndCbUqb__KIYJ0_UNulOAMmr3gRnU2TyEpcxKHHsk',
          sheetName: 'Sheet1',
          returnAllResults: false,
          filter: {
            'TANGGAL': userSelectedDate,
          },
          filterOptions: {
            operator: 'or',
            matching: 'loose'
          }
        }
        GSheetReader(options, results => {
          ph = [];
          cd = [];
          suhu = [];
          battery = [];
          jam = [];
          results.forEach(result => {
            ph.push(result['PH']);
            cd.push(result['CD']);
            suhu.push(result['SUHU']);
            battery.push(result['BATTERY']);
            jam.push(result['JAM']);
            longlat = result['LOCATION'];
          });


        }).then(() => {
          chart1.destroy();
          chart2.destroy();
          chart3.destroy();
          chart4.destroy();
          chart1 = dashboardCard01(jam, ph);
          chart2 = dashboardCard02(jam, cd);
          chart3 = dashboardCard03(jam, suhu);
          chart4 = dashboardCard04(jam, battery);
          map(longlat);
        });
      },
    });
  });

});
