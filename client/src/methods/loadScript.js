const loadScript = async (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        // console.log("Razorpay script loaded successfully.");
        resolve(true);
      };
      script.onerror = () => {
       // console.log("Failed to load Razorpay script.");
        resolve(false);
      }
      document.body.appendChild(script);
    });
  };


  export default loadScript;