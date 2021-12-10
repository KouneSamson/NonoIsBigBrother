var model = undefined;
cocoSsd.load().then(function (loadedModel) {
    model = loadedModel;
  });
const video = document.querySelector("#webcam");

var camIsOn = false;

var animation = undefined;
var Webcam = document.querySelector("#webc");
var CamBox = document.querySelector("#Camera");
var progressB = document.querySelector("#outils");
var boxSet = [];

function CameraOn ()
{
    camIsOn = true;
    console.log("Camera On");
    if (navigator.mediaDevices.getUserMedia)
    {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream)
        {
            video.srcObject = stream;

            Webcam.style.zIndex = "0";

            video.addEventListener("loadeddata", (detection = () =>{
                if (camIsOn){
                    model.detect(video).then(predictions =>{
                        console.log('Predictions: ', predictions);
                        exPredictions(predictions);
                    });
                    window.requestAnimationFrame(detection);
                }
            }));
            
        })
        .catch(function (err0r)
        {
            console.log("Something went wrong!");
        });
    }
}

function CameraOff()
{
    camIsOn = false;
    Webcam.style.zIndex = "-1";
    if (video.srcObject != null)
    {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(function(track){
            track.stop();
        });
    }
    video.srcObject = null;
    console.log("Camera Off");
    clearboxSet();
    progressB.innerHTML = "<h3 class='title has-text-centered has-text-white pb-2'>Objets Reconnus</h3>"
}

function exPredictions(predicts)
{
    clearboxSet();

    progressB.innerHTML = "<h3 class='title has-text-centered has-text-white pb-2'>Objets Reconnus</h3>"

    if(predicts.length != 0)
    {
        for(let i =0; i<predicts.length; i++)
        {
            if(predicts[i].score > 0.66)
            {
                BoundingBox(predicts[i].bbox, predicts[i]);
            }
        }
        // predicts.forEach(function(objet){
        //     if(objet.score > 0.66)
        //     {
        //         BoundingBox(objet.bbox,objet);
        //     }
        // });
    }
}

function BoundingBox(bounds, objD)
{
    var objName = document.createElement("p");
    var score = Math.round(parseFloat(objD.score)*100);
    objName.innerText = objD.class + " - " + score + "%";
    objName.style.color = "#ff00ff";
    objName.style.backgroundColor = "#000000aa";
    objName.style.textAlign = "center";
    drawBox(bounds[0],bounds[1],bounds[2],bounds[3], CamBox, objName);

    progressB.innerHTML +=
    `<p class="pname m-2"><b>` + objD.class + " " + score + "% " + `</b><progress class="progress is-link" value="` + score + `" max="100"></progress></p>`;
}

function drawBox(left, top, width, height, parent, objName)
{    
    var bBox = document.createElement("div");

    bBox.appendChild(objName);

    bBox.setAttribute('class','bbox');
    bBox.style.top = top + "px";
    bBox.style.left = left + "px";
    bBox.style.width = width + "px";
    bBox.style.height = height + "px";
    
    parent.appendChild(bBox);
    
    boxSet.push(bBox);
}

function clearboxSet()
{
    boxSet.forEach(function(box){
        box.remove();
    });
}

document.querySelector("#CamOn").addEventListener("click",CameraOn)

document.querySelector("#CamOff").addEventListener("click",CameraOff)