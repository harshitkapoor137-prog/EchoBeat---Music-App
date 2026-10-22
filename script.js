// =====================================================================
// EchoBeat — app logic
// =====================================================================

// ----- Element references (login) -----
const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');

const loginPage = document.getElementById('loginPage');
const mainApp = document.getElementById('mainApp');
const loadingScreen = document.getElementById('loading-screen');

// ----- Element references (phone / forgot password) -----
const phoneLoginScreen = document.getElementById('phoneLoginScreen');
const phoneForm = document.getElementById('phoneForm');
const phoneNumberInput = document.getElementById('phoneNumber');
const phoneError = document.getElementById('phoneError');
const phoneSubmitBtn = document.getElementById('phoneSubmitBtn');
const phoneStatus = document.getElementById('phoneStatus');

// ----- Element references (profile / settings / views) -----
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');
const homeView = document.getElementById('homeView');
const playlistView = document.getElementById('playlistView');
const profileView = document.getElementById('profileView');
const settingsView = document.getElementById('settingsView');
const profileAvatarLg = document.getElementById('profileAvatarLg');
const profileEmailEl = document.getElementById('profileEmail');

// ----- Element references (playlist detail) -----
const playlistCover = document.getElementById('playlistCover');
const playlistTitle = document.getElementById('playlistTitle');
const playlistMeta = document.getElementById('playlistMeta');
const trackListEl = document.getElementById('trackList');
const playAllBtn = document.getElementById('playAllBtn');

// ----- Element references (player) -----
const playBtn = document.querySelector('.play-btn');
const playBtnIcon = playBtn ? playBtn.querySelector('i') : null;
const backwardBtn = document.querySelector('.player-controls .fa-backward-step');
const forwardBtn = document.querySelector('.player-controls .fa-forward-step');
const progressFill = document.querySelector('.progress-fill');
const progressTrack = document.querySelector('.progress-track');
const progressTimes = document.querySelectorAll('.progress-bar span');
const playerLeftImg = document.querySelector('.player-left img');
const playerLeftTitle = document.querySelector('.player-left .track-details h4');
const playerLeftArtist = document.querySelector('.player-left .track-details p');
const nowPlayingImg = document.querySelector('.now-playing-card .album-cover');
const nowPlayingTitle = document.querySelector('.now-playing-card .song-text h3');
const nowPlayingArtist = document.querySelector('.now-playing-card .song-text p');
const videoBtn = document.querySelector('.video-btn');

// ----- Element references (video modal) -----
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const videoModalClose = document.getElementById('videoModalClose');

// Only allow @gmail.com addresses for the Google login
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
const PHONE_REGEX = /^\d{10}$/;

const AUTH_KEY = 'echobeat_auth';
const SETTINGS_KEY = 'echobeat_settings';
const LIKED_SONGS_KEY = 'echobeat_liked_songs';

// =====================================================================
// Song / playlist data
//
// Put your MP3 files in a folder named "music" next to index.html.
// Each track below points at  music/<Track Title>.mp3  — name your
// files to match exactly (e.g. "music/Iktara.mp3") and playback will
// just work once the files exist. Videos are optional; leave a track's
// video as null until you add a matching video file.
//
// Song covers now live in "image/songs/<Track Title>.jpg" — name each
// image file to match the track title exactly, same rule as the mp3s.
// =====================================================================

function songCoverPath(title) {
    const fileName = title.replace(/\?/g, '');
    return `image/songs/${fileName}.jpg`;
}

function trackFrom(title, artist) {
    return {
        title,
        artist,
        cover: songCoverPath(title),
        audio: `music/${title}.mp3`,
        video: null,
    };
}

function tracksFromList(list) {
    return list.map((song) => trackFrom(song.title, song.artist));
}

// The 11-song set for Liked Songs / My Playlist #7
const CORE_SONGS = [
    { title: 'Iktara', artist: 'Kavita Seth' },
    { title: 'Kho Gaye Hum Kahan', artist: 'Jasleen Royal, Prateek Kuhad' },
    { title: 'Husn', artist: 'Anuv Jain' },
    { title: 'Aankhon Se Batana', artist: 'Dikshant' },
    { title: 'Kasoor', artist: 'Prateek Kuhad' },
    { title: 'Until I Found You', artist: 'Stephen Sanchez' },
    { title: 'I Like Me Better', artist: 'Lauv' },
    { title: 'Golden Hour', artist: 'JVKE' },
    { title: 'Dandelions', artist: 'Ruth B.' },
    { title: 'Daylight', artist: 'David Kushner' },
    { title: 'From The Start', artist: 'Laufey' },
];

// Same 11 songs, shuffled differently in each playlist
const LIKED_ORDER = [0, 7, 2, 9, 4, 6, 3, 10, 1, 8, 5];
const MYPLAYLIST_ORDER = [5, 4, 0, 8, 1, 10, 2, 7, 3, 9, 6];

// Hindi love songs (old + new) for Ishq Di Baajiyaan Radio
const ISHQ_SONGS = [
    { title: 'Tujhe Dekha To', artist: 'Lata Mangeshkar, Kumar Sanu' },
    { title: 'Tum Hi Ho', artist: 'Arijit Singh' },
    { title: 'Pehla Nasha', artist: 'Udit Narayan, Sadhana Sargam' },
    { title: 'Raabta', artist: 'Arijit Singh' },
    { title: 'Tere Bina', artist: 'A.R. Rahman, Chinmayi' },
];

// Jazz & Latin songs for TechnoMix
const TECHNO_SONGS = [
    { title: 'Fly Me to the Moon', artist: 'Frank Sinatra' },
    { title: 'Feeling Good', artist: 'Nina Simone' },
    { title: 'Take Five', artist: 'Dave Brubeck' },
    { title: 'Corcovado', artist: 'Stan Getz, Joao Gilberto' },
    { title: 'Despacito', artist: 'Luis Fonsi, Daddy Yankee' },
    { title: 'Bailando', artist: 'Enrique Iglesias' },
    { title: 'La Vie en Rose', artist: 'Edith Piaf' },
];

// Pop songs for Pop-Party
const POP_SONGS = [
    { title: 'Levitating', artist: 'Dua Lipa' },
    { title: 'As It Was', artist: 'Harry Styles' },
    { title: 'Watermelon Sugar', artist: 'Harry Styles' },
    { title: 'Flowers', artist: 'Miley Cyrus' },

];

// Hindi dance songs for Shuffle & Vibe
const SHUFFLE_SONGS = [
    { title: 'Kala Chashma', artist: 'Amar Arshi, Badshah, Neha Kakkar' },
    { title: 'Nagada Sang Dhol', artist: 'Shreya Ghoshal, Osman Mir' },
    { title: 'Lamberghini', artist: 'The Doorbeen' },
    { title: 'Ghungroo', artist: 'Arijit Singh, Shilpa Rao' },
    { title: 'Zingaat', artist: 'Ajay-Atul' },
    { title: 'London Thumakda', artist: 'Labh Janjua, Sonu Kakkar, Neha Kakkar' },
];

const CUSTOM_PLAYLISTS_KEY = 'echobeat_user_playlists';

// Distinct cover photos already present in the EchoBeat image folder.
// Custom playlists get their own cover, rather than all reusing MyPlaylist.jpg.
const CUSTOM_PLAYLIST_COVERS = [
    'image/trending.jpg',
    'image/ariana album.jpg',
    'image/grwm.jpg',
    'image/atif album.jpg',
    'image/Happy vibes.jpg',
    'image/All the Stars.jpg',
    'image/Starboy.jpg',
    'image/Blinding lights.jpg',
    'image/Save your tears.jpg',
    'image/Less than Zero.jpg',
    'image/Arjit singh.jpeg',
    'image/Diljit.jpeg',
    'image/Shreya.jpeg',
    'image/Atif.jpeg',
    'image/Karan Aujla.jpeg'
];

function getNextPlaylistCover() {
    const usedCovers = new Set(
        Object.values(PLAYLISTS || {}).map((playlist) => playlist.cover)
    );
    const availableCover = CUSTOM_PLAYLIST_COVERS.find((cover) => !usedCovers.has(cover));
    if (availableCover) return availableCover;

    // If the user creates more playlists than available local cover photos,
    // use a song cover from the catalogue as a fallback.
    const tracks = typeof getAllAvailableTracks === 'function' ? getAllAvailableTracks() : [];
    const trackCover = tracks.map((track) => track.cover).find((cover) => cover && !usedCovers.has(cover));
    return trackCover || CUSTOM_PLAYLIST_COVERS[usedCovers.size % CUSTOM_PLAYLIST_COVERS.length];
}

const PLAYLISTS = {
    myplaylist7: {
        title: 'My Playlist #7',
        cover: 'image/MyPlaylist.jpg',
        tracks: MYPLAYLIST_ORDER.map((songIndex) =>
            trackFrom(CORE_SONGS[songIndex].title, CORE_SONGS[songIndex].artist)),
    },
    shuffle: { title: 'Shuffle & Vibe', cover: 'image/Shuffle.jpg', tracks: tracksFromList(SHUFFLE_SONGS) },
    technomix: { title: 'TechnoMix', cover: 'image/Techno.jpg', tracks: tracksFromList(TECHNO_SONGS) },
    liked: {
        title: 'Liked Songs',
        cover: 'image/Liked.jpg',
        tracks: LIKED_ORDER.map((songIndex) =>
            trackFrom(CORE_SONGS[songIndex].title, CORE_SONGS[songIndex].artist)),
    },
    saved: {
        title: 'Saved Songs',
        cover: 'image/Liked.jpg',
        tracks: [],
    },
    poppart: { title: 'Pop-Party', cover: 'image/Pop.jpg', tracks: tracksFromList(POP_SONGS) },
    ishq: { title: 'Ishq Di Baajiyaan Radio', cover: 'image/Ishq.jpg', tracks: tracksFromList(ISHQ_SONGS) },
    
    // 🎙️ Our new 10 Podcasts added the exact same way as your songs!
    podcasts: {
        title: 'Popular Podcasts',
        cover: 'image/trending.jpg', // Uses a pre-existing cover photo you already have
        tracks: [
            trackFrom('Will AI Replace Coders', 'Tech Wave Podcast'),
            trackFrom('How to Build Habits', 'Mindset and Growth'),
            trackFrom('Mystery of Room 104', 'Sarah Koenig True Crime'),
            trackFrom('Investing for Gen Z', 'Financial Freedom'),
            trackFrom('What Inside Black Holes', 'The Space Chronicles'),
            trackFrom('Science of Deep Sleep', 'The Wellness Lab'),
            trackFrom('How Hip Hop Took Over', 'Behind The Beats'),
            trackFrom('Alexandria Burning', 'History Retold'),
            trackFrom('Failing and Pivoting', 'The Startup Blueprint'),
            trackFrom('Stoic Creative Focus', 'Creative Flow Podcast')
        ]
    }
};


// Restore playlists created by the signed-in user. New users start with none.
function loadCustomPlaylists() {
    try {
        const saved = JSON.parse(localStorage.getItem(CUSTOM_PLAYLISTS_KEY)) || [];
        const usedCustomCovers = new Set();

        saved.forEach((playlist) => {
            if (!playlist || !playlist.key || !playlist.title || !Array.isArray(playlist.tracks)) return;

            let cover = playlist.cover || 'image/MyPlaylist.jpg';
            if (usedCustomCovers.has(cover)) {
                const replacement = CUSTOM_PLAYLIST_COVERS.find((candidate) =>
                    !usedCustomCovers.has(candidate) &&
                    !Object.entries(PLAYLISTS).some(([key, item]) => key !== playlist.key && item.cover === candidate)
                );
                if (replacement) cover = replacement;
            }
            usedCustomCovers.add(cover);

            PLAYLISTS[playlist.key] = {
                title: playlist.title,
                cover,
                tracks: playlist.tracks,
                isCustom: true
            };
        });

        // Persist repaired cover assignments so each saved playlist keeps its own art.
        const custom = Object.entries(PLAYLISTS)
            .filter(([, playlist]) => playlist.isCustom)
            .map(([key, playlist]) => ({ key, title: playlist.title, cover: playlist.cover, tracks: playlist.tracks }));
        localStorage.setItem(CUSTOM_PLAYLISTS_KEY, JSON.stringify(custom));
    } catch {
        localStorage.removeItem(CUSTOM_PLAYLISTS_KEY);
    }
}

loadCustomPlaylists();

// "Thinking Out Loud" and "Notion" are single tracks, not playlists —
// clicking their quick-card plays them directly instead of opening the
// playlist page.
const SINGLE_TRACKS = {
    thinking: trackFrom('Thinking Out Loud', 'Ed Sheeran'),
    notion: trackFrom('Notion', 'The Rare Occasions'),
    allthestars: trackFrom('All The Stars', 'Kendrick Lamar, SZA'),
    drive: trackFrom('Drive', 'Ed Sheeran'),
    losemymind: trackFrom('Lose My Mind', 'Don Toliver'),
    justkeepwatching: trackFrom('Just Keep Watching', 'Tate Mcrae')
};

// =====================================================================
// Dynamic Liked Songs
// =====================================================================

function getLikedSongs() {
    try {
        return JSON.parse(
            localStorage.getItem(LIKED_SONGS_KEY)
        ) || [];
    } catch {
        return [];
    }
}

function saveLikedSongs(songs) {
    localStorage.setItem(
        LIKED_SONGS_KEY,
        JSON.stringify(songs)
    );
}

const SAVED_SONGS_KEY = 'echobeat_saved_songs';

function getSavedSongs() {
    try {
        return JSON.parse(localStorage.getItem(SAVED_SONGS_KEY)) || [];
    } catch {
        return [];
    }
}

function saveSavedSongs(songs) {
    localStorage.setItem(SAVED_SONGS_KEY, JSON.stringify(songs));
}

function getDynamicSavedTracks() {
    const allTracks = getAllAvailableTracks();
    return getSavedSongs().map((saved) => {
        const title = typeof saved === 'string' ? saved : saved.title;
        const artist = typeof saved === 'string' ? null : saved.artist;
        return allTracks.find(track => track.title === title && (!artist || track.artist === artist));
    }).filter(Boolean);
}

