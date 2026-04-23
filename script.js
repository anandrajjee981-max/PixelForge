let board = document.querySelector("#board")
let toolbar = document.querySelector("#toolbar")
let boxBtn = document.querySelector("#box")

boxBtn.addEventListener("click", function () {
    let div = document.createElement("div")

    div.style.border = "2px solid black"
    // FIX: Use the variable uniqueId, not the string "uniqueId"
    let uniqueId = "box-" + crypto.randomUUID()
    div.id = uniqueId 

    div.style.width = "100px"
    div.style.height = "100px"
    div.style.position = "absolute"
    div.style.left = "50px"
    div.style.top = "50px"


    div.dataset.id = Date.now()
    div.classList.add("box")
    
    board.append(div)
})
let isresize = false
let isdrag = false 
let currentElement = null // Renamed from currentindex for clarity
let offsetX = 0
let offsetY = 0
let initialWidth = 0
let initialLeft = 0
let intialheight = 0 
let currentmousex = 0
let startmousex = 0
let startmousey = 0 
let intialtop = 0
let detect = null
board.addEventListener("mousedown", (e) => {

    if (e.target.classList.contains("box")) {
    startmousex = e.clientX
    startmousey = e.clientY
         currentElement = e.target  
              const rect = currentElement.getBoundingClientRect()
        const mouseXInside = e.clientX - rect.left;
        const mouseYInside = e.clientY - rect.top;
initialWidth = rect.width
initialLeft = rect.left
intialheight = rect.height 
intialtop = rect.top
        const gap = 10; // 10 pixels ki boundary check karne ke liye

        // Check if clicked near the RIGHT edge (Width area)
       if( mouseXInside > rect.width - gap){
  isresize = true
 currentElement.style.cursor = "ew-resize"
isdrag = false
detect = "right"
       }
      else if(mouseXInside < gap){
isresize = true 
isdrag = false 
detect = "left"
currentElement.style.cursor = "ew-resize"

       }
       else if(mouseYInside < gap){
isresize = true 
isdrag = false 
detect = "top"
currentElement.style.cursor = "ns-resize"

       }
       else if(mouseYInside > rect.height - gap){
isresize = true 
isdrag = false 
detect = "bottom"
currentElement.style.cursor = "ns-resize"

       }
//if mouseXInside < gap left
//if mouseYInside > height - gap bottom
//if mouseYInside < gap
        else{
             isdrag = true
      currentElement.style.cursor = "move"
isresize = false
        // Calculate where inside the box the user clicked

        offsetX = e.clientX - rect.left
        offsetY = e.clientY - rect.top
        }
 


        
    }
})

document.addEventListener("mousemove", (e) => {
if (isresize && currentElement && detect === "right") {
    let dx = e.clientX - startmousex
    currentElement.style.width = initialWidth + dx + "px"
}
else if(isresize && currentElement && detect === "left") {
    
 let  dx = e.clientX - startmousex
    currentElement.style.left = initialLeft + dx + "px"
    currentElement.style.width = initialWidth - dx + "px"
}
else if (isresize && currentElement && detect === "top") {
    let dy = e.clientY - startmousey
    currentElement.style.top = intialtop + dy + "px"
    currentElement.style.height = intialheight - dy + "px"
}
else if (isresize && currentElement && detect === "bottom") {
    let dy = e.clientY - startmousey
  
    currentElement.style.height = intialheight + dy + "px"
}

    else{

         if(!isdrag || !currentElement) return
     const rect = currentElement.getBoundingClientRect()
      
    // Calculate new position relative to the viewport/parent
    let x = e.clientX - offsetX
    let y = e.clientY - offsetY

    currentElement.style.left = x + "px"
    currentElement.style.top = y + "px"
    }
    
})

document.addEventListener("mouseup", () => {
    isresize = false
    isdrag = false
    currentElement = null
})