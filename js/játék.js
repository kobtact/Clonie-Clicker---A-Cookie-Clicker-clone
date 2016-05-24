/**
 * Created by Koszta on 2016.04.17..
 */
$(function () { //window.onload megfelelője javascriptben

    var név = window.sessionStorage.getItem("Név");
    var klónszám = 0;
    var klónszámPerSec = 0;

    var klónrekesz = 0;
    var klónrekeszÁr = 100;
    var IntervalKlónrekesz;

    var klóntöbblet = 0;
    var klóntöbbletÁr = 50;
    var IntervalKlónTöbblet;
    var random; //itt tárolódik a random generált szám, ami ha osztható 2-vel (50% esély hogy bejöjjön), aktiválja a klónszám bónuszt

    //ha eléri az alábbi mennyiséget a klónszám, hozzáadunk egy további képet
    var újklónkép = 1000;
    var klónképszám = 1;

    //IDBDatabaseben tároljuk a felhasználó adatait, aminek ha a nevét az index.html oldalon megadja, visszakaphatja (ez lesz az index)
    var db;
    var OpenRequest = window.indexedDB.open("JátékosAdatok", 1);

    OpenRequest.onupgradeneeded = function(evt) {
        db = evt.currentTarget.result;

        db.onerror = function() {
            console.log("Sikeretelen adatbázis megnyitás!");
        };

        var objectStore = db.createObjectStore("játékosok", {keyPath: "név", autoIncrement: true});
        objectStore.createIndex("név", "név", {unique: true});

        //egybe foglaljuk a felhasználói adatokat hogy hozzáadhassuk az object storeunkhoz
        var adatok = {név: név, klónszám: klónszám, klónszámPerSec: klónszámPerSec, klónrekesz: klónrekesz, klónrekeszÁr: klónrekeszÁr, IntervalKlónrekesz: IntervalKlónrekesz,
            klóntöbblet: klóntöbblet, klóntöbbletÁr: klóntöbbletÁr, IntervalKlónTöbblet: IntervalKlónTöbblet, újklónkép: újklónkép, klónképszám: klónképszám};

        objectStore.add(adatok);
        console.log("Az első adatok sikeresen hozzáadva");
    };

    OpenRequest = window.indexedDB.open("JátékosAdatok", 1);

    OpenRequest.onsuccess = function() {
        db = this.result;
        db.transaction("játékosok").objectStore("játékosok").get(név).onsuccess = function() {
            db = this.result;
            if(db.név == név) {
                klónszám = db.klónszám;
                klónszámPerSec = db.klónszámPerSec;
                klónrekesz = db.klónrekesz;
                klónrekeszÁr = db.klónrekeszÁr;
                IntervalKlónrekesz = db.IntervalKlónrekesz;
                klóntöbblet = db.klóntöbblet;
                klóntöbbletÁr = db.klóntöbbletÁr;
                IntervalKlónTöbblet = db.IntervalKlónTöbblet;
                újklónkép = db.újklónkép;
                klónképszám = db.klónképszám;
                console.log("Betöltöttük az adott játékos adatait!");
                $("#klónok").val(klónszám + "         " + klónszámPerSec + " klón/sec");
                $("#Klónrekesz_fejl").text("Klónrekesz x" + klónrekesz + " Ár: " + klónrekeszÁr);
                $("#Klóntöbblet_fejl").text("Klóntöbblet x" + klóntöbblet + " Ár: " + klóntöbbletÁr);
            }
        };
    };

    OpenRequest.onerror = function() {
        console.log("Az IDBDatabase kérés sikertelen!");
    };

    //az intervalos változókat újraindítjuk
    IntervalKlónrekesz = setInterval(function() {
        klónszám = klónszám + (4 * klónrekesz);
        $("#klónok").val(klónszám + "         " + klónszámPerSec + " klón/sec");
    }, 2000);

    IntervalKlónTöbblet = setInterval(function() {
        random = Math.floor((Math.random() * 20) + 1);
        //$("#klónok").val(klónszám + "         " + klónszámPerSec + " klón/sec");
    }, 200);

   /* //device storage inicializálás
    var sdcard = navigator.getDeviceStorage("sdcard");
    var adatokFile = new Blob([""],{type: "text/plain"});

    var request = sdcard.addNamed(adatokFile, "adatok.txt");

    request.onsuccess = function() {
        var név = this.result;
        console.log("File " + név + " sikeresen létrehozva!");
    };

    request.onerror = function () {
      console.log("A fájl már valószínűleg létre lett hozva.");
        navigator.vibrate(1000);
    };

    request = sdcard.getEditable("adatok.txt");

    request.onsuccess = function () {
        var név = this.result;
        console.log("File" + név + " sikeresen kikeresve!");
    }*/

    $("#Klónozógomb").on("click", function () {
        klónszám++;
        $("#klónok").val(klónszám + "         " + klónszámPerSec + " klón/sec");
        console.log(random);
        if(random % 5 == 0) {
            klónszám += klóntöbblet*10;
            console.log("Klóntöbblet lefutott, random = " + random);
        }
    });

    $("#Klónrekesz_fejl").on("click", function () {
        if (klónszám >= klónrekeszÁr) {
            klónszám -= klónrekeszÁr;
            klónrekesz++;
            klónrekeszÁr += Math.round(klónrekeszÁr * 0.45);
            $("#Klónrekesz_fejl").text("Klónrekesz x" + klónrekesz + " Ár: " + klónrekeszÁr);
            klónszámPerSec = (klónrekesz * 4 / 2);

            console.log("Klónrekesz vásárlás történt");
            clearInterval(IntervalKlónrekesz);
            IntervalKlónrekesz = setInterval(function() {
                klónszám = klónszám + (4 * klónrekesz);
                $("#klónok").val(klónszám + "         " + klónszámPerSec + " klón/sec");
            }, 2000);
            $("#klónok").val(klónszám + "         " + klónszámPerSec + " klón/sec");
        } else {
            alert("Nincs elég pontod! (" + klónrekeszÁr + ")");
            navigator.vibrate(1000);
        }
    });

    $("#Klóntöbblet_fejl").on("click", function () {
        if (klónszám >= klóntöbbletÁr) {
            klónszám -= klóntöbbletÁr;
            klóntöbblet++;
            klóntöbbletÁr += klóntöbbletÁr * 2;
            $("#Klóntöbblet_fejl").text("Klóntöbblet x" + klóntöbblet + " Ár: " + klóntöbbletÁr);
            //klónszámPerSec = (klónrekesz * 4 / 5);

            console.log("Klóntöbblet vásárlás történt");
            clearInterval(IntervalKlónTöbblet);
            IntervalKlónTöbblet = setInterval(function() {
                random = Math.floor((Math.random() * 20) + 1);
                //$("#klónok").val(klónszám + "         " + klónszámPerSec + " klón/sec");
            }, 200);
            $("#klónok").val(klónszám + "         " + klónszámPerSec + " klón/sec");
        } else {
            alert("Nincs elég pontod! (" + klóntöbbletÁr + ")");
            navigator.vibrate(1000);
        }
    });

    //A további klónképek kiiratása (klónszámtól függ)
    setInterval(function() {
        if(klónszám / újklónkép >= 1 && klónképszám<7) {
            $('<img src="images/Clone_trooper_II.jpg" class="klónimage">').appendTo("#Játék #Klónozókörnyéke");
            klónképszám++;
            újklónkép*=2;
            console.log("új kép hozzáadva");
        }
    }, 1000);

    setInterval(function() {
        var OpenRequest = window.indexedDB.open("JátékosAdatok", 1);

        OpenRequest.onsuccess = function() {
            db = this.result;
            var transaction = db.transaction("játékosok", "readwrite");

            transaction.oncomplete = function() {
                console.log("Tranzakció sikeres!");
            };
            transaction.onerror = function() {
                console.log("Tranzakció sikertelen!");
            };
            var objectStore = transaction.objectStore("játékosok");

            var data = objectStore.get(név);
            var adatok = {név: név, klónszám: klónszám, klónszámPerSec: klónszámPerSec, klónrekesz: klónrekesz, klónrekeszÁr: klónrekeszÁr, IntervalKlónrekesz: IntervalKlónrekesz,
                klóntöbblet: klóntöbblet, klóntöbbletÁr: klóntöbbletÁr, IntervalKlónTöbblet: IntervalKlónTöbblet, újklónkép: újklónkép, klónképszám: klónképszám};
            data = adatok;
            objectStore.put(data);
        };
    }, 10000);


});



