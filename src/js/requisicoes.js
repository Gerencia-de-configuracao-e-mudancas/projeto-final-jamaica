import { formatarDataHora } from "./utils.js";

export default class CaixaDagua {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error ('Cade a Chave ?');
    }
    this.key = apiKey;
  }

  /* vai pegar tudo de uma lapada so*/
   async getAllInfo(latitude, longitude, hora) {
    try {
      const result = await this.getTempInfo(latitude, longitude, 24, 10);
      const compactInfos =  this.getCompactInfos(result,10);
      const dadosHoje = this.getDayWeatherInfo(result, 0);
      const dadosAmanha = this.getDayWeatherInfo(result, 1);
      dadosAmanha.cidadeNome = dadosHoje.cidadeNome;
      return [
        dadosHoje,
        dadosAmanha,
        compactInfos
      ]
    }catch (error){
      console.log(error);
      return undefined
    }
  }
  
  /* funÇão responsavel por pegar os dados da API. Os parametros recebidos são os queryParameters da url */
  async getTempInfo(latitude, longitude, hora = undefined, dias = 1) {
    try {  
      const key = this.key;
      const result = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${key}&lang=pt&q=${latitude},${longitude}&days=${dias}&hours${hora}`);
      const jsonBody = await result.json();
      return jsonBody;
    }
    catch (error){
      console.log(error);
      return undefined;
    }
  }

  /* funÇão responsavel por parsear o objeto recebido da API e parsear para um array com informaçoes de tempo compactas de um numero de dias especificados*/
  getCompactInfos(json, days) {
    let i;
    console.log(json);
    let trunc = json.forecast.forecastday;
    const infos = [];
  
    for (i = 0; i < days; i ++){
      let data = trunc[i].date
      ? formatarDataHora(trunc[i].date + ' 00:01')
      : undefined;
  
      let icon =  trunc[i].day.condition.icon 
      ? trunc[i].day.condition.icon.replace('//', 'https://').replace('64x64', '128x128')
      : undefined
  
      let tempMax = trunc[i].day.maxtemp_c
      ? Math.round(trunc[i].day.maxtemp_c)
      : undefined;
  
      let tempMin = trunc[i].day.mintemp_c
      ? Math.round(trunc[i].day.mintemp_c)
      : undefined;
  
      let text = trunc[i].day.condition.text 
      ? trunc[i].day.condition.text
      : undefined;
  
      infos.push({data,icon,tempMin,tempMax,icon,text});
    }
    return infos;
  }


  /* Função que vai retornar informações completas sobre um dia especificado como parametro. 0 = hoje*/
  getDayWeatherInfo(json, day = 0) {
    if ((day > 9 && day < 0) || isNaN(day)) {
      return undefined;;
    }

    let date;
    
    if (day == 0) {
      date = json.current.last_updated 
        ? formatarDataHora(json.current.last_updated)
        : undefined;   
    } else {
      date =  json.forecast.forecastday[day]?.date 
        ? formatarDataHora(json.forecast.forecastday[day].date + ' 00:01').replace(', 00:01', '')
        : undefined;
    };

    return {
      date: date,
      tempMax: json.forecast.forecastday[day].day.maxtemp_c
        ? Math.round(json.forecast.forecastday[day].day.maxtemp_c)
        : undefined,
      tempMin: json.forecast.forecastday[day].day.mintemp_c
        ? Math.round(json.forecast.forecastday[day].day.mintemp_c)
        : undefined,
      temperatura: json.current.temp_c && day == 0
        ?  Math.round(json.current.temp_c )
        : undefined,
      sensacaoTermica: json.current.feelslike_c 
        ? Math.round(json.current.feelslike_c) 
        : undefined,
      icon: json.forecast.forecastday[day].day.condition.icon 
        ? json.forecast.forecastday[day].day.condition.icon.replace('//', 'https://').replace('64x64', '128x128')
        : undefined,
      text: json.current.condition.text 
        ? json.current.condition.text 
        : undefined,
      chuva: json.forecast.forecastday[day].day.daily_chance_of_rain >= 0
        ? Math.round(json.forecast.forecastday[day].day.daily_chance_of_rain)
        : undefined,
      umidade: json.current.humidity 
        ? Math.round(json.current.humidity)
        : undefined,
      velocidadeVento: json.current.wind_kph 
        ? Math.round(json.current.wind_kph)
        : undefined,
      visibilidade: json.current.vis_km 
        ? Math.round(json.current.vis_km)
        : undefined,
      raiosUV: json.current.uv
        ? json.current.uv
        : undefined,

      cidadeNome: json.location.name
      ? json.location.name
      : undefined
    }
  }

}
