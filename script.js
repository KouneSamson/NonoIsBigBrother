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
            BoundingBox(objet.bbox);
        });
    }
}

function BoundingBox(bounds)
{
    drawBox(bounds[0],bounds[1],bounds[2],bounds[3], CamBox);
}

function drawBox(left, top, width, height, parent)
{
    var winw = window.innerWidth;
    var oleft = winw/12;
    var nleft = left + 2*oleft/3 ;
    
    var bBox = document.createElement("div");
    
    bBox.setAttribute('class','bbox');
    bBox.style.top = top + "px";
    bBox.style.left = nleft + "px";
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