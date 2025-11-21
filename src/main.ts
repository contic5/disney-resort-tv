import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'

async function get_weather_data():Promise<string>
{
  const api_data:Response = await fetch('https://api.weather.gov/gridpoints/MLB/29,64/forecast');
  const api_json_data:any = await api_data.json();
  return JSON.stringify(api_json_data);
}
function setup_table(weather_data:any)
{

  let weather_table_head=document.getElementById("weather_table_head") as HTMLTableElement;
  weather_table_head.innerHTML="";
  let tr:HTMLTableRowElement=document.createElement("tr");
  for(let day=0;day<7;day++)
  {
    let period=weather_data["properties"]["periods"][day*2];
    let th:HTMLTableCellElement=document.createElement("th");
    th.innerHTML=`Day ${day+1}`;
    th.scope="col";
    tr.appendChild(th);
  }
  weather_table_head.appendChild(tr);

  let weather_table_body=document.getElementById("weather_table_body") as HTMLTableElement;
  weather_table_body.innerHTML="";
  const total_periods:number=weather_data["properties"]["periods"].length;
  for(let time_period=0;time_period<2;time_period++)
  {
    tr=document.createElement("tr");
    for(let day=0;day<7;day++)
    {
      let index=2*day+time_period;
      let period=weather_data["properties"]["periods"][index];
      let td:HTMLTableCellElement=document.createElement("td");
      td.classList.add("day_info");
      td.innerHTML=`${period["temperature"]}${period["temperatureUnit"]}<br>${period["shortForecast"]}`;

      tr.appendChild(td);
    }
    weather_table_body.appendChild(tr);
  }
}
async function main()
{
  let weather_data=JSON.parse(await get_weather_data());
  console.log(weather_data);
  setup_table(weather_data);

  let welcome_heading=document.getElementById("welcome_header") as HTMLHeadingElement;
  welcome_heading.innerHTML=`Welcome ${family_name} Family`;
}

const family_name="Disney";
main();