/* Uppgift U2a */

// Globala konstanter och variabler
const roomPrice = [600, 800, 950]; // Pris för rumstyperna
const facilityPrice = [40, 80, 100]; // Pris för tilläggen
let formElem; // Elementet med hela formuläret (form-elementet)

// --------------------------------------------------
// Initiera globala variabler och händelselyssnare. Lägg till info om pris.
function init() {
    formElem = document.querySelector("#booking");

    // Lägg till prisinfo och händelselyssnare för rumstyper
    formElem.roomType.forEach((room, index) => {
        let priceInfo = `(${roomPrice[index]} kr)`;
        room.parentElement.querySelector(".price").innerText = priceInfo;
        room.addEventListener("change", calculateCost);
        room.addEventListener("change", checkIfFamilyRoom);
    });

    // Lägg till prisinfo och händelselyssnare för tillägg
    formElem.facility.forEach((facility, index) => {
        let priceInfo = `(${facilityPrice[index]} kr)`;
        facility.parentElement.querySelector(".price").innerText = priceInfo;
        facility.addEventListener("change", calculateCost);
    });

    // Händelselyssnare för antal nätter
    formElem.nrOfNights.addEventListener("change", calculateCost);

    // Händelselyssnare för postnummer och telefonnummer
    formElem.zipcode.addEventListener("blur", checkField);
    formElem.telephone.addEventListener("blur", checkField);

    // Händelselyssnare för kampanjkod
    formElem.campaigncode.addEventListener("focus", checkCampaign);
    formElem.campaigncode.addEventListener("keyup", checkCampaign);
    formElem.campaigncode.addEventListener("blur", endCheckCampaign);

    // Initiera första kostnadsberäkningen
    calculateCost();
} // Slut init

window.addEventListener("load", init);

// --------------------------------------------------
// Beräkna total kostnad för valda alternativ
function calculateCost() {
    checkIfFamilyRoom(); // Kontrollera inställningar för familjerum

    let totalCost = 0;

    // Kostnad för rum
    formElem.roomType.forEach((room, index) => {
        if (room.checked) totalCost += roomPrice[index];
    });

    // Kostnad för tillägg
    formElem.facility.forEach((facility, index) => {
        if (facility.checked) totalCost += facilityPrice[index];
    });

    // Multiplicera med antal nätter
    totalCost *= parseInt(formElem.nrOfNights.value) || 1;

    // Uppdatera total kostnad
    document.getElementById("totalCost").innerText = `${totalCost} kr`;
} // Slut calculateCost

// --------------------------------------------------
// Kontrollera familjerum och relaterade alternativ
function checkIfFamilyRoom() {
    const familyRoomSelected = formElem.roomType[2].checked; // Familjerum
    const seaViewCheckbox = formElem.querySelector("input[name='facility'][value='sjöutsikt']");
    const personsMenu = formElem.querySelector("select[name='persons']");

    if (familyRoomSelected) {
        seaViewCheckbox.checked = false;
        seaViewCheckbox.disabled = true;
        personsMenu.disabled = false;
    } else {
        seaViewCheckbox.disabled = false;
        personsMenu.disabled = true;
    }
} // Slut checkIfFamilyRoom

// --------------------------------------------------
// Kontrollera postnummer och telefonnummer
function checkField(e) {
    const field = e.target;
    const fieldNames = ["zipcode", "telephone"];
    const re = [
        /^\d{5}$/, // Postnummer: exakt 5 siffror
        /^0\d{6,11}$/ // Telefon: börjar med 0, 6-11 siffror
    ];
    const errMsg = [
        "Postnumret måste bestå av exakt 5 siffror.",
        "Telefonnumret måste börja med 0 och följas av 6-11 siffror."
    ];
    let ix = fieldNames.indexOf(field.name);
    let errMsgElem = field.nextElementSibling;

    if (!re[ix].test(field.value)) {
        errMsgElem.innerText = errMsg[ix];
        field.style.backgroundColor = "#fdd";
        return false;
    } else {
        errMsgElem.innerText = "";
        field.style.backgroundColor = "";
        return true;
    }
} // Slut checkField

// --------------------------------------------------
// Validera kampanjkod
function checkCampaign() {
    const campaignField = formElem.campaigncode;
    const regex = /^[A-Za-z]{3}-\d{2}-[A-Za-z]\d$/;

    campaignField.style.backgroundColor = regex.test(campaignField.value) ? "#6F9" : "#F99";
} // Slut checkCampaign

// --------------------------------------------------
// Avsluta validering av kampanjkod
function endCheckCampaign() {
    const campaignField = formElem.campaigncode;
    campaignField.style.backgroundColor = "";
    campaignField.value = campaignField.value.toUpperCase();
} // Slut endCheckCampaign
