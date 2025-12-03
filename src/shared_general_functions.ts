function hide_element(element:HTMLElement)
{
  element.style.display="none";
}
export function rotate_park(target_park_index:number,fading_out:boolean)
{
  
  let current_info=document.getElementById("current_info") as HTMLDivElement;
  if(fading_out)
  {
    //Have the current information fade out
    current_info.classList.remove("fadein_animation");
    current_info.classList.remove("fadeout_animation");
    void current_info.offsetWidth;
    current_info.classList.add("fadeout_animation");
    setTimeout(()=>{hide_element(current_info)},2000);

    const image_link=image_links[target_park_index];
    
    //Have the park background fade out
    background_img.style.backgroundImage =`url('${image_link}')`;
    background_img.classList.remove("fadein_animation");
    background_img.classList.remove("fadeout_animation");
    void background_img.offsetWidth;
    background_img.classList.add("fadeout_animation");
  }
  else
  {
    //Show current information element
    current_info.style.display="block";

    //Have the current information fade in
    current_info.classList.remove("fadein_animation");
    current_info.classList.remove("fadeout_animation");
    void current_info.offsetWidth;
    current_info.classList.add("fadein_animation");

    const image_link=image_links[target_park_index];
    
    //Have the current background fade in
    background_img.style.backgroundImage =`url('${image_link}')`;
    background_img.classList.remove("fadein_animation");
    background_img.classList.remove("fadeout_animation");
    void background_img.offsetWidth;
    background_img.classList.add("fadein_animation");
  }
}

//Background image srcs
const image_links=["central-plaza-partners-cinderella-castle-zoom-background.jpg","epcot-spaceship-earth-zoom-background.jpg","hollywood-studios-runaway-railway-zoom-background.jpg","tree-life-animal-kingdom-zoom-background.jpg"];

let background_img=document.getElementById("background_img") as HTMLDivElement;