let todaysDate; // storing todays date

const getCurrentImageOfTheDay = ()=>{

    let currentDate = new Date();
    let data = currentDate.toLocaleString();
    let dateTimeArr = data.split(",");
    const currentDay = dateTimeArr[0].trim().split("/").reverse().join("-");    //yyyy-mm-dd
    console.log(currentDay);
    todaysDate =currentDay;

    getImageOfTheDay(currentDay);   
}

window.onload = getCurrentImageOfTheDay;
addSearchToHistory();



async function getImageOfTheDay(dateCurrent){

   const API_KEY = "Erdwe1jxqJKziCAXOVxQF4G1q5WEFCePm7ZGyYe7";
   const response = await fetch(`https://api.nasa.gov/planetary/apod?date=${dateCurrent}&api_key=${API_KEY}`);
   const result = await response.json();
   console.log(result);
   

   //to handle whether to display picture of the day or date when pic was taken
   if(dateCurrent !== todaysDate){
    const heading = document.getElementById("main-title");
    heading.innerHTML = `picture on ${dateCurrent}`;
   }
   else{
    const heading = document.getElementById("main-title");
    heading.innerHTML = `NASA Picture of the day`;
   }

   const ImageContainer = document.getElementById("current-image-container");
   ImageContainer.innerHTML = "";

   const imgCon = document.createElement("div");
   imgCon.className = "img-con";

   const imageEle = document.createElement("img");
   imageEle.className="nasa-img";
   imageEle.src=`${result.url}`;
   imgCon.appendChild(imageEle);

   const title = document.createElement("div");
   title.className = "title";
   title.innerText = `${result.title}`;
  
   const desp = document.createElement("div");
   desp.className = "description";
   desp.innerText = `${result.explanation}`;
   
   ImageContainer.append(imgCon,title,desp);
}


// dealing with the form data

const formElement = document.getElementById("search-form");
formElement.addEventListener('submit',getFormData);


function getFormData(e){
    e.preventDefault();
    const selectedDate = document.getElementById("search-input").value;

    // add to ui
    getImageOfTheDay(selectedDate);

    // call to update storage with cutternt latest date
    saveSearch(selectedDate);
}


function saveSearch(SelectedDate){
    let dateArray;

    let StorageData = localStorage.getItem("storedDates");  // get previous data form storage
    if(StorageData){
       dateArray = JSON.parse(StorageData);
    }
    else{
        dateArray=[];  // if no previus data assign default
    }
    
    // check for duplicates
    let isPresent = false;
    dateArray.forEach((obj)=>{
              if(obj.date === SelectedDate){
                isPresent=true;
              }
    });

    if(!isPresent){
       dateArray.push({"date":SelectedDate}); 
    }
    
    // update storage
    localStorage.setItem("storedDates",JSON.stringify(dateArray));

    addSearchToHistory();
}


function addSearchToHistory(){
    const ulList = document.getElementById("search-history");
      ulList.innerHTML = "";

   let storageData = JSON.parse(localStorage.getItem("storedDates"));

   if(storageData)
   {
    storageData.forEach((dateObj)=>{
                const liEle = document.createElement("li");
                liEle.innerText = dateObj.date;

                liEle.addEventListener('click',(e)=>{
                    let clickedLiDate = e.target.innerText.trim();
                    getImageOfTheDay(clickedLiDate);
                });
      ulList.append(liEle);
            });
   }
}
