const isOtpExpire = (otpGenerateTime) => {
  const now = new Date();

  const differenceInMilliseconds = now.getTime() - otpGenerateTime.getTime();
  const differenceInMinutes = differenceInMilliseconds / (1000 * 60); // Convert milliseconds to minutes


  if (differenceInMinutes < 2) { // Less than 1 minute
    return 'n'; // OTP is not expired
  } else {
    return 'y'; // OTP is expired
  }
}


module.exports = isOtpExpire;
