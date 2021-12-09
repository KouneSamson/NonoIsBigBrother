var model = undefined;
cocoSsd.load().then(function (loadedModel) {
    model = loadedModel;
  });
const video = document.querySelector("#webcam");

var camIsOn = false;

var animation = undefined;
var CamBox = document.querySelector("#Camera");
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
}

function exPredictions(predicts)
{
    clearboxSet();

    if(predicts.length != 0)
    {
        predicts.forEach(function(objet){
            if(objet.score > 0.66)
            {
                BoundingBox(objet.bbox,objet);
            }
        });
    }
}

function BoundingBox(bounds, objD)
{
    var objName = document.createElement("p");
    objName.innerText = objD.class + " - " + Math.round(parseFloat(objD.score)*100) + "%";
    objName.style.color = "#ff00ff";
    objName.style.backgroundColor = "#000000aa";
    drawBox(bounds[0],bounds[1],bounds[2],bounds[3], CamBox, objName);
}

function drawBox(left, top, width, height, parent, objName)
{
    var winw = window.innerWidth;
    var oleft = winw/12;
    var nleft = left + oleft ;
    
    var bBox = document.createElement("div");

    bBox.appendChild(objName);

    bBox.setAttribute('class','bbox');
    bBox.style.top = top + "px";
    bBox.style.left = left + "px";
    //bBox.style.width = "100%";
    //bBox.style.height = "100%";
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