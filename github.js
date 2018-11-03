function graph(version) {
  fetch('https://api.adoptopenjdk.net/v2/info/releases/open' + version)
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then(function(data) {
          var labels = [];
          var downloads = [];
          for (var release in data) {
            labels.push(data[release].release_name)
            downloads.push(data[release].download_count)
          }
          var graphVersion = document.getElementById(version).getContext('2d');
          Chart.defaults.global.defaultFontSize = 15;
          var myChart = new Chart(graphVersion, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: '# of ' + version + ' Downloads',
                data: downloads,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }]
            },
            options: {
              "hover": {
                "animationDuration": 0
              },
              "animation": {
                "duration": 1,
                "onComplete": function() {
                  var chartInstance = this.chart,
                    ctx = chartInstance.ctx;

                  ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'bottom';
                  this.data.datasets.forEach(function(dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);
                    meta.data.forEach(function(bar, index) {
                      var data = dataset.data[index];
                      ctx.fillText(Comma(data), bar._model.x, bar._model.y - 5);
                    });
                  });
                }
              },
              onClick: graphClickEvent,
              tooltips: {
                "enabled": false
              },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }],
                xAxes: [{
                  stacked: false,
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    min: 0,
                    autoSkip: false
                  }
                }],
              }
            }
          });
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch Error :-S', err);
    });

  function graphClickEvent(event, array) {
    if (array[0]) {
      tag = encodeURIComponent(array[0]._model.label)
      console.log(tag)
      window.open('./version.html?version=' + version + '&tag=' + tag ,'_blank');
    }
  }
}

function Comma(Num) { //function to add commas to textboxes
  Num += '';
  Num = Num.replace(',', '');
  Num = Num.replace(',', '');
  Num = Num.replace(',', '');
  Num = Num.replace(',', '');
  Num = Num.replace(',', '');
  Num = Num.replace(',', '');
  x = Num.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1))
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  return x1 + x2;
}

graph('jdk11')
graph('jdk10')
graph('jdk9')
graph('jdk8')
