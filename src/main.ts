import './style.css'

import {get_weather_data,get_park_data} from "./fetch_functions.ts";
import {rotate_park} from "./shared_general_functions.ts";

function get_best_weather_image(short_forecast:string,image_array:string[],folder_name:string)
{
  let cur_weather_image="";
  let max_words:number=0;
  for(let i=0;i<image_array.length;i++)
  {
    if(short_forecast==image_array[i])
    {
      cur_weather_image=`${folder_name}/${image_array[i]}.png`;
      break;
    }

    const images_name_words:string[]=image_array[i].split("_");
    let total_matching_words:number=0;
    for(let images_name_word of images_name_words)
    {
      if(short_forecast.includes(images_name_word))
      {
        total_matching_words+=1;
      }
    }

    if(total_matching_words>max_words)
    {
      max_words=total_matching_words;
      cur_weather_image=`${folder_name}/${image_array[i]}.png`;
    }
  }
  return cur_weather_image;
}
//Get weather images from AccuWeather API Weather Icons
function get_weather_images(weather_data:any)
{
  console.log(weather_data);
  let weather_images:string[]=[];
  for(let i=0;i<weather_data["properties"]["periods"].length;i++)
  {
    let short_forecast=weather_data["properties"]["periods"][i]["shortForecast"];
    let short_forecast_lower=short_forecast.toLowerCase();
    let cur_weather_image="";
    if(i%2==0)
    {
      cur_weather_image=get_best_weather_image(short_forecast_lower,day_images_names,"day_weather");
    }
    else
    {
      cur_weather_image=get_best_weather_image(short_forecast_lower,night_images_names,"night_weather");
    }
    
    weather_images.push(cur_weather_image);
  }
  console.log(weather_images);
  return weather_images;
}
//Creates weather table
function setup_weather_table(weather_data:any,weather_images:string[])
{
  let weather_table_head=document.getElementById("weather_table_head") as HTMLTableElement;
  weather_table_head.innerHTML="";

  //Create table head row for days
  let tr:HTMLTableRowElement=document.createElement("tr");

  let th:HTMLTableCellElement=document.createElement("th");
  th.scope="col";
  th.innerHTML="Time";
  tr.appendChild(th);
  for(let day=0;day<7;day++)
  {
    th=document.createElement("th");
    th.innerHTML=`Day ${day+1}`;
    th.scope="col";
    tr.appendChild(th);
  }
  weather_table_head.appendChild(tr);

  let weather_table_body=document.getElementById("weather_table_body") as HTMLTableElement;
  weather_table_body.innerHTML="";

  //Create weather table cells for each time period
  const time_period_names=["Today","Tonight"];
  //Periods are morning, then night for each day.
  for(let time_period=0;time_period<2;time_period++)
  {
    tr=document.createElement("tr");

    //Add heading at the start of the row.
    let th:HTMLTableCellElement=document.createElement("th");
    th.innerHTML=time_period_names[time_period];
    th.scope="row";
    tr.appendChild(th);

    for(let day=0;day<7;day++)
    {
      //First row should be morning, second row should be night.
      let index=2*day+time_period;
      let period=weather_data["properties"]["periods"][index];
      let td:HTMLTableCellElement=document.createElement("td");
      td.classList.add("day_info");

      let span:HTMLSpanElement=document.createElement("span");
      td.appendChild(span);
      span.innerHTML=`${period["temperature"]}${period["temperatureUnit"]}<br>${period["shortForecast"]}`;
      
      let weather_img:HTMLImageElement=document.createElement("img");
      td.appendChild(weather_img);
      weather_img.src=weather_images[index];

      tr.appendChild(td);
    }
    weather_table_body.appendChild(tr);
  }
}
function setup_today_weather(weather_data:any,weather_images:string[])
{

  //Create table that only holds today and tonight's weather.
  let weather_today_table_head=document.getElementById("weather_today_table_head") as HTMLTableElement;
  let weather_today_table_body=document.getElementById("weather_today_table_body") as HTMLTableElement;

  let tr:HTMLTableRowElement=document.createElement("tr");
  let th:HTMLHeadingElement=document.createElement("th");
  th.innerHTML="Today";
  tr.appendChild(th);

  th=document.createElement("th");
  th.innerHTML="Tonight";
  tr.appendChild(th);
  weather_today_table_head.appendChild(tr);

  tr=document.createElement("tr");
  //Get first two time periods
  for(let time_period=0;time_period<2;time_period++)
  {
    let td:HTMLTableCellElement=document.createElement("td");
    let span:HTMLSpanElement=document.createElement("span");
    td.appendChild(span);
    let period=weather_data["properties"]["periods"][time_period];
    span.innerHTML=`${period["temperature"]}${period["temperatureUnit"]}<br>${period["shortForecast"]}`;

    let img:HTMLImageElement=document.createElement("img");
    td.appendChild(img);
    img.src=weather_images[time_period];

    td.classList.add("day_info");
    tr.appendChild(td);
  }
  weather_today_table_body.appendChild(tr);
}

