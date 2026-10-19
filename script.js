// =====================================================================
// EchoBeat — app logic
// =====================================================================

// ----- Element references (login) -----
const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const togglePass = document.getElementById('togglePass');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');

const loginPage = document.getElementById('loginPage');
const mainApp = document.getElementById('mainApp');
const loadingScreen = document.getElementById('loading-screen');

// ----- Element references (phone login) -----
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

// Only allow @gmail.com addresses in the username field
const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
const PHONE_REGEX = /^\d{10}$/;

const AUTH_KEY = 'echobeat_auth';
const SETTINGS_KEY = 'echobeat_settings';

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
    return `image/songs/${title}.jpg`;
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
    trackFrom('Less Than Zero', 'The Weeknd')
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
        image.onerror = () => { image.src = 'image/All the Stars.jpg'; };
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
let isPlaying = false;

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

    // Stop after the last song when advancing automatically.
    if (autoNext && currentIndex >= currentQueue.length - 1) {
        isPlaying = false;
        setPlayIcon(false);
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
    playNext(true);
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

    // Playlist cover
    playlistCover.src = playlist.cover;


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

function renderUserPlaylists() {
    const sidebar = document.getElementById('userPlaylistSidebar');
    const quickLinks = document.getElementById('homeQuickLinks');
    if (!sidebar || !quickLinks) return;

    sidebar.replaceChildren();
    quickLinks.replaceChildren();

    const likedCard = document.createElement('div');
    likedCard.className = 'quick-card';
    likedCard.dataset.playlist = 'liked';
    likedCard.innerHTML = '<img src="image/Liked.jpg" alt=""><span>Liked Songs</span>';
    quickLinks.appendChild(likedCard);

    Object.entries(PLAYLISTS).forEach(([key, playlist]) => {
        if (!playlist.isCustom) return;

        const image = document.createElement('button');
        image.type = 'button';
        image.className = 'playlist user-playlist-item';
        image.title = playlist.title;
        image.setAttribute('aria-label', `Open playlist ${playlist.title}`);
        image.innerHTML = `<img src="${escapeHTML(playlist.cover)}" alt="">`;
        image.addEventListener('click', () => openPlaylist(key));
        sidebar.appendChild(image);

        const card = document.createElement('div');
        card.className = 'quick-card';
        card.dataset.playlist = key;
        card.innerHTML = `<img src="${escapeHTML(playlist.cover)}" alt=""><span>${escapeHTML(playlist.title)}</span>`;
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
                : playlist.tracks;
        if (!tracks.length) {
            showToast(currentPlaylistKey && PLAYLISTS[currentPlaylistKey]?.isCustom ? 'Add songs to this playlist first' : 'No liked songs to play');
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

function enterApp(identifier, method) {
    loginPage.style.display = 'none';
    phoneLoginScreen.style.display = 'none';
    mainApp.style.display = 'flex';
    showView(homeView);
    setProfileIdentity(identifier);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ identifier, method, loggedIn: true }));
}

function logout() {
    localStorage.removeItem(AUTH_KEY);
    audioPlayer.pause();
    isPlaying = false;
    setPlayIcon(false);
    mainApp.style.display = 'none';
    phoneLoginScreen.style.display = 'none';
    loginPage.style.display = 'flex';
    showToast('Signed out of EchoBeat');
}

function restoreSession() {
    try {
        const auth = JSON.parse(localStorage.getItem(AUTH_KEY));
        if (auth && auth.loggedIn) {
            enterApp(auth.identifier, auth.method);
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
// Password visibility
// =====================================================================

togglePass.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePass.textContent = isHidden ? 'Hide' : 'Show';
});

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

usernameInput.addEventListener('input', () => {
    if (usernameInput.value.trim()) clearError(usernameInput, usernameError);
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.trim()) clearError(passwordInput, passwordError);
});

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2600);
}

// =====================================================================
// Email + password login
// =====================================================================

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    const email = usernameInput.value.trim();

    if (!email) {
        setError(usernameInput, usernameError, 'Please enter your Gmail address.');
        valid = false;
    } else if (!GMAIL_REGEX.test(email)) {
        setError(usernameInput, usernameError, 'Please enter a valid Gmail address (e.g. name@gmail.com).');
        valid = false;
    } else {
        clearError(usernameInput, usernameError);
    }

    if (!passwordInput.value.trim()) {
        setError(passwordInput, passwordError, 'Please enter your password.');
        valid = false;
    } else {
        clearError(passwordInput, passwordError);
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Logging in...';

    setTimeout(() => {
        showToast('Logged in to EchoBeat 🎧');
        form.reset();

        setTimeout(() => {
            enterApp(email, 'email');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Log in';
        }, 800);
    }, 1200);
});

