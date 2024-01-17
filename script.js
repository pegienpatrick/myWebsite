


        // Default values
        let defaultEngineWeight = 500;
        let defaultWingsWeight = 300;
        let defaultTailWeight = 200;

        // Current values
        let currentEngineWeight = defaultEngineWeight;
        let currentWingsWeight = defaultWingsWeight;
        let currentTailWeight = defaultTailWeight;



travelled=0;
gameOver=false;


controls = {
        speedInput: document.getElementById('speedInput'),
    };

    keyUp=false;
    keyDown=false;

    startButton=document.getElementById('startButton')
        //  Diagram of a simple aircraft

        document.addEventListener('DOMContentLoaded', function () {
        canvas = document.getElementById('aircraftCanvas');
        ctx = canvas.getContext('2d');
        header=document.getElementById('header');




        // Number of grass-like shapes
        numberOfShapes = 100;

        // Array to store information about each shape
        vegetation = [];

        let x
        let y

        // Initialize vegetation
        for (let i = 0; i < numberOfShapes; i++) {
            vegetation.push({
                x: Math.random() * -canvas.width,
                y: canvas.height - 30 - Math.random() * 20,
                height: 20 + Math.random() * 20,
                width: 3 + Math.random() * 3,
                speed: 1 + Math.random() * 2,
            });
        }


        //draw obstacles
        numberOfObstacles=10;

        obstacles=[]

        for(var k=0;k<numberOfObstacles;k++)
        {
            obstacles.push({
                x:canvas.width/4*k,
                y: Math.random() * canvas.height
                });
        }


       


        locationx=0;
        locationY=30;

        gravity=0.05;
        acceleration=0.2;

        expectedY=locationY;

        // Load images
        bodyImage = new Image();
        bodyImage.src = 'images/helikoptaBody.png';  // Replace with the actual URL

        wingsImage= new Image();
        wingsImage.src= 'images/helikoptaWings.png'
        rotationAngle=0;


        fullPlane=new Image();
        fullPlane.src='images/helikopta.png'

        flipped=false;
        stopped=true;

         let speed = 2;


        //below are for sound
        let audioContext;
        let oscillator1;
        let oscillator2;
        let gainNode1;
        let gainNode2;


        var BodyWidth=canvas.width/4;

        var wingsWidth=BodyWidth*wingsImage.width/bodyImage.width;

        var Bodyheight=bodyImage.height/bodyImage.width*BodyWidth;

        var WingsHeight=wingsImage.height/wingsImage.width*wingsWidth;





        // Wait for images to load
        Promise.all([loadImage(bodyImage),loadImage(wingsImage)])
            .then(() => {
                // drawAircraft();
               startButton.addEventListener('click', function () {
                stopped=!stopped;
                if(!stopped)
                {
                     startSound();
                     animate();
                     
                     startButton.innerHTML='stop'
                 }
                 else{

                    oscillator1.stop();
                    oscillator2.stop(); 

                    startButton.innerHTML='start'
                 }

                 

               });

            });

        function loadImage(image) {
            return new Promise((resolve) => {
                image.onload = resolve;
            });
        }




        function animate() {
            rotationAngle += Math.PI / 180; // Rotate by 1 degree per frame

            drawAircraft();
            // requestAnimationFrame(animate);
            if(gameOver)
            {
                // ctx.clearRect(0, 0, canvas.width, canvas.height);
               
                gameOver=false;
                stopped=true
                startButton.innerHTML="Restart"
                oscillator1.stop();
                oscillator2.stop();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
               ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "20px Arial";

                
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                
                const text = "Game Over " + travelled + " M";

                
                ctx.fillText(text, centerX, centerY);

                
                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                travelled = 0;

                return;
            }

            if(!stopped)
                setTimeout(animate, 100 / speed); 


        }


        function drawAircraft() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            

            if(locationY>expectedY)
                locationY-=1/(acceleration*1);

            if(locationY<expectedY)
                locationY+=1/(gravity*1);

            locationY=expectedY;


            BodyWidth=canvas.width/4;

            wingsWidth=BodyWidth*wingsImage.width/bodyImage.width;

            Bodyheight=bodyImage.height/bodyImage.width*BodyWidth;
            WingsHeight=wingsImage.height/wingsImage.width*wingsWidth;



            locationx=canvas.width/2-BodyWidth/2

            ctx.imageSmoothingEnabled = false;

            ctx.save();

            if(flipped)
            {

            ctx.translate(locationx*2+wingsWidth/2+BodyWidth/10+7 ,-WingsHeight*2-7);
            ctx.rotate(Math.PI / 180*-15);
            // ctx.rotate(rotationAngle);
            ctx.scale(-1,1)
        }
        else{
            ctx.scale(1,1)

        }


            flipped=!flipped;

            ctx.drawImage(wingsImage,locationx,locationY,wingsWidth,WingsHeight)


                ctx.restore();
            // Draw aircraft images
            ctx.drawImage(bodyImage, locationx+wingsWidth/10, locationY+WingsHeight/2,BodyWidth,Bodyheight);

            // console.log("finished drawing "+(180*rotationAngle)/Math.PI)




            drawVegetation();


            let playheight=canvas.height -Bodyheight- WingsHeight;

            let normalWeight=800;     


            let totalWeight=currentEngineWeight+currentWingsWeight+currentTailWeight;

            let weightForce=(totalWeight- normalWeight)/normalWeight*gravity;




            expectedY+=(gravity+weightForce)*0.1*playheight;

            if(keyUp)
                 expectedY-=(acceleration-weightForce)*0.1*playheight;


            if(keyDown)
                expectedY+=(acceleration+weightForce)*0.1*playheight;


             // console.log("key up is "+keyUp)

            travelled++;

            header.innerHTML=travelled+" M Travelled"


            drawObstacles();
            
        }









//listen to speed

// Handle user input for adjusting speed
    controls.speedInput.addEventListener('input', function () {
        speed = parseInt(controls.speedInput.value, 10);
        oscillator1.frequency.value=speed*5;
        oscillator2.frequency.value=speed*5;

    });



    // Event listener for keydown
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        // Set the flag to true when the Up arrow key is pressed
        event.preventDefault();
        keyUp = true;
        return;
    }
});