//Loop through all attractions to find the earliest opening and latest closing. This gives us park hours.
function find_park_hours(park_data:any):string[]
{
  const estOptions:any = {
        timeZone: 'America/New_York', // EST/EDT time zone
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // For AM/PM format
  };

  let earliest_opening_time=Number.MAX_SAFE_INTEGER;
  let earliest_opening_time_written="TESTING";
  let latest_closing_time=Number.MIN_SAFE_INTEGER;
  let latest_closing_time_written="TESTING";

  for(let item of park_data["liveData"])
  {
    if(item["entityType"]=="ATTRACTION")
    {
      const operating_hours=item["operatingHours"];
      //Make sure that the attraction has operating hours before checking operating hours.
      if(!operating_hours||operating_hours.length==0)
      {
        continue;
      }

      const opening_time:Date=new Date(operating_hours[0]["startTime"]);
      const opening_time_written:string=opening_time.toLocaleString('en-US', estOptions);
      if(opening_time.getSeconds()<earliest_opening_time)
      {
        earliest_opening_time=opening_time.getSeconds();
        earliest_opening_time_written=opening_time_written;
      }

      const closing_time:Date=new Date(operating_hours[operating_hours.length-1]["endTime"]);
      const closing_time_written:string=closing_time.toLocaleString('en-US', estOptions);
      if(closing_time.getSeconds()>latest_closing_time)
      {
        latest_closing_time=closing_time.getSeconds();
        latest_closing_time_written=closing_time_written;
      }
    }
  }

  return [earliest_opening_time_written,latest_closing_time_written];
}
function setup_park_hours(park_data:any,park_index:number)
{
  let park_hours_today=document.getElementById("park_hours_today") as HTMLDivElement;
  park_hours_today.innerHTML="";

  let time_range=find_park_hours(park_data);
  console.log(time_range);
  console.log(time_range);

  let hours_h2=document.createElement("h2");
  hours_h2.innerHTML=`${park_names[park_index]} Hours`;
  park_hours_today.appendChild(hours_h2);

  const opening_time:string=time_range[0];
  const closing_time:string=time_range[1];
  let park_hours_h2:HTMLHeadingElement=document.createElement("h2");
  park_hours_h2.innerHTML=opening_time+" - "+closing_time;
  park_hours_today.appendChild(park_hours_h2);
}

