
const dateFormate = (d) => {
  const date = new Date(d);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const hour = date.getHours();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = ('0' + (hour % 12 || 12)).slice(-2);
  const formattedTime = `${formattedHour}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)} ${ampm}`;

  return `${formattedDate} - ${formattedTime}`;
}

export default dateFormate;