// Event listener for keyup
document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowUp') {
        // Set the flag to false when the Up arrow key is released
        event.preventDefault();
        keyUp = false;
        return;
       
    }
});



     // Event listener for keydown
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowDown') {
        // Set the flag to true when the Up arrow key is pressed
        event.preventDefault();
        keyDown = true;

        return;
        
    }
});

// Event listener for keyup
document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowDown') {
        // Set the flag to false when the Up arrow key is released
        event.preventDefault();
        keyDown = false;
        return;
       
    }
});




document.getElementById('engineWeight').value=defaultEngineWeight;
document.getElementById('wingsWeight').value=defaultWingsWeight;
document.getElementById('tailWeight').value=defaultTailWeight;



document.getElementById('confirmButton').addEventListener('click', function() {
            // Update current values with user input
            currentEngineWeight = parseFloat(document.getElementById('engineWeight').value) || defaultEngineWeight;
            currentWingsWeight = parseFloat(document.getElementById('wingsWeight').value) || defaultWingsWeight;
            currentTailWeight = parseFloat(document.getElementById('tailWeight').value) || defaultTailWeight;

        
        });































        function startSound()
        {
            audioContext=null;
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();

                // Oscillator 1
                oscillator1 = audioContext.createOscillator();
                gainNode1 = audioContext.createGain();
                oscillator1.type = 'sawtooth';
                oscillator1.frequency.value = 200;

                // Oscillator 2
                oscillator2 = audioContext.createOscillator();
                gainNode2 = audioContext.createGain();
                oscillator2.type = 'sine'; // Changed to sine for a smoother sound
                oscillator2.frequency.value = 400;

                // Connect nodes
                oscillator1.connect(gainNode1);
                oscillator2.connect(gainNode2);
                gainNode1.connect(audioContext.destination);
                gainNode2.connect(audioContext.destination);
            }

            // Set up modulation (vibrato effect)
            oscillator1.connect(gainNode1.gain);
            oscillator2.connect(gainNode2.gain);
            oscillator1.start();
            oscillator2.start();

            // Apply vibrato effect by modulating the gain
            gainNode1.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode1.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.2);
            gainNode1.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

            gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode2.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.3);
            gainNode2.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

            // Adjust the speed, pitch, and volume based on the user input
            const baseFrequency = 100;
            const speedMultiplier = parseFloat(speedInput.value);

            oscillator1.frequency.setValueAtTime(baseFrequency * speedMultiplier, audioContext.currentTime);
            oscillator2.frequency.setValueAtTime((baseFrequency * speedMultiplier) * 1.5, audioContext.currentTime);

            gainNode1.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode1.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 1);

            gainNode2.gain.setValueAtTime(0.4, audioContext.currentTime);
            gainNode2.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 1);

            oscillator1.frequency.value=speed*5;
            oscillator2.frequency.value=speed*5;

        }