function trackIsSaved(track) {
    return getSavedSongs().some(item =>
        (typeof item === 'string' ? item === track.title : item.title === track.title && item.artist === track.artist)
    );
}

function toggleSavedTrack(track) {
    const saved = getSavedSongs();
    const index = saved.findIndex(item =>
        (typeof item === 'string' ? item === track.title : item.title === track.title && item.artist === track.artist)
    );
    if (index >= 0) {
        saved.splice(index, 1);
        showToast(`Removed "${track.title}" from Saved Songs`);
    } else {
        saved.push({ title: track.title, artist: track.artist });
        showToast(`Saved "${track.title}"`);
    }
    saveSavedSongs(saved);
    if (currentPlaylistKey === 'saved') openPlaylist('saved');
    refreshLikeIcons();
}

function toggleLikedTrack(track) {
    const liked = getLikedSongs();
    const index = liked.indexOf(track.title);
    if (index >= 0) {
        liked.splice(index, 1);
        showToast(`Removed "${track.title}" from Liked Songs`);
    } else {
        liked.push(track.title);
        showToast(`Added "${track.title}" to Liked Songs`);
    }
    saveLikedSongs(liked);
    refreshLikeIcons();
    if (currentPlaylistKey === 'liked') openPlaylist('liked');
}


// Build one master catalogue from every playlist + single tracks
function getAllAvailableTracks() {

    const tracks = [];

    Object.values(PLAYLISTS).forEach((playlist) => {
        playlist.tracks.forEach((track) => {

            const alreadyExists =
                tracks.some(
                    item => item.title === track.title
                );

            if (!alreadyExists) {
                tracks.push(track);
            }

        });
    });


    Object.values(SINGLE_TRACKS).forEach((track) => {

        const alreadyExists =
            tracks.some(
                item => item.title === track.title
            );

        if (!alreadyExists) {
            tracks.push(track);
        }

    });

    return tracks;
}


// Return ONLY songs that the user has actually liked
function getDynamicLikedTracks() {

    const likedTitles = getLikedSongs();

    if (!likedTitles.length) {
        return [];
    }

    const allTracks = getAllAvailableTracks();

    return likedTitles
        .map(title =>
            allTracks.find(
                track => track.title === title
            )
        )
        .filter(Boolean);
}

// =====================================================================
// Recently played tracks are kept locally and rendered in the home Recents row.
const RECENTS_KEY = 'echobeat_recent_tracks';
const RECENT_STARTER_TRACKS = [
    trackFrom('All The Stars', 'Kendrick Lamar, SZA'),
    trackFrom('Starboy', 'The Weeknd'),
    trackFrom('Blinding Lights', 'The Weeknd'),
    trackFrom('Save Your Tears', 'The Weeknd'),
    trackFrom('Less Than Zero', 'The Weeknd'),
    trackFrom('Drive', 'Ed Sheeran'),
    trackFrom('Lose My Mind', 'Don Toliver'),
    trackFrom('Just Keep Watching', 'Tate Mcrae')
];
let showAllRecents = false;

function getRecentTracks() {
    try {
        const saved = JSON.parse(localStorage.getItem(RECENTS_KEY));
        if (Array.isArray(saved) && saved.length) {
            return saved.map((item) => trackFrom(item.title, item.artist)).filter((track) => track.title && track.artist);
        }
    } catch {}
    return [...RECENT_STARTER_TRACKS];
}

function rememberRecentTrack(track) {
    if (!track || !track.title) return;
    let recent = [];
    try {
        const saved = JSON.parse(localStorage.getItem(RECENTS_KEY)) || [];
        if (Array.isArray(saved)) recent = saved;
    } catch {}
    recent = recent.filter((item) => item.title !== track.title || item.artist !== track.artist);
    recent.unshift({ title: track.title, artist: track.artist });
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recent.slice(0, 30)));
    renderRecents();
}

function renderRecents() {
    const slider = document.getElementById('recentsSlider');
    const showAllLink = document.getElementById('recentsShowAll');
    if (!slider) return;
    const tracks = getRecentTracks();
    const visibleTracks = showAllRecents ? tracks : tracks.slice(0, 5);
    slider.innerHTML = '';
    visibleTracks.forEach((track) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'card recent-track-card';
        card.setAttribute('aria-label', `Play ${track.title} by ${track.artist}`);
        const image = document.createElement('img');
        image.src = track.cover;
        image.alt = `${track.title} cover`;
        image.loading = 'lazy';
        image.onerror = () => { image.onerror = null; image.src = 'image/MyPlaylist.jpg'; };
        const title = document.createElement('h3');
        title.textContent = track.title;
        const artist = document.createElement('p');
        artist.textContent = track.artist;
        card.append(image, title, artist);
        card.addEventListener('click', () => {
            currentPlaylistKey = null;
            playQueue([track], 0);
            showToast(`Playing ${track.title}`);
        });
        slider.appendChild(card);
    });
    if (showAllLink) showAllLink.textContent = showAllRecents ? 'Show less' : 'Show All';
}

// Player state
// =====================================================================

const audioPlayer = new Audio();
let currentPlaylistKey = null;
let currentQueue = [];
let currentIndex = -1;
function renderQueue() {
    const queueContainer = document.getElementById('dynamicQueue');

    if (!queueContainer) return;

    queueContainer.innerHTML = '';

    const upcomingSongs = currentQueue.slice(currentIndex + 1);

    if (upcomingSongs.length === 0) {
        queueContainer.innerHTML = '<p style="color:#b3b3b3;">No upcoming songs</p>';
        return;
    }

    upcomingSongs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'queue-item';
        item.style.cursor = 'pointer';

        item.addEventListener('click', () => {
            loadTrack(currentIndex + 1 + index, true);
        });

        const img = document.createElement('img');
        img.src = song.cover;
        img.alt = song.title;

        const details = document.createElement('div');

        const title = document.createElement('h4');
        title.textContent = song.title;

        const artist = document.createElement('p');
        artist.textContent = song.artist;

        details.append(title, artist);
        item.append(img, details);
        queueContainer.appendChild(item);
    });
}
let isPlaying = false;

let isShuffleOn = false;
let repeatMode = 'off'; // off, all, one

const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');

shuffleBtn.addEventListener('click', () => {
    isShuffleOn = !isShuffleOn;

    shuffleBtn.style.color = isShuffleOn ? '#1DB954' : '#b3b3b3';
    shuffleBtn.classList.toggle('active', isShuffleOn);

    console.log('Shuffle:', isShuffleOn ? 'ON' : 'OFF');
});

repeatBtn.addEventListener('click', () => {
    if (repeatMode === 'off') {
        repeatMode = 'all';
    } else if (repeatMode === 'all') {
        repeatMode = 'one';
    } else {
        repeatMode = 'off';
    }

    repeatBtn.style.color =
        repeatMode === 'off' ? '#b3b3b3' : '#1DB954';
    repeatBtn.classList.toggle('active', repeatMode !== 'off');

    repeatBtn.title = `Repeat: ${repeatMode}`;

    console.log('Repeat:', repeatMode);
});

// Keep Recents synced to tracks that actually begin playback, regardless of entry point.
audioPlayer.addEventListener('play', () => {
    const track = currentQueue[currentIndex];
    if (track) rememberRecentTrack(track);
});

function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function renderNowPlaying(track) {
    if (!track) return;
    if (playerLeftImg) playerLeftImg.src = track.cover;
    if (playerLeftTitle) playerLeftTitle.textContent = track.title;
    if (playerLeftArtist) playerLeftArtist.textContent = track.artist;
    if (nowPlayingImg) nowPlayingImg.src = track.cover;
    if (nowPlayingTitle) nowPlayingTitle.textContent = track.title;
    if (nowPlayingArtist) nowPlayingArtist.textContent = track.artist;

    document.querySelectorAll('.track-row').forEach((row, idx) => {
        row.classList.toggle('playing', idx === currentIndex);
    });
}

function setPlayIcon(playing) {
    if (!playBtnIcon) return;
    playBtnIcon.classList.toggle('fa-play', !playing);
    playBtnIcon.classList.toggle('fa-pause', playing);
}

function loadTrack(index, autoplay) {
    if (!currentQueue.length) return;
    currentIndex = (index + currentQueue.length) % currentQueue.length;
    const track = currentQueue[currentIndex];

    audioPlayer.src = track.audio;
    audioPlayer.currentTime = 0;
    renderNowPlaying(track);
    rememberRecentTrack(track);
    renderQueue();

    if (autoplay) {
        audioPlayer.play().catch(() => {});
        isPlaying = true;
        setPlayIcon(true);
    } else {
        isPlaying = false;
        setPlayIcon(false);
    }
}

function playQueue(queue, startIndex) {
    currentQueue = queue;
    loadTrack(startIndex || 0, true);
}

// Plays a single, non-playlist track (Thinking Out Loud / Notion).
// The queue only has one item, so prev/next simply replay it — the
// full playlists (built via openPlaylist) are what give real prev/next.
function playSingleTrack(key) {
    const track = SINGLE_TRACKS[key];
    if (!track) return;
    currentPlaylistKey = null;
    playQueue([track], 0);
    showToast(`Playing ${track.title}`);
}

function togglePlayPause() {
    if (!currentQueue.length) return;
    if (audioPlayer.paused) {
        audioPlayer.play().catch(() => {});
        isPlaying = true;
    } else {
        audioPlayer.pause();
        isPlaying = false;
    }
    setPlayIcon(isPlaying);
}

function playNext(autoNext = false) {
    if (!currentQueue.length) return;

    if (isShuffleOn && currentQueue.length > 1) {
        let nextIndex;

        do {
            nextIndex = Math.floor(Math.random() * currentQueue.length);
        } while (nextIndex === currentIndex);

        loadTrack(nextIndex, true);
        return;
    }

    if (currentIndex >= currentQueue.length - 1) {
        if (repeatMode === 'all') {
            loadTrack(0, true);
        } else if (autoNext) {
            isPlaying = false;
            setPlayIcon(false);
        } else {
            loadTrack(0, true);
        }
        return;
    }

    loadTrack(currentIndex + 1, true);
}

function playPrev() {
    if (!currentQueue.length) return;
    loadTrack(currentIndex - 1, true);
}

if (playBtn) playBtn.addEventListener('click', togglePlayPause);
if (forwardBtn) forwardBtn.addEventListener('click', () => playNext(false));
if (backwardBtn) backwardBtn.addEventListener('click', playPrev);


audioPlayer.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        loadTrack(currentIndex, true);
    } else {
        playNext(true);
    }
});

audioPlayer.addEventListener('timeupdate', () => {
    if (!audioPlayer.duration) return;
    const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressTimes.length === 2) {
        progressTimes[0].textContent = formatTime(audioPlayer.currentTime);
        progressTimes[1].textContent = formatTime(audioPlayer.duration);
    }
});

if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
        if (!audioPlayer.duration) return;
        const rect = progressTrack.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = pct * audioPlayer.duration;
    });
}

// "Switch to video" — plays the current track's video in a modal, if it has one
if (videoBtn) {
    videoBtn.addEventListener('click', () => {
        const track = currentQueue[currentIndex];
        if (!track || !track.video) {
            showToast('No video available for this track');
            return;
        }
        audioPlayer.pause();
        isPlaying = false;
        setPlayIcon(false);
        videoPlayer.src = track.video;
        videoModal.hidden = false;
        videoPlayer.play().catch(() => {});
    });
}

if (videoModalClose) {
    videoModalClose.addEventListener('click', () => {
        videoPlayer.pause();
        videoPlayer.removeAttribute('src');
        videoModal.hidden = true;
    });
}

// =====================================================================
// View routing (home / playlist / profile / settings)
// =====================================================================

let currentAppView = homeView;
const appViewHistory = [];

function showView(view, recordHistory = true) {
    if (!view) return;

    if (recordHistory && currentAppView && currentAppView !== view) {
        appViewHistory.push(currentAppView);
        if (appViewHistory.length > 30) appViewHistory.shift();
    }

    [homeView, playlistView, profileView, settingsView].forEach((item) => {
        if (!item) return;
        const shouldHide = item !== view;
        item.hidden = shouldHide;
        item.toggleAttribute('hidden', shouldHide);
        item.setAttribute('aria-hidden', shouldHide ? 'true' : 'false');
    });

    currentAppView = view;
    view.scrollTop = 0;
    const content = document.querySelector('.content');
    if (content) content.scrollTop = 0;
}

function goBackView() {
    const previousView = appViewHistory.pop();
    if (previousView && previousView !== currentAppView) {
        showView(previousView, false);
        return;
    }
    goHome();
}

