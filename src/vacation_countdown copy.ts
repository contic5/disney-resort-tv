import {rotate_park} from "./shared_general_functions";
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

function get_inputs()
{
    let month_input=prompt("Enter your vacation month (1-12)") as string;
    let found_month:boolean=false;
    for(let i=0;i<months.length;i++)
    {
        if(month_input?.toUpperCase()==months[i].toLocaleUpperCase())
        {
            vacation_month=i+1;
            found_month=true;
        }
    }
    if(!found_month)
    {
        vacation_month=parseInt(month_input);
    }

    let day_input=prompt("Enter your vacation day (1-31)") as string;
    vacation_day=parseInt(day_input);

    //let year_input=prompt("Enter your vacation year") as string;
    //vacation_year=parseInt(year_input);
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

//Sets whether we are getting real, current data or using stored data. 
const fetching_data:boolean=false;
let park_arr:any=[];

//Start with true so the data fades in
let fading_out:boolean=true;

//Start at the last part and then rotate
let target_park_index=3;

let months=["January","February","March","April","May","June","July","August","September","October","November","December"];

let vacation_day=-1;
let vacation_month=-1;
let vacation_year=-1;

get_inputs();
main()