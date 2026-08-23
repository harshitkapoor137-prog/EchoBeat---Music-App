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

// ----- Element references (sign up) -----
const signupPage = document.getElementById('signupPage');
const signupForm = document.getElementById('signupForm');

const signupName = document.getElementById('signupName');
const signupNameError = document.getElementById('signupNameError');

const signupEmail = document.getElementById('signupEmail');
const signupEmailError = document.getElementById('signupEmailError');

const signupPassword = document.getElementById('signupPassword');
const signupPasswordError = document.getElementById('signupPasswordError');
const signupTogglePass = document.getElementById('signupTogglePass');

const confirmPassword = document.getElementById('confirmPassword');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const confirmTogglePass = document.getElementById('confirmTogglePass');

const signupSubmitBtn = document.getElementById('signupSubmitBtn');
const loginLink = document.getElementById('loginLink');

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
    poppart: { title: 'Pop-Party', cover: 'image/Pop.jpg', tracks: tracksFromList(POP_SONGS) },
    ishq: { title: 'Ishq Di Baajiyaan Radio', cover: 'image/Ishq.jpg', tracks: tracksFromList(ISHQ_SONGS) },
};

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
// Player state
// =====================================================================

const audioPlayer = new Audio();
let currentPlaylistKey = null;
let currentQueue = [];
let currentIndex = -1;
let isPlaying = false;

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

function showView(view) {
    [homeView, playlistView, profileView, settingsView].forEach((v) => {
        if (v) v.hidden = (v !== view);
    });
    if (view) view.scrollTop = 0;
}

function openPlaylist(key) {
    const playlist = PLAYLISTS[key];
    if (!playlist) return;

    // ---------------------------------------------------------------
    // Liked Songs is dynamic
    // ---------------------------------------------------------------

    const tracks =
        key === 'liked'
            ? getDynamicLikedTracks()
            : playlist.tracks;


    currentPlaylistKey = key;

    // Playlist cover
    playlistCover.src = playlist.cover;


    // Playlist title
    playlistTitle.textContent = playlist.title;


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
            <span class="track-duration">
                <i
                    class="fa-regular fa-heart"
                    title="Like"
                ></i>
            </span>
        `;

        // -----------------------------------------------------------
        // Clicking the row plays the song
        // -----------------------------------------------------------

        row.addEventListener(
            'click',
            () => {

                // Important:
                // Use THIS playlist's actual track list.
                playQueue(tracks, idx);
            }
        );
        trackListEl.appendChild(row);
    });

    showView(playlistView);
}

document.querySelectorAll('.quick-card[data-playlist]').forEach((card) => {
    card.addEventListener('click', () => {
        const key = card.dataset.playlist;
        if (SINGLE_TRACKS[key]) {
            playSingleTrack(key);
        } else {
            openPlaylist(key);
        }
    });
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
            showToast(
                'No liked songs to play'
            );
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
document.getElementById('loginLink').addEventListener('click', (e) => {
    e.preventDefault();

    signupPage.style.display = 'none';
    loginPage.style.display = 'flex';
});


// Show / hide sign up password
signupTogglePass.addEventListener('click', () => {
    const hidden = signupPassword.type === 'password';

    signupPassword.type = hidden ? 'text' : 'password';
    signupTogglePass.textContent = hidden ? 'Hide' : 'Show';
});


// Show / hide confirm password
confirmTogglePass.addEventListener('click', () => {
    const hidden = confirmPassword.type === 'password';

    confirmPassword.type = hidden ? 'text' : 'password';
    confirmTogglePass.textContent = hidden ? 'Hide' : 'Show';
});


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
    showView(homeView);

    // Close profile dropdown if it is open
    if (profileDropdown) {
        profileDropdown.classList.remove('show');
    }

    if (profileBtn) {
        profileBtn.setAttribute('aria-expanded', 'false');
    }
}

// Header Home button
const headerHomeBtn = document.querySelector('.home-btn');

if (headerHomeBtn) {
    headerHomeBtn.addEventListener('click', goHome);
}

// Sidebar Home button
const sidebarNavIcons = document.querySelectorAll('.top-icons .nav-icon');

if (sidebarNavIcons.length > 0) {
    const sidebarHomeBtn = sidebarNavIcons[0];

    sidebarHomeBtn.addEventListener('click', goHome);
}


// ---------------------------------------------------------------------
// 2. SIDEBAR SEARCH BUTTON
// ---------------------------------------------------------------------

const searchInput = document.querySelector('.search-bar input');
const searchIcon = document.querySelector('.search-bar .fa-magnifying-glass');

const sidebarSearchBtn = sidebarNavIcons.length > 1
    ? sidebarNavIcons[1]
    : null;

function focusSearch() {
    if (!searchInput) return;

    searchInput.focus();
    searchInput.select();
}

if (sidebarSearchBtn) {
    sidebarSearchBtn.addEventListener('click', focusSearch);
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


// ---------------------------------------------------------------------
// 4. LEFT SIDEBAR PLAYLIST BUTTONS
// ---------------------------------------------------------------------

const sidebarPlaylists = document.querySelectorAll('.library img.playlist');

const sidebarPlaylistMap = {

    'liked.jpg': 'liked',
    'myplaylist.jpg': 'myplaylist7',
    'pop.jpg': 'poppart',
    'techno.jpg': 'technomix',
    'shuffle.jpg': 'shuffle',
    'thinking.jpg': 'thinking'

};

sidebarPlaylists.forEach((playlistImage) => {

    playlistImage.style.cursor = 'pointer';

    playlistImage.addEventListener('click', () => {

        const src = playlistImage.getAttribute('src') || '';

        const filename = src
            .split('/')
            .pop()
            .toLowerCase();

        const playlistKey = sidebarPlaylistMap[filename];

        if (!playlistKey) {
            showToast('Playlist is not available');
            return;
        }

        // Thinking Out Loud is a single track
        if (SINGLE_TRACKS[playlistKey]) {

            playSingleTrack(playlistKey);

        } else {

            openPlaylist(playlistKey);

        }

    });

});


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
refreshLikeIcons();
updateVolumeIcon();

console.log(
    'EchoBeat interactive controls loaded successfully.'
);