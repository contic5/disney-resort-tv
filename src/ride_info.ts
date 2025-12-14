import {handle_fade_element,hide_element,rotate_park} from "./shared_general_functions";
import {get_park_data} from "./fetch_functions";
import './style.css'

function refactor_park_data(original_park_data:any)
{
  let park_data:any={};
  park_data["liveData"]=[];
  for(let i=0;i<original_park_data["liveData"].length;i++)
  {
    let ride_data=original_park_data["liveData"][i];
    if(ride_data["entityType"]!="ATTRACTION")
    {
      continue;
    }

    let wait_time=0
    for(const wait_type in ride_data["queue"])
    {
      if(ride_data["queue"][wait_type]["waitTime"]==null)
      {
        continue;
      }
      wait_time=ride_data["queue"][wait_type]["waitTime"];
    }
    ride_data["Wait"]=wait_time;
    park_data["liveData"].push(ride_data);
  }
  park_data["liveData"]=park_data["liveData"].sort((a:any,b:any)=>a["Wait"]-b["Wait"]);
  return park_data;
}
function display_ride_info()
{
  let ride_table_body=document.getElementById("ride_table_body") as HTMLTableElement;
  ride_table_body.innerHTML="";
  console.log(park_arr[target_park_index]);

  const end_ride_index=Math.min(ride_index+10,park_arr[target_park_index]["liveData"].length)
  for(let i=ride_index;i<end_ride_index;i++)
  {
    let ride_data=park_arr[target_park_index]["liveData"][i];
    
    let tr=document.createElement("tr") as HTMLTableRowElement;
    ride_table_body?.appendChild(tr);

    let td=document.createElement("td") as HTMLTableCellElement;
    tr.appendChild(td);

    let h4=document.createElement("h4") as HTMLHeadingElement;
    h4.style.overflowWrap="break-word;";
    td.appendChild(h4);
    h4.innerHTML=ride_data["name"];

    td=document.createElement("td") as HTMLTableCellElement;
    tr.appendChild(td);

    h4=document.createElement("h4") as HTMLHeadingElement;
    td.appendChild(h4);
    h4.innerHTML=`${ride_data["Wait"]} Minutes`;
  }
}
function handle_rotate_park()
{
  //Flip fading out. If fading out, then hide current information. Otherwise, show new information.
  fading_out=!fading_out;

  if(!fading_out)
  {
    //Change to the next park
    target_park_index=(target_park_index+1)%4;
    handle_rotate_rides();
  }
  
  rotate_park(target_park_index,fading_out);
}
function rotate_rides()
{
  const ride_table=document.getElementById("ride_table") as HTMLTableElement;
  //const current_info=document.getElementById("current_info") as HTMLDivElement;
  setTimeout(()=>{handle_fade_element(ride_table,false)},1);
  setTimeout(()=>{handle_fade_element(ride_table,true)},3000);
  setTimeout(()=>{hide_element(ride_table)},5000);
}
function handle_rotate_rides()
{
  ride_index+=10;
  if(ride_index>=park_arr[target_park_index]["liveData"].length)
  {
    ride_index=-10;
    handle_rotate_park();
  }
  else
  {
      rotate_rides();
      display_ride_info();
  }
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

    //Get park data
    for(let i=0;i<4;i++)
    {
      let original_park_data=await get_park_data(park_keys[i],i,local_park_file_links,fetching_data);
      let park_data=refactor_park_data(original_park_data);
      park_arr.push(park_data);
    }
    
    //Display welcome
    let welcome_heading=document.getElementById("welcome_heading") as HTMLHeadingElement;
    welcome_heading.innerHTML=`Welcome ${family_name} Family`;

    setInterval(handle_rotate_rides,1000*rotate_park_seconds);
    handle_rotate_park();
}

const rotate_park_seconds=10;

const family_name="Disney";

//Names for each park
const park_names=["Magic Kingdom","Epcot","Disney Hollywood Studios","Animal Kingdom"];

//Park API keys for each park
const park_keys=["75ea578a-adc8-4116-a54d-dccb60765ef9","47f90d2c-e191-4239-a466-5892ef59a88b","288747d1-8b4f-4a64-867e-ea7c9b27bad8","1c84a229-8862-4648-9c71-378ddd2c7693"];

//Link to local JSON data
const local_park_file_links=["magic_kingdom_sample.json","epcot_sample.json","hollywood_studios_sample.json","animal_kingdom_sample.json"];

//Sets whether we are getting real, current data or using stored data. 
const fetching_data:boolean=false;
let park_arr:any=[];

//Start with true so the data fades in
let fading_out:boolean=true;

//Start at the last part and then rotate
let target_park_index=3;

//Start at first ride and then rotate
let ride_index=0;

main()