function openPlaylist(key) {
    const playlist = PLAYLISTS[key];
    if (!playlist) return;

    // Record interaction so it bumps this custom playlist to the top of the left sidebar
    if (playlist.isCustom && typeof recordPlaylistInteraction === 'function') {
        recordPlaylistInteraction(key);
    }
    // ---------------------------------------------------------------
    // Liked Songs is dynamic
    // ---------------------------------------------------------------
    const tracks = key === 'liked'
        ? getDynamicLikedTracks()
        : key === 'saved'
            ? getDynamicSavedTracks()
            : playlist.tracks;

    if (searchInput) searchInput.value = '';

    const playlistSearchField = document.getElementById('playlistSearchInput');
    if (playlistSearchField) playlistSearchField.value = '';

    currentPlaylistKey = key;

    // Playlist cover; recover gracefully if an old saved cover path is invalid.
    setPlaylistCoverWithFallback(playlistCover, playlist.cover);

    // Playlist title
    playlistTitle.textContent = playlist.title;

    const addSongsBtn = document.getElementById('addSongsBtn');
    if (addSongsBtn) addSongsBtn.hidden = !playlist.isCustom;

    const playlistManagement = document.getElementById('playlistManagement');
    const playlistManagementMenu = document.getElementById('playlistManagementMenu');
    const playlistManagementTrigger = document.getElementById('playlistManagementTrigger');

    if (playlistManagement) playlistManagement.hidden = !playlist.isCustom;
    if (playlistManagementMenu) playlistManagementMenu.hidden = true;
    if (playlistManagementTrigger) playlistManagementTrigger.setAttribute('aria-expanded', 'false');

    // Dynamic song count
    playlistMeta.textContent =
        `${tracks.length} songs`;

    // Reset track list
    trackListEl.innerHTML = `
        <div class="track-list-header">
            <span class="col-num">#</span>
            <span class="col-title">Title</span>
            <span class="col-duration">
                <i class="fa-regular fa-clock"></i>
            </span>
        </div>
    `;

    // ---------------------------------------------------------------
    // Empty Liked Songs state
    // ---------------------------------------------------------------
    if (key === 'liked' && tracks.length === 0) {
        const emptyState =
            document.createElement('div');
        emptyState.className =
            'liked-empty-state';
        emptyState.innerHTML = `
            <i class="fa-regular fa-heart"></i>
            <h3>No liked songs yet</h3>
            <p>
                Songs you like will appear here.
            </p>
        `;
        trackListEl.appendChild(
            emptyState
        );
        showView(playlistView);
        return;
    }

    if (key === 'saved' && tracks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'liked-empty-state';
        emptyState.innerHTML = '<i class="fa-solid fa-box-archive"></i><h3>No saved songs yet</h3><p>Songs you save will appear here.</p>';
        trackListEl.appendChild(emptyState);
        showView(playlistView);
        return;
    }

    // ---------------------------------------------------------------
    // Empty user-created playlist state
    // ---------------------------------------------------------------
    if (playlist.isCustom && tracks.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'playlist-empty-state';
        emptyState.innerHTML = `
            <i class="fa-solid fa-music"></i>
            <h3>Your playlist is ready</h3>
            <p><strong>${escapeHTML(playlist.title)}</strong> is empty for now. Add songs from your music catalogue to get started.</p>
            <button type="button" class="empty-add-songs-btn" data-open-song-picker="${escapeHTML(key)}"><i class="fa-solid fa-plus"></i> Find songs</button>
        `;
        trackListEl.appendChild(emptyState);
        showView(playlistView);
        return;
    }

    // ---------------------------------------------------------------
    // Render tracks
    // ---------------------------------------------------------------
    tracks.forEach((track, idx) => {
        const row =
            document.createElement('div');
        row.className =
            'track-row';
        row.innerHTML = `
            <span class="track-num">
                ${idx + 1}
            </span>
            <img
                src="${track.cover}"
                alt=""
                class="track-cover"
            >
            <div class="track-info">
                <div class="track-text">
                    <h4>
                        ${track.title}
                    </h4>
                    <p>
                        ${track.artist}
                        ${
                            track.video
                                ? `
                                    <span class="track-video-tag">
                                        <i class="fa-solid fa-video"></i>
                                        Video
                                    </span>
                                  `
                                : ''
                        }
                    </p>
                </div>
            </div>
            <span class="track-duration track-row-actions">
                <button type="button" class="track-like-btn" data-track-title="${escapeHTML(track.title)}" data-track-artist="${escapeHTML(track.artist)}" aria-label="Like ${escapeHTML(track.title)}" title="Like song"><i class="${isSongLiked(track.title) ? 'fa-solid' : 'fa-regular'} fa-heart"></i></button>
                <button type="button" class="track-save-btn" data-track-title="${escapeHTML(track.title)}" data-track-artist="${escapeHTML(track.artist)}" aria-label="Save ${escapeHTML(track.title)}" title="Save song"><i class="${trackIsSaved(track) ? 'fa-solid' : 'fa-regular'} fa-bookmark"></i></button>
                <button type="button" class="track-more-btn" data-track-title="${escapeHTML(track.title)}" data-track-artist="${escapeHTML(track.artist)}" aria-label="More options for ${escapeHTML(track.title)}" title="More options"><i class="fa-solid fa-ellipsis"></i></button>
            </span>
        `;

        // -----------------------------------------------------------
        // Clicking the row plays the song
        // -----------------------------------------------------------
        row.addEventListener(
            'click',
            (event) => {
                if (event.target.closest('.track-more-btn, .track-like-btn, .track-save-btn')) return;
                playQueue(tracks, idx);
            }
        );
        trackListEl.appendChild(row);
    });

    showView(playlistView);
}


const homeQuickLinks = document.getElementById('homeQuickLinks');

if (homeQuickLinks) {
    homeQuickLinks.addEventListener('click', (event) => {
        const card = event.target.closest('.quick-card[data-playlist]');
        if (!card) return;
        openPlaylist(card.dataset.playlist);
    });
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
}

function saveCustomPlaylists() {
    const custom = Object.entries(PLAYLISTS)
        .filter(([, playlist]) => playlist.isCustom)
        .map(([key, playlist]) => ({
            key,
            title: playlist.title,
            cover: playlist.cover,
            tracks: playlist.tracks
        }));
    localStorage.setItem(CUSTOM_PLAYLISTS_KEY, JSON.stringify(custom));
}

function setPlaylistCoverWithFallback(image, cover, fallback = 'image/The weeknd.jpg') {
    if (!image) return;
    image.onerror = () => {
        image.onerror = null;
        image.src = fallback;
        image.onerror = () => {
            image.onerror = null;
            image.src = 'image/MyPlaylist.jpg';
        };
    };
    image.src = cover || fallback;

// =====================================================================
// Dynamic Sidebar Rendering (Recently Played first)
// =====================================================================
const PLAYLIST_ORDER_KEY = 'echobeat_playlist_order';

function getPlaylistOrder() {
    try {
        const savedOrder = JSON.parse(localStorage.getItem(PLAYLIST_ORDER_KEY));
        if (Array.isArray(savedOrder)) {
            return savedOrder;
        }
    } catch {}
    
    // Default fallback order if empty
    return Object.keys(PLAYLISTS);
}

function savePlaylistOrder(order) {
    localStorage.setItem(PLAYLIST_ORDER_KEY, JSON.stringify(order));
}

// Moves a playlist key to the front of the sidebar
function recordPlaylistInteraction(key) {
    if (!key || !PLAYLISTS[key]) return;
    
    let order = getPlaylistOrder();
    
    // Remove key if it already exists, then unshift to put it at index 0 (top)
    order = order.filter(item => item !== key);
    order.unshift(key);
    
    savePlaylistOrder(order);
    renderUserPlaylists(); // Re-render sidebar instantly
}

function renderUserPlaylists() {
    const sidebar = document.getElementById('userPlaylistSidebar');
    const quickLinks = document.getElementById('homeQuickLinks');
    if (!sidebar || !quickLinks) return;

    sidebar.replaceChildren();
    quickLinks.replaceChildren();

    // 1. Liked Songs is always pinned to the top of Quick Links
    const likedCard = document.createElement('div');
    likedCard.className = 'quick-card';
    likedCard.dataset.playlist = 'liked';
    likedCard.innerHTML = '<img src="image/Liked.jpg" alt=""><span>Liked Songs</span>';
    quickLinks.appendChild(likedCard);

    // 2. Get the sorted order of playlists
    const sortedKeys = getPlaylistOrder();

    // Ensure any newly added playlists (that aren't in localStorage yet) are appended
    Object.keys(PLAYLISTS).forEach(key => {
        if (!sortedKeys.includes(key)) {
            sortedKeys.push(key);
        }
    });

    // 3. Render items in the left sidebar (Custom User Playlists) in sorted order
    sortedKeys.forEach(key => {
        const playlist = PLAYLISTS[key];
        if (!playlist || !playlist.isCustom) return; // Only custom user playlists go in the left sidebar

        const image = document.createElement('button');
        image.type = 'button';
        image.className = 'playlist user-playlist-item';
        image.title = playlist.title;
        image.setAttribute('aria-label', `Open playlist ${playlist.title}`);
<<<<<<< HEAD
        const coverImage = document.createElement('img');
        coverImage.alt = '';
        setPlaylistCoverWithFallback(coverImage, playlist.cover);
        image.appendChild(coverImage);
        image.addEventListener('click', () => openPlaylist(key));
=======
        image.innerHTML = `<img src="${escapeHTML(playlist.cover)}" alt="">`;
        image.addEventListener('click', () => {
            recordPlaylistInteraction(key); // Move to top on click!
            openPlaylist(key);
        });
>>>>>>> 5c4c848 (chore: setup .gitignore and clean untracked files)
        sidebar.appendChild(image);

        // Populate Quick Links in the same dynamic order
        const card = document.createElement('div');
        card.className = 'quick-card';
        card.dataset.playlist = key;
        const cardImage = document.createElement('img');
        cardImage.alt = '';
        setPlaylistCoverWithFallback(cardImage, playlist.cover);
        const cardTitle = document.createElement('span');
        cardTitle.textContent = playlist.title;
        card.append(cardImage, cardTitle);
        quickLinks.appendChild(card);
    });
}


function showEchoBeatDialog({ eyebrow = 'YOUR MUSIC', title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false, onConfirm }) {
    let modal = document.getElementById('echoBeatActionDialog');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'echoBeatActionDialog';
        modal.className = 'echo-dialog-backdrop';
        modal.hidden = true;
        modal.innerHTML = `
            <section class="echo-dialog" role="dialog" aria-modal="true" aria-labelledby="echoDialogTitle" aria-describedby="echoDialogMessage">
                <button class="echo-dialog-close" type="button" aria-label="Close dialog"><i class="fa-solid fa-xmark"></i></button>
                <div class="echo-dialog-eyebrow"></div>
                <h2 id="echoDialogTitle"></h2>
                <p id="echoDialogMessage"></p>
                <div class="echo-dialog-actions">
                    <button type="button" class="echo-dialog-cancel"></button>
                    <button type="button" class="echo-dialog-confirm"></button>
                </div>
            </section>`;
        document.body.appendChild(modal);
    }
    const close = () => {
        modal.hidden = true;
        document.removeEventListener('keydown', onKeyDown);
    };
    const cancelButton = modal.querySelector('.echo-dialog-cancel');
    const confirmButton = modal.querySelector('.echo-dialog-confirm');
    const closeButton = modal.querySelector('.echo-dialog-close');
    modal.querySelector('.echo-dialog-eyebrow').textContent = eyebrow;
    modal.querySelector('#echoDialogTitle').textContent = title;
    modal.querySelector('#echoDialogMessage').textContent = message;
    cancelButton.textContent = cancelText;
    confirmButton.textContent = confirmText;
    confirmButton.classList.toggle('is-danger', danger);
    modal.hidden = false;
    const onKeyDown = (event) => {
        if (event.key === 'Escape') close();
    };
    cancelButton.onclick = close;
    closeButton.onclick = close;
    confirmButton.onclick = () => {
        close();
        if (typeof onConfirm === 'function') onConfirm();
    };
    modal.onclick = (event) => { if (event.target === modal) close(); };
    document.addEventListener('keydown', onKeyDown);
    confirmButton.focus();
}

function manageCurrentPlaylist(action) {
    const key = currentPlaylistKey;
    const playlist = PLAYLISTS[key];
    if (!playlist || !playlist.isCustom) return;

    if (action === 'rename') {
        const enteredName = window.prompt('Enter the new playlist name:', playlist.title);
        if (enteredName === null) return;
        const newTitle = enteredName.trim().replace(/\s+/g, ' ');
        if (!newTitle) {
            showToast('Playlist name cannot be empty');
            return;
        }
        const duplicate = Object.entries(PLAYLISTS).some(([otherKey, otherPlaylist]) =>
            otherKey !== key && otherPlaylist.title.trim().replace(/\s+/g, ' ').toLocaleLowerCase() === newTitle.toLocaleLowerCase()
        );
        if (duplicate) {
            showToast('A playlist with that name already exists');
            return;
        }
        playlist.title = newTitle;
        saveCustomPlaylists();
        renderUserPlaylists();
        if (playlistTitle) playlistTitle.textContent = newTitle;
        showToast(`Playlist renamed to ${newTitle}`);
        return;
    }

    if (action === 'delete') {
        const oldTitle = playlist.title;
        showEchoBeatDialog({
            eyebrow: 'PLAYLIST MANAGEMENT',
            title: 'Delete playlist?',
            message: `Delete "${oldTitle}"? This cannot be undone.`,
            confirmText: 'Delete playlist',
            danger: true,
            onConfirm: () => {
                delete PLAYLISTS[key];
                saveCustomPlaylists();
                renderUserPlaylists();
                goHome();
                showToast(`Deleted ${oldTitle}`);
            }
        });
    }
}

const createPlaylistModal = document.getElementById('createPlaylistModal');
const createPlaylistForm = document.getElementById('createPlaylistForm');
const newPlaylistName = document.getElementById('newPlaylistName');
const closeCreatePlaylistBtn = document.getElementById('closeCreatePlaylistBtn');
const cancelCreatePlaylistBtn = document.getElementById('cancelCreatePlaylistBtn');

function closeCreatePlaylistModal() {
    if (createPlaylistModal) createPlaylistModal.hidden = true;
    if (createPlaylistForm) createPlaylistForm.reset();
}

function createUserPlaylist() {
    if (!createPlaylistModal || !newPlaylistName) return;
    createPlaylistModal.hidden = false;
    newPlaylistName.value = '';
    window.setTimeout(() => newPlaylistName.focus(), 0);
}

