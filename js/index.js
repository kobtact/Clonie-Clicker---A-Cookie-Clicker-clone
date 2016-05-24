/**
 * Created by Koszta on 2016.04.17..
 */
$(function() {
    var sdcard = navigator.getDeviceStorage("sdcard");
    var request = sdcard.getEditable("adatok.txt");

    request.onsuccess = function() {
        console.log("A fájl kikeresése sikeres!");
    };

    request.onerror = function() {
        console.log("A fájl kikeresése sikertelen!");
    };

    document.getElementById("Start").addEventListener("click", function() {
        //elmentjük a játékos nevét sessionStorageba, hogy a játék oldalon is hozzáférjünk
        window.sessionStorage.setItem("Név", document.getElementById("Név").value);
        window.location.href = "játék.html";
    });
});
