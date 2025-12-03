import {getData} from "./cache_functions.ts";

export async function get_weather_data(fetching_data:boolean)
{
  //If we are getting live data or stored data
  if(fetching_data)
  {
    //Fetch data from weather api
    const api_data:Response = await getData('https://api.weather.gov/gridpoints/MLB/29,64/forecast');
    console.log(api_data);
    //const api_json_data:any = await api_data.json();
    return api_data;
  }
  else
  {
    //Fetch stored weather data
    const api_data:Response = await getData('sample_weather.json');
    console.log(api_data);
    //const api_json_data:any = await api_data.json();
    return api_data;
  }
}
export async function get_park_data(park_id:string,index:number=0,local_park_file_links:string[],fetching_data:boolean)
{
  //If we are getting live data or stored data
  if(fetching_data)
  {
    //Fetch data from theme park api
    const api_data:Response = await getData(`https://api.themeparks.wiki/v1/entity/${park_id}/live`);
    //const api_json_data:any = await api_data.json();
    return api_data;
  }
  else
  {
    //Fetch data from array of stored data
    const api_data:Response = await getData(local_park_file_links[index]);
    //const api_json_data:any = await api_data.json();
    return api_data;
  }
}