// Immediately invoked function expression
// to not pollute the global scope
(function() {
  // Constants for wheel sections
  const sections = [
    "Try Again",
    "Try Again",
    "WIN",
    "Try Again",
    "WIN",
    "Try Again",
    "WIN",
    "Try Again",
    "Try Again",
    "Try Again",
    "WIN",
    "Try Again"
  ];

  // Wheel elements
  const wheel = document.querySelector('.wheel');
  const startButton = document.querySelector('.button');
  const pointer = document.querySelector('.marker');

  // Initialize spin count
  let spinCount = 0;

  // Disable start button initially
  startButton.disabled = true;

  // Calculate a random spin result
  function getSpinResult() {
    const randomIndex = Math.floor(Math.random() * sections.length);
    return sections[randomIndex];
  }

  // AJAX call function
  function getPrize() {
    // todo Replace the URL with the actual endpoint for prize retrieval
    // const url = 'https://whee/api/prize';
    const url = 'prize.json';

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        // Handle the prize data
        console.log('Prize:', data);
        // Display the prize to the user
        const resultElement = document.querySelector('.result');
        resultElement.textContent = `Congratulations! You won ${data.prize}!`;
      })
      .catch(error => {
        console.error('Error:', error);
        // Display error message to the user
        const resultElement = document.querySelector('.result');
        resultElement.textContent = 'An error occurred. Please try again later.';
      });
  }

  // Start the spin animation
  function startSpin() {
    // Disable start button during spin
    startButton.disabled = true;

    // Calculate a new rotation between 5000 and 10000
    const deg = Math.floor(5000 + Math.random() * 5000);

    // Set the transition on the wheel
    wheel.style.transition = 'all 10s ease-out';

    // Rotate the wheel
    wheel.style.transform = `rotate(${deg}deg)`;

    // Apply the blur
    wheel.classList.add('blur');

    // Remove any previous result message
    const resultElement = document.querySelector('.result');
    resultElement.textContent = '';

    // Wait for 1 second and stop the spin
    setTimeout(stopSpin, 1000);
  }

  // Stop the spin animation
  function stopSpin() {
    // Remove blur
    wheel.classList.remove('blur');

    // Disable pointer events during stop
    pointer.style.pointerEvents = 'none';

    // Need to set transition to none as we want to rotate instantly
    wheel.style.transition = 'none';

    // Calculate the actual rotation based on spin count
    const actualDeg = 360 - (spinCount * 30) % 360;

    // Set the real rotation instantly without animation
    wheel.style.transform = `rotate(${actualDeg}deg)`;

    // Increase spin count
    spinCount++;

    // Enable pointer events after the wheel has stopped
    pointer.style.pointerEvents = 'auto';

    // Check the spin result
    const spinResult = getSpinResult();
    console.log('Spin Result:', spinResult);
    const resultElement = document.querySelector('.result');
    resultElement.textContent = spinResult;

    if (spinResult === 'WIN') {
      // Perform AJAX call to retrieve prize
      getPrize();
    } else {
      // Check if the player has more spins
      if (spinCount < 2) {
        // Enable start button for another spin
        startButton.disabled = false;
      } else {
        // Display "Try next time" message
        const resultElement = document.querySelector('.result');
        resultElement.textContent = 'Sorry, better luck next time!';
      }
    }
  }

  // Event listener for start button
  startButton.addEventListener('click', startSpin);
})();