function submitNewPlaylist(event) {
    event.preventDefault();
    const title = (newPlaylistName?.value || '').trim().replace(/\s+/g, ' ');

    if (!title) {
        showToast('Please enter a playlist name');
        newPlaylistName?.focus();
        return;
    }

    const normalizedTitle = title.toLocaleLowerCase();
    const duplicate = Object.values(PLAYLISTS).some((playlist) =>
        playlist.title.trim().replace(/\s+/g, ' ').toLocaleLowerCase() === normalizedTitle
    );

    if (duplicate) {
        showToast('A playlist with that name already exists. Choose a different name.');
        newPlaylistName?.focus();
        newPlaylistName?.select();
        return;
    }

    const key = `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    PLAYLISTS[key] = {
        title,
        cover: getNextPlaylistCover(),
        tracks: [],
        isCustom: true
    };

    saveCustomPlaylists();
    
    // Record interaction so the newly created playlist automatically sits at the top of the sidebar
    if (typeof recordPlaylistInteraction === 'function') {
        recordPlaylistInteraction(key);
    }
    
    renderUserPlaylists();
    closeCreatePlaylistModal();
    openPlaylist(key);
    showToast(`Created ${title}`);
}


if (createPlaylistForm) createPlaylistForm.addEventListener('submit', submitNewPlaylist);
if (closeCreatePlaylistBtn) closeCreatePlaylistBtn.addEventListener('click', closeCreatePlaylistModal);
if (cancelCreatePlaylistBtn) cancelCreatePlaylistBtn.addEventListener('click', closeCreatePlaylistModal);
if (createPlaylistModal) {
    createPlaylistModal.addEventListener('click', (event) => {
        if (event.target === createPlaylistModal) closeCreatePlaylistModal();
    });
}
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && createPlaylistModal && !createPlaylistModal.hidden) {
        closeCreatePlaylistModal();
    }
});

const createPlaylistBtn = document.getElementById('createPlaylistBtn');
if (createPlaylistBtn) {
    createPlaylistBtn.addEventListener('click', createUserPlaylist);
}

// =====================================================================
// Add songs to user-created playlists (Spotify-style Add to playlist flow)
// =====================================================================
const songPickerModal = document.getElementById('songPickerModal');
const songPickerTarget = document.getElementById('songPickerTarget');
const songPickerSearch = document.getElementById('songPickerSearch');
const songPickerList = document.getElementById('songPickerList');
const closeSongPickerBtn = document.getElementById('closeSongPickerBtn');
const addSongsBtn = document.getElementById('addSongsBtn');
let songPickerPreferredTrack = null;

function openSongPicker(targetKey = null, preferredTrack = null) {
    if (!songPickerModal || !songPickerTarget || !songPickerList) return;

    const customEntries = Object.entries(PLAYLISTS).filter(([, playlist]) => playlist.isCustom);
    if (!customEntries.length) {
        showToast('Create a playlist first using the + button');
        return;
    }

    songPickerTarget.innerHTML = customEntries.map(([key, playlist]) =>
        `<option value="${escapeHTML(key)}">${escapeHTML(playlist.title)}</option>`
    ).join('');

    const usableTarget = targetKey && PLAYLISTS[targetKey]?.isCustom
        ? targetKey
        : (currentPlaylistKey && PLAYLISTS[currentPlaylistKey]?.isCustom ? currentPlaylistKey : customEntries[0][0]);
    songPickerTarget.value = usableTarget;
    songPickerPreferredTrack = preferredTrack;
    songPickerSearch.value = preferredTrack ? preferredTrack.title : '';
    songPickerModal.hidden = false;
    renderSongPickerTracks();
    if (!preferredTrack) songPickerSearch.focus();
}

function renderSongPickerTracks() {
    if (!songPickerList || !songPickerTarget) return;
    const targetKey = songPickerTarget.value;
    const targetPlaylist = PLAYLISTS[targetKey];
    const query = (songPickerSearch?.value || '').trim().toLowerCase();
    const allTracks = getAllAvailableTracks();
    const filteredTracks = allTracks.filter((track) =>
        `${track.title} ${track.artist}`.toLowerCase().includes(query)
    );

    if (!filteredTracks.length) {
        songPickerList.innerHTML = '<p class="song-picker-empty">No songs found. Try another search.</p>';
        return;
    }

    songPickerList.innerHTML = filteredTracks.map((track) => {
        const alreadyAdded = targetPlaylist?.tracks.some((item) => item.title === track.title && item.artist === track.artist);
        const isPreferred = songPickerPreferredTrack && songPickerPreferredTrack.title === track.title && songPickerPreferredTrack.artist === track.artist;
        return `
            <div class="song-picker-row">
                <img src="${escapeHTML(track.cover)}" alt="" onerror="this.onerror=null;this.src='image/MyPlaylist.jpg'">
                <div class="song-picker-track-info"><strong>${escapeHTML(track.title)}</strong><span>${escapeHTML(track.artist)}</span></div>
                <button type="button" class="song-picker-add-btn" data-add-track-title="${escapeHTML(track.title)}" data-add-track-artist="${escapeHTML(track.artist)}" ${alreadyAdded ? 'disabled' : ''}>
                    ${alreadyAdded ? 'Added' : (isPreferred ? 'Add song' : 'Add')}
                </button>
            </div>
        `;
    }).join('');
}

function addTrackToPlaylist(trackTitle, trackArtist, targetKey) {
    const playlist = PLAYLISTS[targetKey];
    if (!playlist || !playlist.isCustom) {
        showToast('Choose one of your playlists first');
        return;
    }

    const track = getAllAvailableTracks().find((item) => item.title === trackTitle && item.artist === trackArtist);
    if (!track) {
        showToast('That song is not available in the catalogue yet');
        return;
    }

    if (playlist.tracks.some((item) => item.title === track.title && item.artist === track.artist)) {
        showToast(`${track.title} is already in ${playlist.title}`);
        renderSongPickerTracks();
        return;
    }

    playlist.tracks.push({ ...track });
    saveCustomPlaylists();
    renderUserPlaylists();

    if (currentPlaylistKey === targetKey) openPlaylist(targetKey);
    showToast(`Added ${track.title} to ${playlist.title}`);
    renderSongPickerTracks();
}

if (addSongsBtn) {
    addSongsBtn.addEventListener('click', () => openSongPicker(currentPlaylistKey));
}

if (songPickerTarget) songPickerTarget.addEventListener('change', renderSongPickerTracks);
if (songPickerSearch) songPickerSearch.addEventListener('input', renderSongPickerTracks);
if (closeSongPickerBtn) closeSongPickerBtn.addEventListener('click', () => { songPickerModal.hidden = true; });
if (songPickerModal) {
    songPickerModal.addEventListener('click', (event) => {
        if (event.target === songPickerModal) songPickerModal.hidden = true;
        const addButton = event.target.closest('[data-add-track-title]');
        if (addButton) addTrackToPlaylist(addButton.dataset.addTrackTitle, addButton.dataset.addTrackArtist, songPickerTarget.value);
    });
}

function removeTrackFromPlaylist(playlistKey, track) {
    const playlist = PLAYLISTS[playlistKey];
    if (!playlist || !playlist.isCustom) return;
    const index = playlist.tracks.findIndex(item => item.title === track.title && item.artist === track.artist);
    if (index < 0) return;
    playlist.tracks.splice(index, 1);
    saveCustomPlaylists();
    if (currentPlaylistKey === playlistKey) openPlaylist(playlistKey);
    showToast(`Removed "${track.title}" from ${playlist.title}`);
}

// The empty playlist action opens the same searchable catalogue.
document.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-open-song-picker]');
    if (openButton) openSongPicker(openButton.dataset.openSongPicker);

    const likeButton = event.target.closest('.track-like-btn');
    if (likeButton) {
        event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation();
        const track = getAllAvailableTracks().find(item => item.title === likeButton.dataset.trackTitle && item.artist === likeButton.dataset.trackArtist);
        if (track) toggleLikedTrack(track);
        return;
    }

    const saveButton = event.target.closest('.track-save-btn');
    if (saveButton) {
        event.preventDefault(); event.stopPropagation();
        const track = getAllAvailableTracks().find(item => item.title === saveButton.dataset.trackTitle && item.artist === saveButton.dataset.trackArtist);
        if (track) toggleSavedTrack(track);
        return;
    }

    const moreButton = event.target.closest('.track-more-btn');
    if (moreButton) {
        event.preventDefault(); event.stopPropagation();
        const title = moreButton.dataset.trackTitle;
        const artist = moreButton.dataset.trackArtist;
        const track = getAllAvailableTracks().find(item => item.title === title && item.artist === artist);
        if (!track) return;
        if (!PLAYLISTS[currentPlaylistKey]?.isCustom) {
            showToast('Songs can only be removed from custom playlists');
            return;
        }
        showEchoBeatDialog({
            eyebrow: 'PLAYLIST ACTION',
            title: 'Remove song from playlist?',
            message: `Remove "${title}" from "${PLAYLISTS[currentPlaylistKey].title}"? The song will remain in your music library.`,
            confirmText: 'Remove from playlist',
            danger: true,
            onConfirm: () => removeTrackFromPlaylist(currentPlaylistKey, track)
        });
    }
});

if (playAllBtn) {
    playAllBtn.addEventListener('click', () => {
        const playlist =
            PLAYLISTS[currentPlaylistKey];
        if (!playlist) return;
        const tracks =
            currentPlaylistKey === 'liked'
                ? getDynamicLikedTracks()
                : currentPlaylistKey === 'saved'
                    ? getDynamicSavedTracks()
                    : playlist.tracks;
        if (!tracks.length) {
            showToast(currentPlaylistKey && PLAYLISTS[currentPlaylistKey]?.isCustom ? 'Add songs to this playlist first' : 'No songs to play yet');
            return;
        }
        playQueue(tracks, 0);
    });
}

document.querySelectorAll('[data-back-to]').forEach((btn) => {
    btn.addEventListener('click', () => {
        showView(homeView);
    });
});

// =====================================================================
// Profile dropdown
// =====================================================================

if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = profileDropdown.classList.toggle('show');
        profileBtn.setAttribute('aria-expanded', isOpen);
    });
}

document.addEventListener('click', (e) => {
    if (profileDropdown && !e.target.closest('.profile-wrap')) {
        profileDropdown.classList.remove('show');
        if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');
    }
});

if (profileDropdown) {
    profileDropdown.querySelectorAll('button[data-action]').forEach((btn) => {
        btn.addEventListener('click', () => {
            profileDropdown.classList.remove('show');
            const action = btn.dataset.action;
            if (action === 'profile') {
                showView(profileView);
            } else if (action === 'settings') {
                showView(settingsView);
            } else if (action === 'logout') {
                logout();
            }
        });
    });
}

// =====================================================================
// Theme + settings (persisted to localStorage)
// =====================================================================

const DEFAULT_SETTINGS = {
    theme: 'dark',
    autoplay: true,
    explicit: true,
    notifications: true,
    dataSaver: false,
    crossfade: false,
    privateSession: false,
};

function loadSettings() {
    try {
        const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY));
        return { ...DEFAULT_SETTINGS, ...(stored || {}) };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
}

function initSettingsUI() {
    const settings = loadSettings();
    applyTheme(settings.theme);

    const map = {
        themeToggle: () => settings.theme === 'light',
        autoplayToggle: () => settings.autoplay,
        explicitToggle: () => settings.explicit,
        notifToggle: () => settings.notifications,
        dataSaverToggle: () => settings.dataSaver,
        crossfadeToggle: () => settings.crossfade,
        privateToggle: () => settings.privateSession,
    };

    Object.keys(map).forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.checked = map[id]();
    });

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const s = loadSettings();
            s.theme = themeToggle.checked ? 'light' : 'dark';
            saveSettings(s);
            applyTheme(s.theme);
        });
    }

    const otherToggles = [
        ['autoplayToggle', 'autoplay'],
        ['explicitToggle', 'explicit'],
        ['notifToggle', 'notifications'],
        ['dataSaverToggle', 'dataSaver'],
        ['crossfadeToggle', 'crossfade'],
        ['privateToggle', 'privateSession'],
    ];

    otherToggles.forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', () => {
            const s = loadSettings();
            s[key] = el.checked;
            saveSettings(s);
        });
    });
}

// =====================================================================
// Auth (login state persisted to localStorage)
// =====================================================================

function setProfileIdentity(identifier) {
    const letter = (identifier || 'U').trim().charAt(0).toUpperCase() || 'U';
    if (profileBtn) profileBtn.textContent = letter;
    if (profileAvatarLg) profileAvatarLg.textContent = letter;
    if (profileEmailEl) profileEmailEl.textContent = identifier || 'EchoBeat user';
}

function enterApp(identifier, method, remember = false) {
    document.querySelectorAll('.auth-screen').forEach((screen) => {
        screen.style.display = 'none';
    });
    mainApp.style.display = 'flex';
    showView(homeView);
    setProfileIdentity(identifier);

    const data = JSON.stringify({ identifier, method, loggedIn: true });
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    // Remember me -> survives closing the browser. Otherwise only this tab session.
    (remember ? localStorage : sessionStorage).setItem(AUTH_KEY, data);
}
function logout() {
    localStorage.removeItem(AUTH_KEY);
sessionStorage.removeItem(AUTH_KEY);
    audioPlayer.pause();
    isPlaying = false;
    setPlayIcon(false);
    mainApp.style.display = 'none';
    showAuthScreen('login');
    showToast('Signed out of EchoBeat');
}

function restoreSession() {
    try {
        const auth = JSON.parse(
            localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY)
        );
        if (auth && auth.loggedIn) {
            enterApp(auth.identifier, auth.method, !!localStorage.getItem(AUTH_KEY));
            return true;
        }
    } catch {
        /* ignore malformed data */
    }
    return false;
}

// =====================================================================
// Loading screen
// =====================================================================

window.addEventListener('load', () => {
    setTimeout(() => {
        if (loadingScreen) loadingScreen.style.display = 'none';
    }, 3000);
});

// =====================================================================
// AUTH: login, Google / Apple, forgot password (phone), sign up
// =====================================================================

const USERS_KEY = 'echobeat_users';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,20}$/;

// ----- Extra element references (Google / Apple screen) -----
const providerPage = document.getElementById('providerPage');
const providerForm = document.getElementById('providerForm');
const providerIcon = document.getElementById('providerIcon');
const providerTitle = document.getElementById('providerTitle');
const providerIdLabel = document.getElementById('providerIdLabel');
const providerId = document.getElementById('providerId');
const providerIdError = document.getElementById('providerIdError');
const providerPassword = document.getElementById('providerPassword');
const providerPasswordError = document.getElementById('providerPasswordError');
const providerSubmitBtn = document.getElementById('providerSubmitBtn');

// ----- Extra element references (sign up) -----
const signupPage = document.getElementById('signupPage');
const signupForm = document.getElementById('signupForm');
const signupUsername = document.getElementById('signupUsername');
const signupUsernameError = document.getElementById('signupUsernameError');
const signupPassword = document.getElementById('signupPassword');
const signupPasswordError = document.getElementById('signupPasswordError');
const confirmPassword = document.getElementById('confirmPassword');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const signupSubmitBtn = document.getElementById('signupSubmitBtn');

// ----- Helpers -----
const authScreens = {
    login: loginPage,
    provider: providerPage,
    phone: phoneLoginScreen,
    signup: signupPage,
};

function showAuthScreen(name) {
    Object.values(authScreens).forEach((screen) => {
        if (screen) screen.style.display = 'none';
    });
    if (authScreens[name]) authScreens[name].style.display = 'flex';
    window.scrollTo(0, 0);
}

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch {
        return {};
    }
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.classList.remove('show');
}

function setError(input, errorEl, message) {
    if (message) {
        errorEl.querySelector('span').textContent = message;
    }
    input.classList.add('error');
    errorEl.classList.add('show');
}

let toastTimer = null;
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// Clear a field's error as soon as the user types in it
document.querySelectorAll('.auth-screen input').forEach((input) => {
    input.addEventListener('input', () => {
        input.classList.remove('error');
        const err = input.closest('.field')?.querySelector('.error-msg');
        if (err) err.classList.remove('show');
    });
});

// Show / hide password (works for every password field)
document.querySelectorAll('.toggle-pass').forEach((btn) => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        if (!input) return;
        const hidden = input.type === 'password';
        input.type = hidden ? 'text' : 'password';
        btn.textContent = hidden ? 'Hide' : 'Show';
    });
});

// =====================================================================
// 1. Username + password login
// =====================================================================

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    let valid = true;

    if (!username) {
        setError(usernameInput, usernameError, 'Please enter your username.');
        valid = false;
    } else {
        clearError(usernameInput, usernameError);
    }

    if (!password) {
        setError(passwordInput, passwordError, 'Please enter your password.');
        valid = false;
    } else {
        clearError(passwordInput, passwordError);
    }

    if (!valid) return;

    const users = getUsers();
    const account = users[username.toLowerCase()];

    if (!account) {
        setError(usernameInput, usernameError, 'No account found with that username. Please sign up first.');
        return;
    }
    if (account.password !== password) {
        setError(passwordInput, passwordError, 'Incorrect password. Please try again.');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    setTimeout(() => {
        showToast('Logged in to EchoBeat 🎧');
        form.reset();
        enterApp(account.username, 'username', document.getElementById('remember').checked);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Log in';
    }, 700);
});

// =====================================================================
// 2. Google / Apple login (Gmail or Apple ID + password)
// =====================================================================

const PROVIDERS = {
    Google: {
        title: 'Continue with Google',
        label: 'Gmail address',
        placeholder: 'yourname@gmail.com',
        regex: GMAIL_REGEX,
        required: 'Please enter your Gmail address.',
        invalid: 'Please enter a valid Gmail address (e.g. name@gmail.com).',
    },
    Apple: {
        title: 'Continue with Apple',
        label: 'Apple ID',
        placeholder: 'name@icloud.com',
        regex: EMAIL_REGEX,
        required: 'Please enter your Apple ID.',
        invalid: 'Please enter a valid Apple ID (usually your email address).',
    },
};

let activeProvider = 'Google';

document.querySelectorAll('.social-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        activeProvider = btn.dataset.provider;
        const cfg = PROVIDERS[activeProvider];

        providerTitle.textContent = cfg.title;
        providerIdLabel.textContent = cfg.label;
        providerId.placeholder = cfg.placeholder;
        providerIcon.innerHTML = btn.querySelector('svg').outerHTML;

        providerForm.reset();
        clearError(providerId, providerIdError);
        clearError(providerPassword, providerPasswordError);

        showAuthScreen('provider');
        providerId.focus();
    });
});

providerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const cfg = PROVIDERS[activeProvider];
    const id = providerId.value.trim();
    const password = providerPassword.value;
    let valid = true;

    if (!id) {
        setError(providerId, providerIdError, cfg.required);
        valid = false;
    } else if (!cfg.regex.test(id)) {
        setError(providerId, providerIdError, cfg.invalid);
        valid = false;
    } else {
        clearError(providerId, providerIdError);
    }

    if (!password) {
        setError(providerPassword, providerPasswordError, 'Please enter your password.');
        valid = false;
    } else if (password.length < 6) {
        setError(providerPassword, providerPasswordError, 'Password must be at least 6 characters.');
        valid = false;
    } else {
        clearError(providerPassword, providerPasswordError);
    }

    if (!valid) return;

    // NOTE: demo only. Real Google / Apple sign-in needs their OAuth SDKs and a backend.
    providerSubmitBtn.disabled = true;
    providerSubmitBtn.textContent = 'Logging in...';

    setTimeout(() => {
        showToast(`Logged in with ${activeProvider} 🎧`);
        enterApp(id, activeProvider.toLowerCase());
        providerForm.reset();
        providerSubmitBtn.disabled = false;
        providerSubmitBtn.textContent = 'Log in';
    }, 800);
});

document.getElementById('providerBackLink').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthScreen('login');
});

// =====================================================================
// 3. Forgot password -> phone number -> verification link
// =====================================================================

document.getElementById('forgotLink').addEventListener('click', (e) => {
    e.preventDefault();
    phoneForm.reset();
    clearError(phoneNumberInput, phoneError);
    phoneStatus.textContent = '';
    showAuthScreen('phone');
});

document.getElementById('backToLoginLink').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthScreen('login');
});

phoneNumberInput.addEventListener('input', () => {
    // keep digits only, max 10
    phoneNumberInput.value = phoneNumberInput.value.replace(/\D/g, '').slice(0, 10);
});

phoneForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const phone = phoneNumberInput.value.trim();

    if (!PHONE_REGEX.test(phone)) {
        setError(phoneNumberInput, phoneError, 'Enter a valid 10-digit phone number.');
        return;
    }
    clearError(phoneNumberInput, phoneError);

    phoneSubmitBtn.disabled = true;
    phoneSubmitBtn.textContent = 'Sending...';
    phoneStatus.textContent = '';

    // NOTE: demo only. Sending a real SMS needs a backend / SMS service.
    setTimeout(() => {
        phoneStatus.textContent = `Verification link sent to +91 ${phone}.`;
        phoneSubmitBtn.textContent = 'Link sent';

        setTimeout(() => {
            phoneSubmitBtn.disabled = false;
            phoneSubmitBtn.textContent = 'Send verification link';
            phoneForm.reset();
            phoneStatus.textContent = '';
            showAuthScreen('login');
            showToast('Check your phone for the verification link');
        }, 2500);
    }, 900);
});

// =====================================================================
// 4. Sign up (username, password, re-confirm password)
// =====================================================================

document.getElementById('signupLink').addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.reset();
    [
        [signupUsername, signupUsernameError],
        [signupPassword, signupPasswordError],
        [confirmPassword, confirmPasswordError],
    ].forEach(([input, err]) => clearError(input, err));
    showAuthScreen('signup');
});

document.getElementById('loginLink').addEventListener('click', (e) => {
    e.preventDefault();
    showAuthScreen('login');
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = signupUsername.value.trim();
    const password = signupPassword.value;
    const confirm = confirmPassword.value;
    const users = getUsers();
    let valid = true;

    // Username
    if (!username) {
        setError(signupUsername, signupUsernameError, 'Please choose a username.');
        valid = false;
    } else if (!USERNAME_REGEX.test(username)) {
        setError(signupUsername, signupUsernameError, 'Use 3–20 letters, numbers, dots, dashes or underscores.');
        valid = false;
    } else if (users[username.toLowerCase()]) {
        setError(signupUsername, signupUsernameError, 'That username is already taken.');
        valid = false;
    } else {
        clearError(signupUsername, signupUsernameError);
    }

    // Password
    if (password.length < 6) {
        setError(signupPassword, signupPasswordError, 'Password must be at least 6 characters.');
        valid = false;
    } else {
        clearError(signupPassword, signupPasswordError);
    }

    // Re-confirm password
    if (!confirm) {
        setError(confirmPassword, confirmPasswordError, 'Please re-enter your password.');
        valid = false;
    } else if (confirm !== password) {
        setError(confirmPassword, confirmPasswordError, 'Passwords do not match.');
        valid = false;
    } else {
        clearError(confirmPassword, confirmPasswordError);
    }

    if (!valid) return;

    // Demo storage only. Never store plain-text passwords in a real app.
    users[username.toLowerCase()] = { username, password };
    saveUsers(users);

    signupSubmitBtn.disabled = true;
    signupSubmitBtn.textContent = 'Creating account...';

    setTimeout(() => {
        showToast(`Welcome to EchoBeat, ${username}! 🎧`);
        signupForm.reset();
        signupSubmitBtn.disabled = false;
        signupSubmitBtn.textContent = 'Sign up';
        enterApp(username, 'signup');
    }, 900);
});

// =====================================================================
// Init
// =====================================================================

initSettingsUI();
restoreSession();

// ---------------------------------------------------------------------
// 1. HOME BUTTON — return to Home from anywhere
// ---------------------------------------------------------------------

function goHome() {
    appViewHistory.length = 0;
    renderUserPlaylists();
    showView(homeView, false);

    // Explicitly restore the home view in case another handler changed its state.
    if (homeView) {
        homeView.hidden = false;
        homeView.removeAttribute('hidden');
        homeView.setAttribute('aria-hidden', 'false');
    }
    if (playlistView) {
        playlistView.hidden = true;
        playlistView.setAttribute('hidden', '');
        playlistView.setAttribute('aria-hidden', 'true');
    }
    if (profileView) {
        profileView.hidden = true;
        profileView.setAttribute('hidden', '');
        profileView.setAttribute('aria-hidden', 'true');
    }
    if (settingsView) {
        settingsView.hidden = true;
        settingsView.setAttribute('hidden', '');
        settingsView.setAttribute('aria-hidden', 'true');
    }
    currentAppView = homeView;

    if (profileDropdown) profileDropdown.classList.remove('show');
    if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');

    const content = document.querySelector('.content');
    if (content) content.scrollTo({ top: 0, behavior: 'auto' });
    if (homeView) homeView.scrollTop = 0;
}

// Expose stable navigation callbacks and bind in capture phase so the header
// keeps working even if another app listener stops bubbling.
window.echoBeatGoHome = goHome;
window.echoBeatGoBack = goBackView;
const headerHomeBtn = document.getElementById('homeNavBtn');
const headerBackBtn = document.getElementById('backNavBtn');

if (headerHomeBtn) {
    headerHomeBtn.type = 'button';
    headerHomeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        goHome();
    }, true);
}
if (headerBackBtn) {
    headerBackBtn.type = 'button';
    headerBackBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        goBackView();
    }, true);
}

// A document-level capture handler ensures these navigation controls still
// work if a nested component or stale handler interferes with button bubbling.
document.addEventListener('click', (event) => {
    const homeButton = event.target.closest('#homeNavBtn');
    const backButton = event.target.closest('#backNavBtn');
    if (homeButton) {
        event.preventDefault();
        event.stopPropagation();
        goHome();
    } else if (backButton) {
        event.preventDefault();
        event.stopPropagation();
        goBackView();
    }
}, true);

// Spotify-like Home filters: All shows everything, Music hides podcasts,
// and Podcasts focuses the podcast section.
document.querySelectorAll('[data-home-filter]').forEach((button) => {
    button.addEventListener('click', () => {
        const filter = button.dataset.homeFilter;
        
        // Active pill style toggle
        document.querySelectorAll('[data-home-filter]').forEach((pill) => pill.classList.toggle('active', pill === button));
        
        if (filter === 'podcasts') {
            // Instantly open our new podcasts playlist page in the UI!
            openPlaylist('podcasts');
            showToast('🎙️ Welcome to EchoBeat Podcasts');
        } else {
            // Restore default view filters for All / Music
            document.querySelectorAll('.home-music-section').forEach((section) => { section.hidden = filter === 'podcasts'; });
            const quickLinks = document.getElementById('homeQuickLinks');
            if (quickLinks) quickLinks.hidden = false;
            const announcement = document.querySelector('.home-announcement');
            if (announcement) announcement.hidden = false;
        }
    });
});


const POPULAR_RADIO_STATIONS = {
    'the-weeknd': {
        name: 'The Weeknd Radio',
        songs: [
            { title: 'Blinding Lights', artist: 'The Weeknd' },
            { title: 'Starboy', artist: 'The Weeknd, Daft Punk' },
            { title: 'Save Your Tears', artist: 'The Weeknd' },
            { title: 'The Hills', artist: 'The Weeknd' },
            { title: 'Die For You', artist: 'The Weeknd' },
            { title: 'I Feel It Coming', artist: 'The Weeknd, Daft Punk' },
            { title: "Can't Feel My Face", artist: 'The Weeknd' },
            { title: 'Call Out My Name', artist: 'The Weeknd' },
            { title: 'Often', artist: 'The Weeknd' },
            { title: 'Sweater Weather', artist: 'The Neighbourhood' },
            { title: 'Daddy Issues', artist: 'The Neighbourhood' },
            { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys' },
            { title: "Why'd You Only Call Me When You're High?", artist: 'Arctic Monkeys' },
            { title: 'Payphone', artist: 'Maroon 5, Wiz Khalifa' },
            { title: 'Animals', artist: 'Maroon 5' }
        ]
    },
    'english-pop': {
        name: 'English Pop Party',
        songs: [
            { title: 'Levitating', artist: 'Dua Lipa' },
            { title: "Don't Start Now", artist: 'Dua Lipa' },
            { title: 'Dance The Night', artist: 'Dua Lipa' },
            { title: 'As It Was', artist: 'Harry Styles' },
            { title: 'Watermelon Sugar', artist: 'Harry Styles' },
            { title: 'Late Night Talking', artist: 'Harry Styles' },
            { title: 'Attention', artist: 'Charlie Puth' },
            { title: "We Don't Talk Anymore", artist: 'Charlie Puth' },
            { title: 'See You Again', artist: 'Wiz Khalifa, Charlie Puth' },
            { title: 'Flowers', artist: 'Miley Cyrus' },
            { title: 'Shape of You', artist: 'Ed Sheeran' },
            { title: 'Cruel Summer', artist: 'Taylor Swift' }
        ]
    },
    'hindi-party': {
        name: 'Hindi Party Anthems',
        songs: [
            { title: 'Kala Chashma', artist: 'Amar Arshi, Badshah, Neha Kakkar' },
            { title: 'Kar Gayi Chull', artist: 'Badshah, Amaal Mallik, Fazilpuria, Sukriti Kakar, Neha Kakkar' },
            { title: 'Abhi Toh Party Shuru Hui Hai', artist: 'Badshah, Aastha Gill' },
            { title: 'The Breakup Song', artist: 'Pritam, Arijit Singh, Badshah, Jonita Gandhi, Nakash Aziz' },
            { title: 'London Thumakda', artist: 'Labh Janjua, Sonu Kakkar, Neha Kakkar' },
            { title: 'Gallan Goodiyaan', artist: 'Yashita Sharma, Manish Kumar Tipu, Farhan Akhtar, Shankar Mahadevan, Sukhwinder Singh' },
            { title: 'Badtameez Dil', artist: 'Benny Dayal, Shefali Alvares' },
            { title: 'Ghungroo', artist: 'Arijit Singh, Shilpa Rao' },
            { title: 'Nashe Si Chadh Gayi', artist: 'Arijit Singh' },
            { title: 'Aankh Marey', artist: 'Neha Kakkar, Mika Singh, Kumar Sanu' },
            { title: 'What Jhumka?', artist: 'Pritam, Arijit Singh, Jonita Gandhi' },
            { title: 'Jhoome Jo Pathaan', artist: 'Arijit Singh, Sukriti Kakar, Vishal-Shekhar' }
        ]
    },
    'punjabi-party': {
        name: 'Punjabi Party Anthems',
        songs: [
            { title: 'Lover', artist: 'Diljit Dosanjh' },
            { title: 'Born to Shine', artist: 'Diljit Dosanjh' },
            { title: 'GOAT', artist: 'Diljit Dosanjh' },
            { title: '52 Bars', artist: 'Karan Aujla' },
            { title: 'Softly', artist: 'Karan Aujla' },
            { title: 'Winning Speech', artist: 'Karan Aujla' },
            { title: 'Insane', artist: 'AP Dhillon, Shinda Kahlon, Gurinder Gill' },
            { title: 'Excuses', artist: 'AP Dhillon, Gurinder Gill' },
            { title: 'Brown Munde', artist: 'AP Dhillon, Gurinder Gill, Shinda Kahlon' },
            { title: 'We Rollin', artist: 'Shubh' },
            { title: 'Cheques', artist: 'Shubh' },
            { title: '295', artist: 'Sidhu Moose Wala' },
            { title: 'So High', artist: 'Sidhu Moose Wala' }
        ]
    },
    'grwm': {
        name: 'GRWM',
        songs: [
            { title: 'Espresso', artist: 'Sabrina Carpenter' },
            { title: 'Please Please Please', artist: 'Sabrina Carpenter' },
            { title: 'Houdini', artist: 'Dua Lipa' },
            { title: 'Levitating', artist: 'Dua Lipa' },
            { title: 'Greedy', artist: 'Tate McRae' },
            { title: 'Paint The Town Red', artist: 'Doja Cat' },
            { title: 'Good as Hell', artist: 'Lizzo' },
            { title: 'Flowers', artist: 'Miley Cyrus' },
            { title: 'Unholy', artist: 'Sam Smith, Kim Petras' },
            { title: "Hips Don't Lie", artist: 'Shakira, Wyclef Jean' },
            { title: 'Taki Taki', artist: 'DJ Snake, Selena Gomez, Ozuna, Cardi B' },
            { title: 'Confident', artist: 'Demi Lovato' }
        ]
    }
};

// Register each radio as a read-only playlist so selecting a station opens
// the same full playlist view used by regular playlists, with every track visible.
const ARTIST_RADIO_STATIONS = {
    'arijit-radio': {
        name: 'Arijit Singh Radio', cover: 'image/Arjit singh.jpeg', songs: [
            { title: 'Tum Hi Ho', artist: 'Arijit Singh' }, { title: 'Channa Mereya', artist: 'Arijit Singh' },
            { title: 'Raabta', artist: 'Arijit Singh' }, { title: 'Agar Tum Saath Ho', artist: 'Alka Yagnik, Arijit Singh' },
            { title: 'Ae Dil Hai Mushkil', artist: 'Arijit Singh' }, { title: 'Kesariya', artist: 'Arijit Singh' },
            { title: 'Phir Le Aya Dil', artist: 'Arijit Singh' }, { title: 'Tera Yaar Hoon Main', artist: 'Arijit Singh' },
            { title: 'Tujhe Kitna Chahne Lage', artist: 'Arijit Singh' }, { title: 'Shayad', artist: 'Arijit Singh' },
            { title: 'Pee Loon', artist: 'Mohit Chauhan' }, { title: 'Iktara', artist: 'Kavita Seth' }
        ]
    },
    'diljit-radio': {
        name: 'Diljit Dosanjh Radio', cover: 'image/Diljit.jpeg', songs: [
            { title: 'Lover', artist: 'Diljit Dosanjh' }, { title: 'Born to Shine', artist: 'Diljit Dosanjh' },
            { title: 'GOAT', artist: 'Diljit Dosanjh' }, { title: 'Naina', artist: 'Diljit Dosanjh, Badshah' },
            { title: 'Hass Hass', artist: 'Diljit Dosanjh, Sia' }, { title: 'Do You Know', artist: 'Diljit Dosanjh' },
            { title: 'Backbone', artist: 'Harrdy Sandhu' }, { title: 'Naah', artist: 'Harrdy Sandhu' },
            { title: '295', artist: 'Sidhu Moose Wala' }, { title: 'So High', artist: 'Sidhu Moose Wala' },
            { title: 'Excuses', artist: 'AP Dhillon, Gurinder Gill' }, { title: 'Insane', artist: 'AP Dhillon' }
        ]
    },
    'shreya-radio': {
        name: 'Shreya Ghoshal Radio', cover: 'image/Shreya.jpeg', songs: [
            { title: 'Teri Ore', artist: 'Shreya Ghoshal, Rahat Fateh Ali Khan' }, { title: 'Sun Raha Hai', artist: 'Shreya Ghoshal' },
            { title: 'Saibo', artist: 'Shreya Ghoshal, Tochi Raina' }, { title: 'Deewani Mastani', artist: 'Shreya Ghoshal' },
            { title: 'Chikni Chameli', artist: 'Shreya Ghoshal' }, { title: 'Jaadu Hai Nasha Hai', artist: 'Shreya Ghoshal' },
            { title: 'Agar Tum Mil Jao', artist: 'Shreya Ghoshal' }, { title: 'Param Sundari', artist: 'Shreya Ghoshal' },
            { title: 'Tum Kya Mile', artist: 'Shreya Ghoshal, Arijit Singh' }, { title: 'Ghar More Pardesiya', artist: 'Shreya Ghoshal' },
            { title: 'Tere Bina', artist: 'A. R. Rahman, Chinmayi' }, { title: 'Aaj Ki Raat', artist: 'Madhubanti Bagchi, Divya Kumar' }
        ]
    },
    'atif-radio': {
        name: 'Atif Aslam Radio', cover: 'image/Atif.jpeg', songs: [
            { title: 'Tera Hone Laga Hoon', artist: 'Atif Aslam, Alisha Chinai' }, { title: 'Jeene Laga Hoon', artist: 'Atif Aslam, Shreya Ghoshal' },
            { title: 'Pehli Nazar Mein', artist: 'Atif Aslam' }, { title: 'Tu Jaane Na', artist: 'Atif Aslam' },
            { title: 'Dil Diyan Gallan', artist: 'Atif Aslam' }, { title: 'Tere Sang Yaara', artist: 'Atif Aslam' },
            { title: 'Woh Lamhe', artist: 'Atif Aslam' }, { title: 'O Saathi', artist: 'Atif Aslam' },
            { title: 'Aadat', artist: 'Atif Aslam' }, { title: 'Piya O Re Piya', artist: 'Atif Aslam, Shreya Ghoshal' },
            { title: 'Zindagi Aa Raha Hoon Main', artist: 'Atif Aslam' }, { title: 'Kaise Bataaoon', artist: 'KK, Atif Aslam' }
        ]
    },
    'karan-radio': {
        name: 'Karan Aujla Radio', cover: 'image/Karan Aujla.jpeg', songs: [
            { title: 'Softly', artist: 'Karan Aujla' }, { title: '52 Bars', artist: 'Karan Aujla' },
            { title: 'Winning Speech', artist: 'Karan Aujla' }, { title: 'Tauba Tauba', artist: 'Karan Aujla' },
            { title: 'Players', artist: 'Badshah, Karan Aujla' }, { title: 'Admiring You', artist: 'Karan Aujla, Preet Aujla' },
            { title: 'On Top', artist: 'Karan Aujla' }, { title: 'Chitta Kurta', artist: 'Karan Aujla' },
            { title: 'We Rollin', artist: 'Shubh' }, { title: 'Cheques', artist: 'Shubh' },
            { title: 'Brown Munde', artist: 'AP Dhillon, Gurinder Gill, Shinda Kahlon' }, { title: 'Insane', artist: 'AP Dhillon' }
        ]
    }
};

Object.entries({ ...POPULAR_RADIO_STATIONS, ...ARTIST_RADIO_STATIONS }).forEach(([key, station]) => {
    PLAYLISTS[key] = {
        title: station.name,
        cover: station.cover || ({ 'the-weeknd': 'image/the weeknd.jpg', 'english-pop': 'image/Happy vibes.jpg', 'hindi-party': 'image/Arjit singh.jpeg', 'punjabi-party': 'image/Karan Aujla.jpeg', grwm: 'image/grwm.jpg' }[key] || 'image/Starboy.jpg'),
        tracks: tracksFromList(station.songs),
        isRadioStation: true
    };
});

function playPopularRadioStation(stationKey) {
    if (!PLAYLISTS[stationKey]) return;
    openPlaylist(stationKey);
}

// Capture station-card clicks before other home-card handlers can swallow them.
// This also supports cards rendered or re-rendered after initial page setup.
document.addEventListener('click', (event) => {
    const card = event.target.closest('[data-radio-station], .artist .slider .card');
    if (!card) return;
    let stationKey = card.dataset.radioStation;
    if (!stationKey && card.closest('.artist')) {
        const cards = Array.from(card.closest('.slider').querySelectorAll('.card'));
        const index = cards.indexOf(card);
        stationKey = ['arijit-radio', 'diljit-radio', 'shreya-radio', 'atif-radio', 'karan-radio'][index];
    }
    if (!stationKey || !PLAYLISTS[stationKey]) return;
    event.preventDefault();
    event.stopPropagation();
    openPlaylist(stationKey);
}, true);

document.querySelectorAll('[data-radio-station]').forEach((card) => {
    const activateStation = () => playPopularRadioStation(card.dataset.radioStation);
    card.addEventListener('click', activateStation);
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            activateStation();
        }
    });
});

const artistRadioKeys = ['arijit-radio', 'diljit-radio', 'shreya-radio', 'atif-radio', 'karan-radio'];

// The Recommended Stations row uses .station-card (not .artist .slider .card),
// so wire these five cards explicitly to the same full playlist views.
document.querySelectorAll('.recommended-stations .station-grid .station-card').forEach((card, index) => {
    const stationKey = artistRadioKeys[index];
    if (!stationKey || !PLAYLISTS[stationKey]) return;
    card.dataset.radioStation = stationKey;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open ${PLAYLISTS[stationKey].title}`);
});
document.querySelectorAll('.artist .slider .card').forEach((card, index) => {
    const stationKey = artistRadioKeys[index];
    if (!stationKey) return;
    card.dataset.radioStation = stationKey;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Open ${PLAYLISTS[stationKey].title}`);
    const activate = () => openPlaylist(stationKey);
    card.addEventListener('click', activate);
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
    });
});

const popularStationsShowAll = document.getElementById('popularStationsShowAll');
const popularStationGrid = document.getElementById('popularStationGrid');
if (popularStationsShowAll && popularStationGrid) {
    popularStationsShowAll.addEventListener('click', (event) => {
        event.preventDefault();
        const expanded = popularStationGrid.classList.toggle('show-all');
        popularStationsShowAll.textContent = expanded ? 'Show Less' : 'Show All';
        popularStationsShowAll.setAttribute('aria-expanded', String(expanded));
    });
}

const exploreMusicBtn = document.getElementById('exploreMusicBtn');
if (exploreMusicBtn) exploreMusicBtn.addEventListener('click', () => {
    const popular = document.querySelector('.popular');
    if (popular) popular.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('.home-show-all').forEach((link) => link.addEventListener('click', (event) => event.preventDefault()));
const recentsShowAll = document.getElementById('recentsShowAll');
if (recentsShowAll) recentsShowAll.addEventListener('click', (event) => { event.preventDefault(); showAllRecents = !showAllRecents; renderRecents(); });
renderRecents();

// ---------------------------------------------------------------------
// 2. SEARCH CONTROLS
// ---------------------------------------------------------------------

const searchInput = document.querySelector('.search-bar input');
const searchIcon = document.querySelector('.search-bar .fa-magnifying-glass');

function focusSearch() {
    if (!searchInput) return;

    searchInput.focus();
    searchInput.select();
}

if (searchIcon) {
    searchIcon.addEventListener('click', focusSearch);
}


// ---------------------------------------------------------------------
// 3. SPOTIFY-LIKE LIVE SEARCH
// ---------------------------------------------------------------------
const mainSearchInput = document.getElementById('mainSearchInput') || document.querySelector('.search-bar input');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const searchDropdown = document.getElementById('searchResultsDropdown');
const bestMatchSection = document.getElementById('bestMatchSection');
const bestMatchCard = document.getElementById('bestMatchCard');
const songsMatchSection = document.getElementById('songsMatchSection');
const songsResultList = document.getElementById('songsResultList');
const noSearchResults = document.getElementById('noSearchResults');
const noResultsQuery = document.getElementById('noResultsQuery');

function closeSearchDropdown() {
    if (searchDropdown) searchDropdown.hidden = true;
}

function handleLiveSearch() {
    if (!mainSearchInput || !searchDropdown) return;

    const query = mainSearchInput.value.trim().toLowerCase();

    // Show/hide Clear (X) button
    if (clearSearchBtn) {
        clearSearchBtn.hidden = query.length === 0;
    }

    // Hide dropdown if query is empty
    if (!query) {
        closeSearchDropdown();
        return;
    }

    // Pull catalogue of all tracks
    const allTracks = getAllAvailableTracks();

    // Filter by title or artist
    const matches = allTracks.filter(track =>
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        bestMatchSection.hidden = true;
        songsMatchSection.hidden = true;
        noResultsQuery.textContent = mainSearchInput.value.trim();
        noSearchResults.hidden = false;
        searchDropdown.hidden = false;
        return;
    }

    noSearchResults.hidden = true;

    // 1. Render Best Match (Top result)
    const bestMatch = matches[0];
    bestMatchCard.innerHTML = `
        <img src="${escapeHTML(bestMatch.cover)}" alt="${escapeHTML(bestMatch.title)}" onerror="this.src='image/All the Stars.jpg'">
        <div class="best-match-info">
            <div class="title">${escapeHTML(bestMatch.title)}</div>
            <div class="meta">
                <span class="tag">Song</span>
                <span>${escapeHTML(bestMatch.artist)}</span>
            </div>
        </div>
        <div class="play-action">
            <i class="fa-solid fa-play"></i>
        </div>
    `;
    bestMatchCard.onclick = () => {
        currentPlaylistKey = null;
        playQueue([bestMatch], 0);
        showToast(`Playing ${bestMatch.title}`);
        closeSearchDropdown();
    };
    bestMatchSection.hidden = false;

    // 2. Render Songs List (up to 5 like Spotify)
    songsResultList.innerHTML = '';
    const topMatches = matches.slice(0, 5);

    topMatches.forEach((track) => {
        const item = document.createElement('div');
        item.className = 'search-track-item';
        item.innerHTML = `
            <div class="search-track-left">
                <img src="${escapeHTML(track.cover)}" alt="${escapeHTML(track.title)}" onerror="this.src='image/All the Stars.jpg'">
                <div class="search-track-details">
                    <h4>${escapeHTML(track.title)}</h4>
                    <p>${escapeHTML(track.artist)}</p>
                </div>
            </div>
            <div class="search-track-right">
                <i class="fa-solid fa-circle-play search-track-play-icon"></i>
            </div>
        `;

        item.addEventListener('click', () => {
            currentPlaylistKey = null;
            // Play queue of filtered matches starting with this song
            playQueue(matches, matches.indexOf(track));
            showToast(`Playing ${track.title}`);
            closeSearchDropdown();
        });

        songsResultList.appendChild(item);
    });

    songsMatchSection.hidden = false;
    searchDropdown.hidden = false;
}

// Input event listener for instant typing results
if (mainSearchInput) {
    mainSearchInput.addEventListener('input', handleLiveSearch);

    mainSearchInput.addEventListener('focus', () => {
        if (mainSearchInput.value.trim()) {
            handleLiveSearch();
        }
    });

    // Enter key plays the top result immediately
    mainSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const firstResult = songsResultList?.querySelector('.search-track-item');
            if (firstResult) {
                firstResult.click();
            }
        } else if (e.key === 'Escape') {
            closeSearchDropdown();
            mainSearchInput.blur();
        }
    });
}

// Clear button logic
if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // 👈 Stops the click from bubbling up and keeping the dropdown open!
        mainSearchInput.value = '';
        clearSearchBtn.hidden = true;
        closeSearchDropdown();
        mainSearchInput.focus();
    });
}


// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.header-center')) {
        closeSearchDropdown();
    }
});


// ---------------------------------------------------------------------
// 4. SIDEBAR PLAYLISTS
// ---------------------------------------------------------------------

// The sidebar starts with no user-created playlists. The plus button creates
// them; saved playlists are restored from localStorage on the next visit.
renderUserPlaylists();

// Bookmark/library button → Liked Songs
const libraryButton = document.querySelector('.library-icon');

if (libraryButton) {

    libraryButton.style.cursor = 'pointer';

    libraryButton.addEventListener('click', () => {
        openPlaylist('liked');
    });

}


// ---------------------------------------------------------------------
// 5. LIKE / UNLIKE SYSTEM
// ---------------------------------------------------------------------

function isSongLiked(title) {

    return getLikedSongs().includes(title);

}

// Update the appearance of a heart icon
function updateHeartIcon(icon, liked) {

    if (!icon) return;

    icon.classList.toggle('fa-solid', liked);
    icon.classList.toggle('fa-regular', !liked);

    icon.style.color = liked ? '#1DB954' : '#B3B3B3';

}


// Refresh every visible heart
function refreshLikeIcons() {

    const currentTrack =
        currentQueue.length && currentIndex >= 0
            ? currentQueue[currentIndex]
            : null;

    // Now Playing heart
    document.querySelectorAll(
        '.now-playing-card .fa-heart'
    ).forEach(icon => {

        updateHeartIcon(
            icon,
            currentTrack
                ? isSongLiked(currentTrack.title)
                : false
        );

    });

    // Bottom player heart
    document.querySelectorAll(
        '.player-left .fa-heart'
    ).forEach(icon => {

        updateHeartIcon(
            icon,
            currentTrack
                ? isSongLiked(currentTrack.title)
                : false
        );

    });

    // Playlist row hearts
    document.querySelectorAll(
        '.track-row .fa-heart'
    ).forEach(icon => {

        const row =
            icon.closest('.track-row');

        if (!row) return;

        const titleElement =
            row.querySelector('.track-text h4');

        if (!titleElement) return;

        updateHeartIcon(
            icon,
            isSongLiked(
                titleElement.textContent.trim()
            )
        );

    });

}

// Refresh the currently open Liked Songs playlist
if (currentPlaylistKey === 'liked') {
    openPlaylist('liked');
}

// Capture-phase listener.
// This prevents clicking a heart from also triggering
// the playlist row's "play song" click.
document.addEventListener('click', (event) => {

    const heart = event.target.closest('.fa-heart');

    if (!heart) return;


    let title = null;

    // Heart inside playlist row
    const row = heart.closest('.track-row');

    if (row) {

        const titleElement =
            row.querySelector('.track-text h4');

        if (titleElement) {
            title = titleElement.textContent.trim();
        }

    }


    // Heart inside player / Now Playing
    if (!title && currentQueue.length && currentIndex >= 0) {

        title = currentQueue[currentIndex].title;

    }


    if (!title) return;


    // Stop row click from playing the song
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();


    const likedSongs = getLikedSongs();

    const index = likedSongs.indexOf(title);

    let liked;

    if (index === -1) {

        likedSongs.push(title);
        liked = true;

    } else {

        likedSongs.splice(index, 1);
        liked = false;

    }

    saveLikedSongs(likedSongs);

    updateHeartIcon(heart, liked);

    refreshLikeIcons();

    // If currently viewing Liked Songs,
    // immediately rebuild the list.
    if (currentPlaylistKey === 'liked') {
        openPlaylist('liked');
    }

    showToast(
        liked
            ? `❤️ Added "${title}" to Liked Songs`
            : `Removed "${title}" from Liked Songs`
    );

}, true);

// Refresh hearts whenever a new song loads
audioPlayer.addEventListener('loadstart', () => {

    setTimeout(() => {
        refreshLikeIcons();
    }, 50);

});


// ---------------------------------------------------------------------
// 6. VOLUME CONTROL
// ---------------------------------------------------------------------

const volumeIcon =
    document.querySelector('.player-right .fa-volume-high');

const volumeTrack =
    document.querySelector('.volume-track');

const volumeFill =
    document.querySelector('.volume-fill');

let previousVolume = 1;


// Set initial volume
audioPlayer.volume = 1;

if (volumeFill) {
    volumeFill.style.width = '100%';
}


// Click volume bar
if (volumeTrack) {

    volumeTrack.addEventListener('click', (event) => {

        const rect =
            volumeTrack.getBoundingClientRect();

        let volume =
            (event.clientX - rect.left) / rect.width;

        volume = Math.max(0, Math.min(1, volume));

        audioPlayer.volume = volume;

        if (volume > 0) {
            previousVolume = volume;
        }

        if (volumeFill) {
            volumeFill.style.width =
                `${volume * 100}%`;
        }

        updateVolumeIcon();

    });

}


// Mute / unmute
if (volumeIcon) {

    volumeIcon.style.cursor = 'pointer';

    volumeIcon.addEventListener('click', () => {

        if (audioPlayer.volume > 0) {

            previousVolume =
                audioPlayer.volume;

            audioPlayer.volume = 0;

        } else {

            audioPlayer.volume =
                previousVolume || 1;

        }

        if (volumeFill) {

            volumeFill.style.width =
                `${audioPlayer.volume * 100}%`;

        }

        updateVolumeIcon();

    });

}


function updateVolumeIcon() {

    if (!volumeIcon) return;

    volumeIcon.classList.remove(
        'fa-volume-high',
        'fa-volume-low',
        'fa-volume-xmark'
    );

    if (audioPlayer.volume === 0) {

        volumeIcon.classList.add(
            'fa-volume-xmark'
        );

    } else if (audioPlayer.volume < 0.5) {

        volumeIcon.classList.add(
            'fa-volume-low'
        );

    } else {

        volumeIcon.classList.add(
            'fa-volume-high'
        );

    }

}


// ---------------------------------------------------------------------
// 7. SONG FULLSCREEN PLAYER
// ---------------------------------------------------------------------

let fullscreenOverlay = null;

function openSongFullscreen() {

    if (
        !currentQueue.length ||
        currentIndex < 0
    ) {

        showToast('Play a song first');
        return;

    }

    const track =
        currentQueue[currentIndex];


    // Remove an old overlay if one exists
    if (fullscreenOverlay) {
        fullscreenOverlay.remove();
    }


    fullscreenOverlay =
        document.createElement('div');

    fullscreenOverlay.id =
        'echoBeatFullscreen';


    fullscreenOverlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: ${document.documentElement.getAttribute('data-theme') === 'light' ? '#ffffff' : '#050505'};
        color: ${document.documentElement.getAttribute('data-theme') === 'light' ? '#121212' : '#ffffff'};


        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        box-sizing: border-box;
        font-family: Montserrat, Arial, sans-serif;
    `;


    fullscreenOverlay.innerHTML = `

        <button
            id="echoFullscreenClose"
            style="
                position:absolute;
                top:25px;
                right:30px;
                width:45px;
                height:45px;
                border:0;
                border-radius:50%;
                background:#222;
                color:white;
                font-size:20px;
                cursor:pointer;
            "
        >
            <i class="fa-solid fa-xmark"></i>
        </button>


        <img
            id="echoFullscreenCover"
            src="${track.cover}"
            alt="${track.title}"
            style="
                width:min(55vw, 430px);
                height:min(55vw, 430px);
                object-fit:cover;
                border-radius:14px;
                box-shadow:0 20px 60px rgba(0,0,0,.55);
                margin-bottom:30px;
            "
        >


        <h1
            id="echoFullscreenTitle"
            style="
                margin:0 0 8px;
                font-size:clamp(26px,4vw,44px);
                text-align:center;
            "
        >
            ${track.title}
        </h1>


        <p
            id="echoFullscreenArtist"
            style="
                margin:0 0 28px;
                color:#aaa;
                font-size:18px;
            "
        >
            ${track.artist}
        </p>


        <button
            id="echoFullscreenPlay"
            style="
                width:70px;
                height:70px;
                border:0;
                border-radius:50%;
                background:#fff;
                color:#111;
                font-size:25px;
                cursor:pointer;
            "
        >
            <i class="fa-solid fa-pause"></i>
        </button>

    `;


    document.body.appendChild(
        fullscreenOverlay
    );


    const closeBtn =
        document.getElementById(
            'echoFullscreenClose'
        );

    const fsPlay =
        document.getElementById(
            'echoFullscreenPlay'
        );


    function updateFullscreenPlayer() {

        if (!fullscreenOverlay) return;

        const current =
            currentQueue[currentIndex];

        if (!current) return;


        const cover =
            document.getElementById(
                'echoFullscreenCover'
            );

        const title =
            document.getElementById(
                'echoFullscreenTitle'
            );

        const artist =
            document.getElementById(
                'echoFullscreenArtist'
            );

        if (cover) {
            cover.src = current.cover;
        }

        if (title) {
            title.textContent =
                current.title;
        }

        if (artist) {
            artist.textContent =
                current.artist;
        }

        if (fsPlay) {

            fsPlay.innerHTML =
                isPlaying
                    ? '<i class="fa-solid fa-pause"></i>'
                    : '<i class="fa-solid fa-play"></i>';

        }

    }


    function closeFullscreen() {

        if (
            document.fullscreenElement &&
            document.exitFullscreen
        ) {

            document.exitFullscreen()
                .catch(() => {});

        }

        if (fullscreenOverlay) {

            fullscreenOverlay.remove();
            fullscreenOverlay = null;

        }

    }


    closeBtn.addEventListener(
        'click',
        closeFullscreen
    );


    fsPlay.addEventListener('click', () => {

        togglePlayPause();

        setTimeout(
            updateFullscreenPlayer,
            50
        );

    });


    // Update fullscreen display when songs change
    audioPlayer.addEventListener(
        'loadedmetadata',
        updateFullscreenPlayer
    );


    // Open actual browser fullscreen
    if (fullscreenOverlay.requestFullscreen) {

        fullscreenOverlay
            .requestFullscreen()
            .catch(() => {});

    }

}


// Both fullscreen buttons:
// - Now Playing fullscreen
// - Bottom player fullscreen
const fullscreenBtn = document.getElementById('playerFullscreenBtn');

if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            console.error('Fullscreen error:', error);
        }
    });
}

