let selectedFiles = [];
let selectedDevice = "Android";
let transferTimer = null;



function notify(message) {
    const notification = document.getElementById("notification");

    notification.textContent = message;
    notification.style.display = "block";

    clearTimeout(notification.timer);

    notification.timer = setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}




function showPage(pageId, button) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageId).classList.remove("hidden");

    document.getElementById("pageName").textContent =
        pageId.charAt(0).toUpperCase() + pageId.slice(1);

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    } else {
        document.querySelectorAll(".nav-btn").forEach(btn => {
            if (btn.getAttribute("onclick").includes(pageId)) {
                btn.classList.add("active");
            }
        });
    }

    if (pageId === "files") {
        displayFiles();
    }

    updateDashboard();
}


function selectDevice(device, button) {

    selectedDevice = device;

    document.querySelectorAll(".device").forEach(item => {
        item.classList.remove("selected");
    });

    button.classList.add("selected");

    document.getElementById("deviceStat").textContent = device;
    document.getElementById("summaryDevice").textContent = device;

    notify(device + " selected successfully.");
}



document.getElementById("fileInput").addEventListener("change", function () {

    const newFiles = Array.from(this.files);

    selectedFiles.push(...newFiles);

    displayFiles();
    updateDashboard();

    if (newFiles.length > 0) {
        notify(newFiles.length + " file(s) added successfully.");
    }

    this.value = "";
});



function formatSize(bytes) {

    if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(1) + " KB";
    }

    if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }

    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}




function getTotalSize() {

    return selectedFiles.reduce((total, file) => {
        return total + file.size;
    }, 0);
}




function updateDashboard() {

    const total = getTotalSize();

    const sizeText = formatSize(total);

    document.getElementById("totalFiles").textContent =
        selectedFiles.length;

    document.getElementById("totalSize").textContent =
        sizeText;

    document.getElementById("summaryFiles").textContent =
        selectedFiles.length;

    document.getElementById("summarySize").textContent =
        sizeText;

    document.getElementById("summaryDevice").textContent =
        selectedDevice;

    document.getElementById("storageSize").textContent =
        sizeText;

  
    const percentage = Math.min(
        (total / (5 * 1024 * 1024 * 1024)) * 100,
        100
    );

    document.getElementById("storageBar").style.width =
        percentage + "%";

    document.getElementById("storagePercentage").textContent =
        percentage.toFixed(2) + "% of illustrative 5 GB";
}


function displayFiles() {

    const fileList = document.getElementById("fileList");

    const search = document.getElementById("searchInput").value
        .toLowerCase();

    fileList.innerHTML = "";

    const filteredFiles = selectedFiles.filter(file => {
        return file.name.toLowerCase().includes(search);
    });

    document.getElementById("emptyMessage").style.display =
        filteredFiles.length === 0 ? "block" : "none";

    filteredFiles.forEach(file => {

        const originalIndex = selectedFiles.indexOf(file);

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = file.name;

        const sizeCell = document.createElement("td");
        sizeCell.textContent = formatSize(file.size);

        const typeCell = document.createElement("td");
        typeCell.textContent = file.type || "Unknown";

        const actionCell = document.createElement("td");

        const downloadButton = document.createElement("button");
        downloadButton.textContent = "↓ Download";
        downloadButton.className = "action-btn";

        downloadButton.addEventListener("click", () => {
            downloadFile(originalIndex);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "× Delete";
        deleteButton.className = "action-btn delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteFile(originalIndex);
        });

        actionCell.append(downloadButton, deleteButton);

        row.append(nameCell, sizeCell, typeCell, actionCell);

        fileList.appendChild(row);
    });

    updateDashboard();
}



function downloadFile(index) {

    const file = selectedFiles[index];

    if (!file) return;

    const url = URL.createObjectURL(file);

    const link = document.createElement("a");

    link.href = url;
    link.download = file.name;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    notify("Download started: " + file.name);
}


function deleteFile(index) {

    selectedFiles.splice(index, 1);

    displayFiles();
    updateDashboard();

    notify("File deleted from your workspace.");
}


