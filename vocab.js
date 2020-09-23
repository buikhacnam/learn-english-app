// Speaker:

const voiceList = document.querySelector('#voiceList');
const btnSpeak = document.querySelector('#btnSpeak');
let synth = window.speechSynthesis;
let voices = [];

if(speechSynthesis !== undefined){
            speechSynthesis.onvoiceschanged = PopulateVoices;
}

function PopulateVoices(){
            voices = synth.getVoices();
            let selectedIndex = voiceList.selectedIndex < 0 ? 0 : voiceList.selectedIndex;
            voiceList.innerHTML = '';
            
            voices.forEach((voice)=>{
                let listItem = document.createElement('option');
                listItem.textContent = voice.name;
                
               listItem.setAttribute('data-lang', voice.lang);
               listItem.setAttribute('data-name', voice.name);
                voiceList.appendChild(listItem);
                
            });

          voiceList.selectedIndex = selectedIndex;
}

PopulateVoices();


btnSpeak.addEventListener('click', speakNow);

function speakNow() {
	let toSpeak = new SpeechSynthesisUtterance(say);
            let selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
       
            voices.forEach((voice)=>{
                if(voice.name === selectedVoiceName){
                    toSpeak.voice = voice;
                }
            });
            synth.speak(toSpeak);
}

function speakId(title) {
	let toSpeak = new SpeechSynthesisUtterance(title);
            let selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
       
            voices.forEach((voice)=>{
                if(voice.name === selectedVoiceName){
                    toSpeak.voice = voice;
                }
            });
            synth.speak(toSpeak);
}



//filter the unwiped item:
let say = "your list is empty";
let newArr = [];
let unwipedList;
function ulList(arr) {
		 unwipedList = arr.filter(num => {
		return num.trash == false;
	})
	let random;
	if (unwipedList.length > 0) {
		do {
			random = randomGenerator(unwipedList);
		} while (newArr.includes(random));
			newArr.push(random);
			if(newArr.length == unwipedList.length || unwipedList.length == 1){
				newArr = [];
			}
		say = unwipedList[random].title;
		getHint(unwipedList[random].meaning);
	} else {
		say = "your list is empty"
		getHint("Add new words to the list below");
	}
	
}	


function randomGenerator(arr) {
	return Math.floor(Math.random() * arr.length);
}



//input answer:
const fill = document.getElementById('fill');
const btnNext = document.getElementById('btnNext');
const status = document.getElementById('status');
const hint = document.getElementById('hint');
const confirm = document.getElementById('confirm');
const form = document.querySelector('.form-control');
const submit = document.getElementById("submit");

fill.addEventListener("keypress", handleAnswer);
submit.addEventListener("click", handleAnswer)

function handleAnswer(e) {
	if (e.which == 13 || e.keyCode == 13 || event.target.attributes.id.value == "submit") {
		let result = fill.value.trim().toLowerCase();
		if (unwipedList.length > 0) {
			checkResult(result);
			result == "";
		}
	}
}

function checkResult(result) {
	if (result === say) {
		setSuccessFor(fill);

	} else {
		setErrorFor(fill);
	}
}

function setSuccessFor(input) {
	const formControl = input.parentNode;
	formControl.className = "form-control success";
	speakId(`oh yes ${say} `)

}

function setErrorFor(input) {
	const formControl = input.parentNode;
    formControl.className = "form-control error";
    speakId(`no no not ${fill.value}`)
}


btnNext.addEventListener("click", handleNext);

function handleNext() {	
		ulList(ul);
		form.className = "form-control";
		fill.value= "";		
}

function getHint(word){
		return hint.innerText = `"${word}"`;
}

window.addEventListener('load', () => {
	ulList(ul);
});



// -----------------------List-------------------------------
const clear = document.getElementById("clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");
const input2 = document.getElementById("input2");
const plus = document.getElementById("plus");




//submitting a new item by clicking the plus icon:
plus.addEventListener("click", newWord); 

//default item
const defaultItem = [
	{
		title: "long time no see", 
		meaning: "lâu rồi không gặp anh", 
		trash: false, 
		id: 0
	},

	{
		title: "software developer", 
		meaning: "kĩ sư phần mềm", 
		trash: false, 
		id: 1
	},

	{
		
		title: "good morning", 
		meaning: "", 
		trash: false,  
		id: 2
	}
]
// this ul array contains all the items on the list:
let ul = [];

//get data from the key "main" from localstorage: 
let data = localStorage.getItem("main");

if(data){
    ul = JSON.parse(data); // convert a "string" object to a real object
    load(ul);   // load each of the object in ul array
} else  {
    console.log("reset");
    reset();

}

function load(array) {
	array.forEach(obj => {
		addWord(obj);
	})
}




//set up object item and push it in ul array and display function:
function newWord(event) {
	

	let meaning = input2.value;
	
	let li = {
		title: "",
		meaning: meaning,
		trash: false,
		id: ul.length	
	}

	if(event.target.attributes.id.value == "plus") {
		const title = input.value.trim().toLowerCase();
		if (title == "") {
			input.blur();
		} else {
			li.title = title;
			ul.push(li);
			addWord(li);
			
		}	
	}	
}

//display the list:
function addWord(obj) {
	if (obj.trash == false) {
	const position = "afterbegin";
	
	const item = ` <li class="item">
                     <p class="text">${obj.title}</p>
                     <p class="speak"><i class="fas fa-volume-up" job="speak" id="${obj.id}"></i></p>
                     <i class="fas fa-trash-alt erase" job="delete" id="${obj.id}"></i>  
                     <p class="meaning">${obj.meaning}</p>
               		</li>`;
		list.insertAdjacentHTML(position, item);
		localStorage.setItem("main", JSON.stringify(ul));
		input.value = "";
		input2.value="";
	} else {
		return "";
	}
}

// when you click on "speak" or "trash" icon:
list.addEventListener("click", function(event)  {
	const element = event.target;
	const deleteOrComplete = element.attributes.job.value;

	if(deleteOrComplete == "speak"){
		speakWord(element);
	} else if (deleteOrComplete == "delete"){
		deleteWord(element);
	}
	localStorage.setItem("main", JSON.stringify(ul));
})

// toggle classes of the item when it's deleted or choose element to speak :

function speakWord(element) {
    let title = ul[parseInt(element.attributes.id.value)].title;
    speakId(title);

    //ulList(ul);
}

function deleteWord(element) {
	element.parentNode.classList.toggle("erase-transition");
	ul[parseInt(element.attributes.id.value)].trash = true;

	//ulList(ul);
	
	setTimeout(() => {
		element.parentNode.parentNode.removeChild(element.parentNode);
	}, 700);
}

// reset:
clear.addEventListener("click", reset);

function reset() {
	
	window.localStorage.removeItem("main");
	ul = defaultItem;
	localStorage.setItem("main", JSON.stringify(ul));
	location.reload();
	console.log("reset");
}



