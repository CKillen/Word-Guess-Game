let currentWord = null;
let currentImage = null;

const letterList = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p",
"q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

let guessedLetters = [];


getGameData();


function getGameData(){
  //call list APIs
  //send to imageApi
  let listRequest = new XMLHttpRequest();

  listRequest.addEventListener("load", callWordApi)
  listRequest.open("GET" , " https://dog.ceo/api/breeds/list/all");
  listRequest.send();
}

function callWordApi()
{
  //This Api is the callback of the list and formats it in a way to call the next api call
  //for the image can use it
  let dogBreedList = formatDogBreedsApi(this.response);
  //pick random dog breed
  let currentWord = pickRandomDogBreed(dogBreedList);
  let nextApiCall = createImgCall(currentWord);
  console.log(currentWord);
  let imageRequest = new XMLHttpRequest();
  imageRequest.addEventListener("load", test)
  imageRequest.open("GET" , "https://dog.ceo/api/breed/" + nextApiCall + "/images/random");
  imageRequest.send();

  return true;
  //now for the image api request that leads into a
}

function test ()
{
  console.log(JSON.parse(this.response).message);
  var html = '<img src="' + JSON.parse(this.response).message + '">';

  document.write(html);
  return;
}

function formatDogBreedsApi(dogJSON)
{
  const parsedDogBreeds = JSON.parse(dogJSON).message;
  let dogBreedList = [];

  for(let breed in parsedDogBreeds)
  {

    if(parsedDogBreeds[breed].length !== 0)
    {
      for(let i = 0; i < parsedDogBreeds[breed].length; i++)
      {
        dogBreedList.push(parsedDogBreeds[breed][i] + " " + breed);
      }
    }
    else
    {
      dogBreedList.push(breed);
    }
  }

  return dogBreedList;
}

function pickRandomDogBreed(dogBreedList)
{
  //get random number between 0 and array length -1 (due to nature of math.floor)
  let randomNumber = Math.floor(Math.random() * Math.floor(dogBreedList.length));

  return dogBreedList[randomNumber];
}

function createImgCall(dogBreed)
{
  //if Contains space, switch words
  //if no space do nothing
  if(dogBreed.indexOf(" ") > 0)
  {
    let breed = dogBreed.substring(dogBreed.indexOf(" "), dogBreed.length);
    let subBreed = dogBreed.substring(0 , dogBreed.indexOf(" "));
    dogBreed = breed.trim() + "/" + subBreed.trim();
  }
  console.log(dogBreed);
  return dogBreed;

}
