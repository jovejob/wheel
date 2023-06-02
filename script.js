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

  // Form elements
  const form = document.querySelector('.form');
  const nameInput = document.querySelector('#name');
  const surnameInput = document.querySelector('#surname');
  const emailInput = document.querySelector('#email');

  // Wheel elements
  const wheelContainer = document.querySelector('.wheel-container');
  const wheel = document.querySelector('.wheel');
  const spinButton = document.querySelector('.spin-button');
  const pointer = document.querySelector('.marker');

  // Result element
  const resultElement = document.querySelector('.result');

  // Initialize spin count
  let spinCount = 0;

  // Disable spin button initially
  spinButton.disabled = true;

  // Form submission handler
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    if (validateForm()) {
      // Hide the form
      form.style.display = 'none';
      
      // Enable spin button
      spinButton.disabled = false;
    }
  });

  // Validate the form inputs
  function validateForm() {
    let valid = true;

    if (nameInput.value.trim() === '') {
      valid = false;
      nameInput.classList.add('error');
    } else {
      nameInput.classList.remove('error');
    }

    if (surnameInput.value.trim() === '') {
      valid = false;
      surnameInput.classList.add('error');
    } else {
      surnameInput.classList.remove('error');
    }

    if (emailInput.value.trim() === '') {
      valid = false;
      emailInput.classList.add('error');
    } else {
      emailInput.classList.remove('error');
    }

    return valid;
  }

  // Calculate a random spin result
  function getSpinResult() {
    const randomIndex = Math.floor(Math.random() * sections.length);
    return sections[randomIndex];
  }

  // AJAX call function
  function getPrize() {
    const url = 'prize.json';

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Prize:', data);
        resultElement.textContent = `Congratulations! You won ${data.prize}!`;
      })
      .catch(error => {
        console.error('Error:', error);
        resultElement.textContent = 'An error occurred. Please try again later.';
      });
  }

  // Start the spin animation
  function startSpin() {
    // Disable spin button during spin
    spinButton.disabled = true;

    // Calculate a new rotation between 5000 and 10000
    const deg = Math.floor(5000 + Math.random() * 5000);

    // Set the transition on the wheel
    wheel.style.transition = 'all 10s ease-out';

    // Rotate the wheel
    wheel.style.transform = `rotate(${deg}deg)`;

    // Apply the blur
    wheel.classList.add('blur');

    // Remove any previous result message
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
    resultElement.textContent = spinResult;

    if (spinResult === 'WIN') {
      // Perform AJAX call to retrieve prize
      getPrize();
    } else {
      // Check if the player has more spins
      if (spinCount < 2) {
        // Enable spin button for another spin
        spinButton.disabled = false;
      } else {
        // Display "Try next time" message
        resultElement.textContent = 'Sorry, better luck next time!';
      }
    }
  }

  // Event listener for spin button
  spinButton.addEventListener('click', startSpin);
})();
