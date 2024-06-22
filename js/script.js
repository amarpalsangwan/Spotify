console.log("hi");
let currentSong = new Audio();

let songs;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formatedMinutes = String(minutes).padStart(2, "0");
  const formatedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formatedMinutes}:${formatedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  //   console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  // console.log(as);
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause=false) => {
  // let audio = new Audio("/songs/" + track)
  currentSong.src = "/songs/" + track;
  if (!pause){
    currentSong.play();
    play.src = "/img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  // Get the list of all songs
  songs = await getSongs();
  console.log(songs);
  playMusic(songs[0], true)

  // Show all the song in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                        <img src="./img/music.svg" alt="" class="invert">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ")}</div>
                            <div>Amarpal</div>
                        </div>
                        <div class="play-now">
                            <span>Play now</span>
                            <img src="./img/play.svg" alt="" class="invert">
                        </div>
                    </li>`;
  }

  // Attach an event listner to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });

  //Attach an event listner to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/img/play.svg";
    }
  });

  // Listen for time update
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
    if (currentSong.currentTime == currentSong.duration) {
      currentSong.pause();
      play.src = "/img/play.svg";
    }
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%"
  });

  // Add an eventlistner to seekbar

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX/e.target.getBoundingClientReact().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent)/100;
  });

  // Add an eventlistner for hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left='0';
  });

  // Add an eventlistner for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left='-120%';
  });

  // Add an eventlistner for previous and next button
  previous.addEventListener("click", () => {
    console.log("previous clicked")
    console.log(currentSong)
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    // currentSong.src.split("/").slice(-1)[0]
    console.log(songs, index)
    if((index-1) >= 0){
      playMusic(songs[index-1])
      }
  })

  next.addEventListener("click", () => {
    currentSong.pause()
    console.log("next clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    // currentSong.src.split("/").slice(-1)[0]
    console.log(songs, index)
    if((index+1) > length){
      playMusic(songs[index+1])
      }
  })
}

main();