// =====================================================================
// Social login buttons (placeholders only — no real OAuth wired up,
// so they just show a toast and stay on the login page)
// =====================================================================

document.querySelectorAll('.social-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const provider = btn.dataset.provider || 'your account';
        showToast(`Continuing with ${provider}...`);
    });
});

// =====================================================================
// Phone number login (via "Forgot your password?")
// =====================================================================

document.getElementById('forgotLink').addEventListener('click', (e) => {
    e.preventDefault();
    loginPage.style.display = 'none';
    phoneLoginScreen.style.display = 'flex';
    phoneStatus.textContent = '';
    phoneStatus.classList.remove('error');
});

document.getElementById('backToLoginLink').addEventListener('click', (e) => {
    e.preventDefault();
    phoneLoginScreen.style.display = 'none';
    loginPage.style.display = 'flex';
});

phoneNumberInput.addEventListener('input', () => {
    // keep digits only, max 10
    phoneNumberInput.value = phoneNumberInput.value.replace(/\D/g, '').slice(0, 10);
    if (phoneNumberInput.value.trim()) clearError(phoneNumberInput, phoneError);
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
    phoneStatus.classList.remove('error');
    phoneStatus.textContent = '';

    localStorage.setItem('echobeat_phone', phone);

    setTimeout(() => {
        phoneStatus.textContent = `Verification link sent to +91 ${phone}. Logging you in...`;
        phoneSubmitBtn.textContent = 'Link sent';

        setTimeout(() => {
            enterApp(phone, 'phone');
            phoneSubmitBtn.disabled = false;
            phoneSubmitBtn.textContent = 'Send verification link';
            phoneForm.reset();
            phoneStatus.textContent = '';
        }, 5000);
    }, 900);
});

// =====================================================================
// Sign Up Page
// =====================================================================

// Open sign up page
document.getElementById('signupLink').addEventListener('click', (e) => {
    e.preventDefault();

    loginPage.style.display = 'none';
    signupPage.style.display = 'flex';
    signupForm.reset();
});


// Go back to login page
const legacyLoginLink = document.getElementById('loginLink');
if (legacyLoginLink) {
    legacyLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        const signupPageElement = document.getElementById('signupPage');
        if (signupPageElement) signupPageElement.style.display = 'none';
        if (loginPage) loginPage.style.display = 'flex';
    });
}


// Show / hide sign up password
const signupTogglePass = document.getElementById('signupTogglePass');
const signupPassword = document.getElementById('signupPassword');
if (signupTogglePass && signupPassword) {
    signupTogglePass.addEventListener('click', () => {
        const hidden = signupPassword.type === 'password';
        signupPassword.type = hidden ? 'text' : 'password';
        signupTogglePass.textContent = hidden ? 'Hide' : 'Show';
    });
}


// Show / hide confirm password
const confirmTogglePass = document.getElementById('confirmTogglePass');
const confirmPassword = document.getElementById('confirmPassword');
if (confirmTogglePass && confirmPassword) {
    confirmTogglePass.addEventListener('click', () => {
        const hidden = confirmPassword.type === 'password';
        confirmPassword.type = hidden ? 'text' : 'password';
        confirmTogglePass.textContent = hidden ? 'Hide' : 'Show';
    });
}


// Sign up form submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    const name = signupName.value.trim();
    const email = signupEmail.value.trim();
    const password = signupPassword.value;
    const confirm = confirmPassword.value;


    // Validate name
    if (!name) {
        setError(signupName, signupNameError, 'Please enter your name.');
        valid = false;
    } else {
        clearError(signupName, signupNameError);
    }


    // Validate Gmail
    if (!email) {
        setError(signupEmail, signupEmailError, 'Please enter your Gmail address.');
        valid = false;
    } else if (!GMAIL_REGEX.test(email)) {
        setError(
            signupEmail,
            signupEmailError,
            'Please enter a valid Gmail address.'
        );
        valid = false;
    } else {
        clearError(signupEmail, signupEmailError);
    }


    // Validate password
    if (password.length < 6) {
        setError(
            signupPassword,
            signupPasswordError,
            'Password must be at least 6 characters.'
        );
        valid = false;
    } else {
        clearError(signupPassword, signupPasswordError);
    }


    // Validate confirm password
    if (confirm !== password || !confirm) {
        setError(
            confirmPassword,
            confirmPasswordError,
            'Passwords do not match.'
        );
        valid = false;
    } else {
        clearError(confirmPassword, confirmPasswordError);
    }


    if (!valid) return;


    // Save account locally for this demo project
    const user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem('echobeat_user', JSON.stringify(user));


    // Show loading state
    signupSubmitBtn.disabled = true;
    signupSubmitBtn.textContent = 'Creating account...';


    setTimeout(() => {
        showToast('Welcome to EchoBeat, ' + name + '! 🎧');

        signupForm.reset();

        signupSubmitBtn.disabled = false;
        signupSubmitBtn.textContent = 'Sign up';

        // Automatically log the new user in
        enterApp(email, 'signup');

    }, 1000);
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
        document.querySelectorAll('[data-home-filter]').forEach((pill) => pill.classList.toggle('active', pill === button));
        document.querySelectorAll('.home-music-section').forEach((section) => { section.hidden = filter === 'podcasts'; });
        document.querySelectorAll('.home-podcast-section').forEach((section) => { section.hidden = filter === 'music'; });
        const quickLinks = document.getElementById('homeQuickLinks');
        if (quickLinks) quickLinks.hidden = filter === 'podcasts';
        const announcement = document.querySelector('.home-announcement');
        if (announcement) announcement.hidden = filter === 'podcasts';
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
            { title: "We Don't Talk Anymore", artist: 'Charlie Puth, Selena Gomez' },
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
// 3. SEARCH — search songs and playlists
// ---------------------------------------------------------------------