function startTransfer() {

    if (selectedFiles.length === 0) {
        notify("Please select files first.");
        return;
    }

    if (transferTimer) {
        notify("A demo transfer is already running.");
        return;
    }

    let progress = 0;

    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const status = document.getElementById("status");
    const button = document.getElementById("transferBtn");

    status.textContent = "Running";
    button.disabled = true;
    button.textContent = "Transferring...";

    progressBar.style.width = "0%";
    progressText.textContent = "0% completed";

    notify("Demo transfer started.");

    transferTimer = setInterval(() => {

        progress += 10;

        progressBar.style.width = progress + "%";

        progressText.textContent =
            progress + "% completed";

        if (progress >= 100) {

            clearInterval(transferTimer);
            transferTimer = null;

            status.textContent = "Complete";

            button.disabled = false;
            button.textContent = "Start Demo Transfer →";

            notify("Demo complete. No files were sent to another phone.");

        }

    }, 300);
}


function generatePIN() {

    const pin = Math.floor(100000 + Math.random() * 900000);

    document.getElementById("pinDisplay").textContent = pin;

    notify("Demo PIN generated.");
}

function checkEmail() {

    const email = document.getElementById("emailInput").value;

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const message = document.getElementById("emailMessage");

    if (emailPattern.test(email)) {

        message.textContent =
            "Valid email format. No email has been sent.";

        message.style.color = "#70d7a0";

    } else {

        message.textContent =
            "Please enter a valid email address.";

        message.style.color = "#ff9999";

    }
}


updateDashboard();



const cursorGlow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", function(event) {
    cursorGlow.style.left = event.clientX + "px";
    cursorGlow.style.top = event.clientY + "px";
});


const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particles = [];

    const amount = Math.min(
        90,
        Math.floor(window.innerWidth / 15)
    );

    for (let i = 0; i < amount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#a58aff";
        ctx.fill();
    });

  
    particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(other => {
            const dx = p.x - other.x;
            const dy = p.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 110) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle =
                    `rgba(150, 120, 255, ${0.12 * (1 - distance / 110)})`;
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animateParticles();




function playClickSound() {
    try {
        const AudioContext =
            window.AudioContext || window.webkitAudioContext;

        const audio = new AudioContext();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(650, audio.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
            350,
            audio.currentTime + 0.07
        );

        gain.gain.setValueAtTime(0.035, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audio.currentTime + 0.08
        );

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start();
        oscillator.stop(audio.currentTime + 0.08);

        oscillator.onended = () => audio.close();
    } catch (error) {
        console.log("Audio unavailable");
    }
}

document.addEventListener("click", function(event) {
    if (event.target.closest("button, .upload-button")) {
        playClickSound();
    }
});




function showMessage(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}




let transferRunning = false;

function startTransfer(button) {
    if (transferRunning) return;

    transferRunning = true;

    const progressBar = document.getElementById("progressBar");
    const progressNumber = document.getElementById("progressNumber");
    const progressText = document.getElementById("progressText");

    let progress = 0;

    button.disabled = true;
    button.textContent = "Transferring...";

    const timer = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 5;

        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);

            progressText.textContent = "Demo completed!";
            button.textContent = "Transfer Again";
            button.disabled = false;

            transferRunning = false;

            showMessage("Demo transfer completed successfully!");
        }

        progressBar.style.width = progress + "%";
        progressNumber.textContent = progress + "%";

    }, 250);
}




function scrollToFiles() {
    document.getElementById("files").scrollIntoView({
        behavior: "smooth"
    });
}



const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function() {
    const searchValue = searchInput.value.toLowerCase();

    document.querySelectorAll(".file-card").forEach(card => {
        const fileName = card.innerText.toLowerCase();

        card.style.display = fileName.includes(searchValue)
            ? "flex"
            : "none";
    });
});



const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

fileInput.addEventListener("change", function() {
    const selectedFiles = Array.from(fileInput.files);

    selectedFiles.forEach(file => {
        const card = document.createElement("div");

        card.className = "file-card reveal visible";

        const extension = file.name.split(".").pop().toUpperCase();

        card.innerHTML = `
            <div class="file-symbol">▤</div>
            <div>
                <h3></h3>
                <p>${(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <span>${extension}</span>
        `;

        // Use textContent for the uploaded filename
        card.querySelector("h3").textContent = file.name;

        fileList.prepend(card);
    });

    if (selectedFiles.length) {
        showMessage(selectedFiles.length + " file(s) added!");
    }

    fileInput.value = "";
});


// 9. SCROLL REVEAL ANIMATIONS

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.15
});

document.querySelectorAll(".reveal").forEach(element => {
    observer.observe(element);
});