const coverFullscreenBtn = document.querySelector(
    '.right-sidebar-actions .fa-expand'
);

if (coverFullscreenBtn) {
    coverFullscreenBtn.addEventListener('click', () => {
        openSongFullscreen();
    });
}

// Escape / browser fullscreen exit
document.addEventListener(
    'fullscreenchange',
    () => {

        if (
            !document.fullscreenElement &&
            fullscreenOverlay
        ) {

            fullscreenOverlay.remove();
            fullscreenOverlay = null;

        }

    }
);


// ---------------------------------------------------------------------
// 8. MAKE HOME WORK FROM ANY CURRENT VIEW
// ---------------------------------------------------------------------

document.addEventListener('keydown', (event) => {

    // Escape from a playlist/profile/settings returns home
    if (
        event.key === 'Escape' &&
        !document.fullscreenElement
    ) {

        if (
            playlistView &&
            !playlistView.hidden
        ) {

            goHome();

        } else if (
            profileView &&
            !profileView.hidden
        ) {

            goHome();

        } else if (
            settingsView &&
            !settingsView.hidden
        ) {

            goHome();

        }

    }

});


// Initial UI state
renderUserPlaylists();
refreshLikeIcons();
updateVolumeIcon();

console.log(
    'EchoBeat interactive controls loaded successfully.'
);

