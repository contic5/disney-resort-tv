import {rotate_park} from "./shared_general_functions";
import {get_park_data} from "./fetch_functions";
import './style.css'


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
    
    //Display welcome
    let welcome_heading=document.getElementById("welcome_heading") as HTMLHeadingElement;
    welcome_heading.innerHTML=`Welcome ${family_name} Family`;

    setInterval(handle_rotate_park,1000*rotate_park_seconds);
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

main()