function performSearch() {

    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        showToast('Type a song or playlist to search');
        searchInput.focus();
        return;
    }

    // First search playlist names
    for (const [key, playlist] of Object.entries(PLAYLISTS)) {

        if (playlist.title.toLowerCase().includes(query)) {

            openPlaylist(key);
            showToast(`Opened ${playlist.title}`);
            return;
        }
    }

    // Search every song in every playlist
    for (const [key, playlist] of Object.entries(PLAYLISTS)) {

        const songIndex = playlist.tracks.findIndex(track =>
            track.title.toLowerCase().includes(query) ||
            track.artist.toLowerCase().includes(query)
        );

        if (songIndex !== -1) {

            openPlaylist(key);

            // Start the matching song
            playQueue(playlist.tracks, songIndex);

            showToast(`Playing ${playlist.tracks[songIndex].title}`);
            return;
        }
    }

    // Search the single-track cards
    for (const [key, track] of Object.entries(SINGLE_TRACKS)) {

        if (
            track.title.toLowerCase().includes(query) ||
            track.artist.toLowerCase().includes(query)
        ) {

            playSingleTrack(key);
            return;
        }
    }

    showToast(`No results found for "${searchInput.value}"`);
}

if (searchInput) {
    searchInput.addEventListener('input', () => {
        if (!playlistView || playlistView.hidden) return;
        const query = searchInput.value.trim().toLocaleLowerCase();
        let visibleCount = 0;
        trackListEl.querySelectorAll('.track-row').forEach(row => {
            const title = row.querySelector('.track-text h4')?.textContent.toLocaleLowerCase() || '';
            const artist = row.querySelector('.track-text p')?.textContent.toLocaleLowerCase() || '';
            const matches = !query || title.includes(query) || artist.includes(query);
            row.hidden = !matches;
            if (matches) visibleCount++;
        });
        const existing = trackListEl.querySelector('.playlist-search-empty');
        if (existing) existing.remove();
        if (query && visibleCount === 0) {
            const empty = document.createElement('div');
            empty.className = 'playlist-search-empty';
            empty.textContent = `No songs match “${searchInput.value.trim()}”`;
            trackListEl.appendChild(empty);
        }
    });

    // Press Enter to search
    searchInput.addEventListener('keydown', (event) => {

        if (event.key === 'Enter') {
            event.preventDefault();
            performSearch();
        }

    });

}


// Clicking the search icon performs search if text exists,
// otherwise it simply focuses the search bar.
if (searchIcon) {

    searchIcon.addEventListener('click', () => {

        if (searchInput && searchInput.value.trim()) {
            performSearch();
        } else {
            focusSearch();
        }

    });

}

const savedSongsButton = document.querySelector('.search-bar .fa-box-archive');
if (savedSongsButton) {
    savedSongsButton.style.cursor = 'pointer';
    savedSongsButton.title = 'Saved Songs';
    savedSongsButton.setAttribute('role', 'button');
    savedSongsButton.setAttribute('tabindex', '0');
    savedSongsButton.addEventListener('click', () => openPlaylist('saved'));
    savedSongsButton.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPlaylist('saved'); }
    });
}


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

const LIKED_SONGS_KEY = 'echobeat_liked_songs';

function getLikedSongs() {

    try {

        return JSON.parse(
            localStorage.getItem(LIKED_SONGS_KEY)
        ) || [];

    } catch {

        return [];

    }

}

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

});

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
        background: #050505;
        color: white;
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
document.addEventListener('click', (event) => {

    const expandButton =
        event.target.closest('.fa-expand');

    if (!expandButton) return;

    event.preventDefault();
    event.stopPropagation();

    openSongFullscreen();

});


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