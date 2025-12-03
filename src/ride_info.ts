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
const rotate_park_seconds=10;

function main()
{
    setInterval(handle_rotate_park,1000*rotate_park_seconds);
    handle_rotate_park();
}

//Start with true so the data fades in
let fading_out:boolean=true;

//Start at the last part and then rotate
let target_park_index=3;

main()