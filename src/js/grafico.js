
export function getChartConfig(element, arr) {
  const [max, min] = getMaxMin(arr);
  arr = insertPointRadius(arr);
  arr = arr.map((element,index) => {
    if (index == 0 || index == arr.length - 1){
      element.hora = '';
      return element;
    }
    element.hora = element.hora + ':00';
    return element
  })
  const gradient = createGradient(element);
  const data = fillData (arr, gradient);
  const config = fillCOnfig(data, min, max);
  return config

}

function getMaxMin(arr) {
  console.log(arr);
  let min = Math.min(...arr.map((value) => value.temperatura));
  if (min > 0) { min = 0};

  let max = Math.max(...arr.map((value) => value.temperatura));
  if (max > 0) { max = 0};

  return [max,min]
}

function insertPointRadius(arr) {
  let i;
  for (i = 1; i < arr.length - 1; i++){
    arr[i].pointRadius = 0
  }

  return arr;
}

function createGradient(element) {
  let gradient = element.getContext('2d').createLinearGradient(0, 0, 0, 350);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  return gradient;
};

function fillData(arr, backgroundColor) {
  const data = {
    labels: arr.map((row) => row.hora),
    datasets: [
      {
        data: arr.map((row) => row.temperatura),
        borderColor: 'rgba(255,255,255,0.1)',
        tension: "0.2",
        pointStyle: 'circle',
        fill: true,
        pointRadius: arr.map((row) => row.pointRadius), // Adiciona pointRadius para cada ponto
        backgroundColor: backgroundColor,
      }]
  };

  return data;
}

function fillCOnfig(data, min, max) {
  return {
    type: "line",
    data: data,
    plugins: [ChartDataLabels],
    options: {
      responsive: true,
      maintainAspectRadio: false,
      plugins: {
        legend: {
          display: false,
        },
        datalabels: {
          color: "white",
          anchor: "end",
          align: "top",
          font: {
            weight: "bold",
            size: 14,
          },
          formatter: (value, context) => {
            return value + "°";
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba( 255, 0, 0,0)", // Cor da linha do eixo X
          },
          ticks: {
            color: "rgba(0,0,0,0.4)", // Cor do texto dos rótulos no eixo x
            font: {
              weight: "bold",
              size: 14,
            },
          },
        },
        y: {
          display: false,
          suggestedMin: min,
          suggestedMax: max + 50,
        },
      },
    },
  };
}