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

/*
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
*/

function calculate_time_difference()
{
    let now:Date=new Date();
    let milliseconds_between:number=vacation_day.getTime()-now.getTime();
    const days_left=Math.floor(milliseconds_between/(24*60*60*1000));
    milliseconds_between-=days_left*(24*60*60*1000);

    const hours_left=Math.floor(milliseconds_between/(60*60*1000));
    milliseconds_between-=hours_left*(60*60*1000);

    const minutes_left=Math.floor(milliseconds_between/(60*1000));
    milliseconds_between-=minutes_left*(60*1000);

    let minutes_left_written=minutes_left.toString();
    if(minutes_left_written.length<2)
    {
        minutes_left_written="0"+minutes_left_written;
    }

    const seconds_left=Math.floor(milliseconds_between/(1000));
    let seconds_left_written=seconds_left.toString();
    if(seconds_left_written.length<2)
    {
        seconds_left_written="0"+seconds_left_written;
    }

    milliseconds_between-=seconds_left*(1000);

    document.getElementById("days_left")!.innerHTML=`${days_left} Days`;
    document.getElementById("hours_left")!.innerHTML=`${hours_left}`;
    document.getElementById("minutes_left")!.innerHTML=`${minutes_left_written}`;
    document.getElementById("seconds_left")!.innerHTML=`${seconds_left_written}`;
}
export function update_vacation_day()
{
    let vacation_day_written:string=vacation_day_input.value;
    vacation_day=new Date(vacation_day_written);
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
    setInterval(calculate_time_difference,1000);
    handle_rotate_park();
    calculate_time_difference();
}

const rotate_park_seconds=10;

const family_name="Disney";

//Sets whether we are getting real, current data or using stored data. 
const fetching_data:boolean=false;

//Start with true so the data fades in
let fading_out:boolean=true;

//Start at the last part and then rotate
let target_park_index=3;
let vacation_day:Date=new Date();
vacation_day.setDate(vacation_day.getDate() + 180);

let vacation_day_input=document.getElementById("vacation_day") as HTMLInputElement;
//vacation_day_input.value=`${vacation_day.getFullYear()}-${vacation_day.getMonth()}-${vacation_day.getDay()}`;

vacation_day_input.value=vacation_day.toISOString().slice(0, 10);
main()