// Playlist management stays in the main playlist toolbar, never in the sidebar.
const playlistManagementTrigger = document.getElementById('playlistManagementTrigger');
const playlistManagementMenu = document.getElementById('playlistManagementMenu');
const playlistManagement = document.getElementById('playlistManagement');

if (playlistManagementTrigger && playlistManagementMenu) {
    playlistManagementTrigger.addEventListener('click', (event) => {
        event.stopPropagation();
        const opening = playlistManagementMenu.hidden;
        playlistManagementMenu.hidden = !opening;
        playlistManagementTrigger.setAttribute('aria-expanded', String(opening));
    });

    playlistManagementMenu.addEventListener('click', (event) => {
        const actionButton = event.target.closest('[data-playlist-action]');
        if (!actionButton) return;
        playlistManagementMenu.hidden = true;
        playlistManagementTrigger.setAttribute('aria-expanded', 'false');
        manageCurrentPlaylist(actionButton.dataset.playlistAction);
    });

    document.addEventListener('click', (event) => {
        if (playlistManagement && !playlistManagement.contains(event.target)) {
            playlistManagementMenu.hidden = true;
            playlistManagementTrigger.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && playlistManagementMenu && !playlistManagementMenu.hidden) {
            playlistManagementMenu.hidden = true;
            playlistManagementTrigger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Search within the currently open playlist by song title prefix.
// This is separate from the global search and works for every playlist type.
const playlistSearchInput = document.getElementById('playlistSearchInput');

if (playlistSearchInput) {
    playlistSearchInput.addEventListener('input', () => {
        if (!trackListEl) return;

        const query = playlistSearchInput.value.trim().toLocaleLowerCase();
        const rows = Array.from(trackListEl.querySelectorAll('.track-row'));
        let visibleCount = 0;

        rows.forEach((row) => {
            const title = row.querySelector('.track-text h4')?.textContent.trim().toLocaleLowerCase() || '';
            const matches = !query || title.startsWith(query);
            row.hidden = !matches;
            if (matches) visibleCount += 1;
        });

        const previousEmpty = trackListEl.querySelector('.playlist-search-empty');
        if (previousEmpty) previousEmpty.remove();

        if (query && rows.length > 0 && visibleCount === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'playlist-search-empty';
            emptyState.textContent = `No songs starting with “${playlistSearchInput.value.trim()}” in this playlist.`;
            trackListEl.appendChild(emptyState);
        }
    });
}
// =====================================================================
// 🎙️ ECHOBEAT PODCASTS ENGINE (Dedicated Folders + Instant Playback)
// =====================================================================

const ECHOBEAT_PODCASTS = [
    {
        title: "Will AI Replace Coders",
        artist: "Tech Wave Podcast",
        cover: "image/podcasts/Will AI Replace Coders.png",
        altCover: "image/podcasts/podcast1.png",
        src: "music/podcasts/Will AI Replace Coders.mp3",
        host: "Alex Rivera",
        writers: "Tech Wave Media",
        producers: "Silicon Waves Studio"
    },
    {
        title: "How to Build Habits",
        artist: "Mindset & Growth",
        cover: "image/podcasts/How to Build Habits.png",
        altCover: "image/podcasts/podcast2.png",
        src: "music/podcasts/How to Build Habits.mp3",
        host: "Dr. Elena Vance",
        writers: "Behavioral Lab",
        producers: "Mindset Audio"
    },
    {
        title: "Mystery of Room 104",
        artist: "Sarah Koenig True Crime",
        cover: "image/podcasts/Mystery of Room 104.png",
        altCover: "image/podcasts/podcast3.png",
        src: "music/podcasts/Mystery of Room 104.mp3",
        host: "Sarah Koenig",
        writers: "Investigative Unit",
        producers: "Crime Pulse Network"
    },
    {
        title: "Investing for Gen Z",
        artist: "Financial Freedom",
        cover: "image/podcasts/Investing for Gen Z.png",
        altCover: "image/podcasts/podcast4.png",
        src: "music/podcasts/Investing for Gen Z.mp3",
        host: "Marcus Chen",
        writers: "FinLit Collective",
        producers: "Apex Capital Media"
    },
    {
        title: "What Inside Black Holes",
        artist: "Cosmos & Beyond",
        cover: "image/podcasts/What Inside Black Holes.png",
        altCover: "image/podcasts/podcast5.png",
        src: "music/podcasts/What Inside Black Holes.mp3",
        host: "Dr. Neil K.",
        writers: "Astrophysics Journal",
        producers: "CosmoSound Labs"
    },
    {
        title: "Science of Deep Sleep",
        artist: "Neuroscience Daily",
        cover: "image/podcasts/Science of Deep Sleep.png",
        altCover: "image/podcasts/podcast6.png",
        src: "music/podcasts/Science of Deep Sleep.mp3",
        host: "Maya Patel, PhD",
        writers: "Sleep Science Inst.",
        producers: "BioAcoustic Lab"
    },
    {
        title: "How Hip Hop Took Over",
        artist: "Culture Beats",
        cover: "image/podcasts/How Hip Hop Took Over.png",
        altCover: "image/podcasts/podcast7.png",
        src: "music/podcasts/How Hip Hop Took Over.mp3",
        host: "Derrick Vance",
        writers: "Culture Beats Editorial",
        producers: "Urban Sonic Media"
    },
    {
        title: "Alexandria Burning",
        artist: "History Unearthed",
        cover: "image/podcasts/Alexandria Burning.png",
        altCover: "image/podcasts/podcast8.png",
        src: "music/podcasts/Alexandria Burning.mp3",
        host: "Prof. Arthur Scott",
        writers: "Scott Historical Review",
        producers: "Chronos Audio"
    },
    {
        title: "Failing and Pivoting",
        artist: "Startup Stories",
        cover: "image/podcasts/Failing and Pivoting.png",
        altCover: "image/podcasts/podcast9.png",
        src: "music/podcasts/Failing and Pivoting.mp3",
        host: "Sofia Romero",
        writers: "Venture Insights",
        producers: "Foundercast Media"
    },
    {
        title: "Stoic Creative Focus",
        artist: "Modern Stoicism",
        cover: "image/podcasts/Stoic Creative Focus.png",
        altCover: "image/podcasts/podcast10.png",
        src: "music/podcasts/Stoic Creative Focus.mp3",
        host: "Julian Thorne",
        writers: "Modern Stoic Guild",
        producers: "Ataraxia Studio"
    }
];
// =====================================================================
// 🎙️ ECHOBEAT PODCASTS ENGINE (Connected to Existing Player & Sidebar)
// =====================================================================

// Helper to update the existing footer player & right sidebar
function updatePodcastUI(podcast) {
    if (!podcast) return;

    // 1. Bottom Music Player Bar (.player-left)
    const footerImg = document.querySelector('.player-left img');
    const footerTitle = document.querySelector('.player-left .track-details h4');
    const footerArtist = document.querySelector('.player-left .track-details p');

    if (footerImg) footerImg.src = podcast.cover;
    if (footerTitle) footerTitle.textContent = podcast.title;
    if (footerArtist) footerArtist.textContent = podcast.artist;

    // 2. Right Sidebar Now Playing (.now-playing-card)
    const rightImg = document.querySelector('.now-playing-card .album-cover');
    const rightTitle = document.querySelector('.now-playing-card .song-text h3');
    const rightArtist = document.querySelector('.now-playing-card .song-text p');

    if (rightImg) rightImg.src = podcast.cover;
    if (rightTitle) rightTitle.textContent = podcast.title;
    if (rightArtist) rightArtist.textContent = podcast.artist;

    // 3. Right Sidebar "About the artist" section
    const artistBanner = document.querySelector('.artist-card .artist-banner');
    const artistTopHeader = document.querySelector('.artist-card .artist-top h3');
    const artistDesc = document.querySelector('.artist-card .artist-description');
    const monthlyListeners = document.querySelector('.artist-card .monthly-listeners');

    if (artistBanner) artistBanner.src = podcast.cover;
    if (artistTopHeader) artistTopHeader.textContent = podcast.host || podcast.artist;
    if (monthlyListeners) monthlyListeners.textContent = 'Podcast Host & Creator';
    if (artistDesc) {
        artistDesc.textContent = `${podcast.title} — Produced by ${podcast.producers || 'EchoBeat Studios'} & written by ${podcast.writers || 'Editorial Team'}.`;
    }

    // 4. Right Sidebar Credits Card
    const creditItems = document.querySelectorAll('.credits-card .credit-item');
    if (creditItems.length >= 3) {
        // First item: Host
        const h1 = creditItems[0].querySelector('h4');
        const p1 = creditItems[0].querySelector('p');
        if (h1) h1.textContent = podcast.host || podcast.artist;
        if (p1) p1.textContent = 'Host / Creator';

        // Second item: Producer
        const h2 = creditItems[1].querySelector('h4');
        const p2 = creditItems[1].querySelector('p');
        if (h2) h2.textContent = podcast.producers || 'Audio Production';
        if (p2) p2.textContent = 'Production';

        // Third item: Writer
        const h3 = creditItems[2].querySelector('h4');
        const p3 = creditItems[2].querySelector('p');
        if (h3) h3.textContent = podcast.writers || 'Editorial';
        if (p3) p3.textContent = 'Writer / Content';
    }

    // 5. Toggle main play button icon to pause
    const mainPlayIcon = document.querySelector('.play-btn i');
    if (mainPlayIcon) {
        mainPlayIcon.classList.remove('fa-play');
        mainPlayIcon.classList.add('fa-pause');
    }

    if (typeof showToast === 'function') {
        showToast(`🎙️ Playing: ${podcast.title}`);
    }
}

// Seamless podcast playback using your master audioPlayer engine
function playPodcastAudio(podcast) {
    if (!podcast) return;

    // Standardize track object format so existing app controls can handle it
    const trackObj = {
        title: podcast.title,
        artist: podcast.artist,
        cover: podcast.cover,
        audio: podcast.src,
        video: null
    };

    // Use the global audioPlayer instance if defined in script.js
    const player = (typeof audioPlayer !== 'undefined') ? audioPlayer : getEchoBeatAudio();

    player.pause();

    const candidateSources = [
        podcast.src,
        podcast.src.replace('music/podcasts/', 'music/'),
        encodeURI(podcast.src)
    ];

    let currentSourceIdx = 0;

    function tryPlaySource() {
        if (currentSourceIdx >= candidateSources.length) {
            console.error(`[EchoBeat] Audio file not found for "${podcast.title}".`);
            if (typeof showToast === 'function') {
                showToast(`⚠️ Could not find audio file for ${podcast.title}`);
            }
            return;
        }

        const currentPath = candidateSources[currentSourceIdx];
        player.src = currentPath;
        player.currentTime = 0;

        const playPromise = player.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Keep the app's global state synced
                if (typeof isPlaying !== 'undefined') isPlaying = true;
                if (typeof setPlayIcon === 'function') setPlayIcon(true);
                if (typeof rememberRecentTrack === 'function') rememberRecentTrack(trackObj);

                // Update UI elements in footer and right sidebar
                updatePodcastUI(podcast);
            }).catch((err) => {
                console.warn(`[EchoBeat] Path failed: ${currentPath}, checking fallback...`, err);
                currentSourceIdx++;
                tryPlaySource();
            });
        }
    }

    tryPlaySource();
}

// Fallback helper to retrieve or create audio element if needed
function getEchoBeatAudio() {
    let audio = document.querySelector('audio');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'echobeatAudio';
        audio.preload = 'auto';
        document.body.appendChild(audio);
    }
    return audio;
}

