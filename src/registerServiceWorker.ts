
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      });
      
      if (registration.installing) {
        console.log('Service worker installing');
      } else if (registration.waiting) {
        console.log('Service worker waiting');
      } else if (registration.active) {
        console.log('Service worker active');
      }
      
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  } else {
    console.log('Service workers are not supported.');
  }
};
