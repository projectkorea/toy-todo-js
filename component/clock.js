function getTime(clockTitle) {
  const date = new Date();
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const seconds = date.getSeconds();

  clockTitle.innerText = `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export function clockInit() {
  const clockTitle = document.querySelector('.clock');
  getTime(clockTitle);
  setInterval(() => getTime(clockTitle), 1000);
}