// Render the 10 podcast cards into #homePodcastSlider
function renderEchoBeatPodcasts() {
    const slider = document.getElementById('homePodcastSlider');
    if (!slider) return;

    slider.innerHTML = '';

    ECHOBEAT_PODCASTS.forEach((podcast, index) => {
        const card = document.createElement('div');
        card.className = 'podcast-slider-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Play ${podcast.title}`);

        card.innerHTML = `
            <div class="podcast-card-img-wrap">
                <img src="${podcast.cover}" 
                     alt="${podcast.title}" 
                     loading="lazy" 
                     onerror="if(this.src!=='${podcast.altCover}') { this.src='${podcast.altCover}'; } else { this.onerror=null; this.src='image/podcasts/podcast${index + 1}.jpg'; }">
                <div class="podcast-quick-play-btn">
                    <i class="fa-solid fa-play"></i>
                </div>
            </div>
            <div class="podcast-card-details">
                <h4 title="${podcast.title}">${podcast.title}</h4>
                <p>${podcast.artist}</p>
            </div>
        `;

        card.addEventListener('click', (e) => {
            e.preventDefault();
            playPodcastAudio(podcast);
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playPodcastAudio(podcast);
            }
        });

        slider.appendChild(card);
    });
}

// Run immediately or on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderEchoBeatPodcasts);
} else {
    renderEchoBeatPodcasts();
}