//Find all nighttime events for a park
function setup_park_nighttime(park_data:any,park_index:number)
{
  let park_nighttime_today=document.getElementById("park_nighttime_today") as HTMLDivElement;
  park_nighttime_today.innerHTML="";

  let h2=document.createElement("h2");
  h2.innerHTML=`${park_names[park_index]} Nighttime Shows`;
  park_nighttime_today.appendChild(h2);


  const estOptions:any = {
        timeZone: 'America/New_York', // EST/EDT time zone
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // For AM/PM format
  };

  //Loop through all items
  for(let item of park_data["liveData"])
  {
    //Only track shows that do not have Meet in them. This keeps only nighttime shows since Meet is often found in character meetings.
    if(item["entityType"]=="SHOW"&&!item["name"].includes("Meet"))
    {
      //Night shows have at most 3 showings usually. If there are many showings, it is unlikely to be an actual show.
      if(item["showtimes"]&&item["showtimes"].length>0&&item["showtimes"].length<=3)
      {
        const first_opening_time:Date=new Date(item["showtimes"][0]["startTime"]);
        const first_opening_hour:string=first_opening_time.toLocaleTimeString("en",{timeZone:'America/New_York',hour:'numeric',hour12:false});
        //console.log(first_opening_hour);

        /*const first_closing_time:Date=new Date(item["showtimes"][0]["endTime"]);
        const first_runtime=(first_closing_time.getTime()-first_opening_time.getTime())/(1000*60);
        console.log(first_runtime);*/
        
        //If the show starts before 7:00, it is likely not a night show.
        if(parseInt(first_opening_hour)<18)
        {
          continue;
        }

        //Create a heading element with the show name.
        let h3=document.createElement("h3");
        h3.innerHTML=item["name"];
        park_nighttime_today.appendChild(h3);
        
        //Create an unordered list that contains each showtime for the night show.
        let ul=document.createElement("ul");
        park_nighttime_today.appendChild(ul);

        //Loop through all showtimes
        for(let i=0;i<item["showtimes"].length;i++)
        {
          const opening_time:Date=new Date(item["showtimes"][i]["startTime"]);
          const opening_time_written=opening_time.toLocaleString("en",estOptions);
          const closing_time:Date=new Date(item["showtimes"][i]["endTime"]);
          const closing_time_written=closing_time.toLocaleString("en",estOptions);
          let li=document.createElement("li");
          li.innerHTML=`${opening_time_written} - ${closing_time_written}`;
          ul.appendChild(li);
        }
      }
    }
  }
}
async function handle_rotate_park()
{
  //Flip fading out. If fading out, then hide current information. Otherwise, show new information.
  fading_out=!fading_out;

  if(!fading_out)
  {
    //Change to the next park
    target_park_index=(target_park_index+1)%4;
  }

  rotate_park(target_park_index,fading_out);

  //Display the current park hours
  setup_park_hours(park_arr[target_park_index],target_park_index);

  //Display the current park nighttime
  setup_park_nighttime(park_arr[target_park_index],target_park_index);
}
async function main()
{
  //Indicate that we are not using live data
  if(!fetching_data)
  {
    let alert_h1:HTMLHeadingElement=document.createElement("h1");
    alert_h1.innerHTML="NOT FETCHING DATA. USING SAMPLE DATA";
    document.getElementById("welcome_div")?.appendChild(alert_h1);
  }

  //Get weather data
  let weather_data=await get_weather_data(fetching_data);
  let weather_images:string[]=get_weather_images(weather_data);
  console.log(weather_data);
  setup_weather_table(weather_data,weather_images);
  setup_today_weather(weather_data,weather_images);

  //Get park data
  for(let i=0;i<4;i++)
  {
    let park_data=await get_park_data(park_keys[i],i,local_park_file_links,fetching_data);
    park_arr.push(park_data);
  }
  
  //Display welcome
  let welcome_heading=document.getElementById("welcome_heading") as HTMLHeadingElement;
  welcome_heading.innerHTML=`Welcome ${family_name} Family`;

  setInterval(handle_rotate_park,1000*rotate_park_seconds);
  handle_rotate_park();
}

const day_images_names=["cloudy","dreary_overcast","flurries","fog","freezing_rain","hazy_sunshine","ice","intermittent_clouds","mostly_cloudy_with_showers","mostly_cloudy_with_snow","mostly_cloudy_with_thunderstorms","mostly_cloudy","mostly_sunny","partially_sunny_with_showers","partly_sunny_with_flurries","partly_sunny","rain_and_snow","rain","showers","sleet","snow","sunny","thunderstorms"];
const night_images_names=["clear","cloudy","dreary_overcast","flurries","fog","freezing_rain","hazy_moonlight","ice","intermittent_clouds","mostly_clear","mostly_cloudy_with_showers","mostly_cloudy_with_snow","mostly_cloudy_with_thunderstorms","mostly_cloudy","mostly_sunny","partially_sunny_with_showers","partly_sunny_with_flurries","partly_sunny","rain_and_snow","rain","showers","sleet","snow","sunny","thunderstorms"];

const rotate_park_seconds=10;

//Names for each park
const park_names=["Magic Kingdom","Epcot","Disney Hollywood Studios","Animal Kingdom"];

//Park API keys for each park
const park_keys=["75ea578a-adc8-4116-a54d-dccb60765ef9","47f90d2c-e191-4239-a466-5892ef59a88b","288747d1-8b4f-4a64-867e-ea7c9b27bad8","1c84a229-8862-4648-9c71-378ddd2c7693"];

//Link to local JSON data
const local_park_file_links=["magic_kingdom_sample.json","epcot_sample.json","hollywood_studios_sample.json","animal_kingdom_sample.json"];

//Sets whether we are getting real, current data or using stored data. 
const fetching_data:boolean=false;
let park_arr:any=[];

//Family name to welcome
const family_name="Disney";

//Start with true so the data fades in
let fading_out:boolean=true;

//Start at the last part and then rotate
let target_park_index=3;
main();