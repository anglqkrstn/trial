// Function to access microphone
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    const audioContext = new AudioContext();
    const microphone = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    microphone.connect(analyser);
    analyser.fftSize = 256;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function detectBlow() {
        analyser.getByteTimeDomainData(dataArray);

        // Calculate volume based on microphone input
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += (dataArray[i] - 128) * (dataArray[i] - 128);
        }
        const volume = Math.sqrt(sum / bufferLength);

        // Threshold to detect blow (you can adjust this)
        if (volume > 30) {
            blowOutCandle();
        }

        requestAnimationFrame(detectBlow);
    }

    detectBlow();
  })
  .catch(function(err) {
    console.error("Error accessing microphone: " + err);
  });

function blowOutCandle() {
    const flame = document.getElementById('flame');
    const message = document.getElementById('message');
    const cardContent = document.getElementById('cardContent');
    
    // Blow out the candle by fading the flame
    flame.style.opacity = '0';

    // Flip the card to reveal the hidden message
    cardContent.style.transform = 'rotateY(180deg)';

    // Reveal the hidden message after the card flips
    setTimeout(() => {
        message.style.opacity = '1'; // Fade in the hidden message
    }, 1000); // Delay to allow time for flip animation
}

// Add an event listener to the "Click here for a birthday surprise" link
document.getElementById("revealSurprise").addEventListener("click", function() {
    // Reveal the Hilux image by changing its display style
    document.getElementById("hiluxImage").style.display = "block";
});

// Add an event listener to the "gift" word
document.getElementById("giftLink").addEventListener("click", function() {
    // Reveal the additional gift link
    document.getElementById("additionalGift").style.display = "block";
});