lastInsert=0;
        function drawVegetation() {
            // ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw each grass-like shape
            for (const shape of vegetation) {
                ctx.fillStyle = '#008000'; // Green color
                ctx.fillRect(shape.x, shape.y, shape.width, shape.height);

                // Move the shape horizontally
                shape.x += shape.speed;

                // Reset position when the shape moves out of the canvas
                if (shape.x > canvas.width) {
                    shape.x = -shape.width;
                }
            }

            // requestAnimationFrame(drawVegetation);
        }


        function drawObstacles(){


            var last=0;

            var totalWidth= BodyWidth;
            var totalHeight=WingsHeight+Bodyheight;

            var canvasX=canvas.width/2;



            for (var obstacle of obstacles) {
                // console.log(obstacle)

                var obstacleX=-obstacle.x+travelled*2;

               




                if(obstacle.x%50==0)
                {
                    ctx.beginPath();
                    ctx.arc(obstacleX, obstacle.y, 10, 0, Math.PI * 2);  // Using arc() to draw a circle
                    ctx.fillStyle = 'red';  // Set the color, you can customize this
                    ctx.fill();  // Fill the circle
                    ctx.closePath();
                    last=obstacle.x


                    if(obstacleX>canvasX - totalWidth/2 - 5 &&obstacleX<canvasX + totalWidth/2 + 5 )
                    {
                        if( obstacle.y >= expectedY && obstacle.y <= expectedY+totalHeight)
                        {
                            gameOver=true;

                            // console.log("game Over");
                            // stopped=true;
                        }
                    }
                }
                else{

                    fplaneWidth=20;

                    fplaneHeight=fplaneWidth*(fullPlane.height/fullPlane.width);

                    ctx.drawImage(fullPlane,obstacleX, obstacle.y,fplaneWidth,fplaneHeight);

                   if(obstacleX>canvasX - totalWidth/2  &&obstacleX<canvasX + totalWidth/2  )
                    {
                        if( obstacle.y >= expectedY- - fplaneHeight && obstacle.y <= expectedY+totalHeight- fplaneHeight )
                        {
                            gameOver=true;

                            // console.log("game Over");
                            // stopped=true;
                        }
                    }

                }

            }


            // for(var k=0;k<;k++)
            if(travelled-lastInsert>30)
            {

                lastInsert=travelled;
                obstacles.push({
                    x:travelled*2+canvas.width,
                    y: Math.random()* canvas.height
                    });

            }


            // if (obstacles.length > 100) {
            //     // Remove the first ten elements from the array
            //     obstacles.splice(90, 10);
            // }





        }











    });