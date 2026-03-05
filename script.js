document.addEventListener("DOMContentLoaded", () => {
  const giftBox = document.getElementById("gift-box");
  const cardContent = document.getElementById("card-content");
  const petalsContainer = document.getElementById("petals-container");
  const clickMe = document.getElementById("click-me-text");
  const interactionLayer = document.getElementById("gift-interaction-layer");
  
  const trollMessage = document.getElementById("troll-message");
  const progressBar = document.getElementById("progressBar");
  const trollText2 = document.getElementById("troll-text-2");
  const skipBtn = document.getElementById("skip-troll-btn");

  // Mảng các màu hồng pastel
  const colors = [
    "#ffb6c1",
    "#ffc0cb",
    "#ffe4e1",
    "#ffc3a0",
    "#ffb3c6",
    "#ff8fab",
  ];

  // Các icon hài hước nhưng mang tính "Gen Z", dễ thương
  const funnyEmojis = ["🐷", "🐖", "🐽", "🐗"];

  // Tạo cánh hoa đào hoặc icon rơi
  function createPetal() {
    const petal = document.createElement("div");
    petal.classList.add("petal");

    // Random kích thước
    const size = Math.random() * 15 + 10;

    // Random vị trí xuất hiện
    const startPosX = Math.random() * window.innerWidth;

    // Random thời gian rơi và độ trễ
    const duration = Math.random() * 5 + 5;
    const delay = Math.random() * 5;

    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${startPosX}px`;
    petal.style.top = `-50px`; // Ép thẻ HTML nằm ngoài lề trên trước khi bị kéo vào animation
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    // 10% cơ hội rơi ra icon thay vì cánh hoa
    if (Math.random() < 0.1) {
      petal.classList.remove("petal");
      petal.classList.add("emoji-drop");
      petal.innerText = funnyEmojis[Math.floor(Math.random() * funnyEmojis.length)];
      petal.style.backgroundColor = "transparent";
      petal.style.boxShadow = "none";
      // Chỉnh lại kích thước to hơn một xíu cho dễ nhìn
      petal.style.fontSize = `${size + 10}px`;
      petal.style.width = "auto";
      petal.style.height = "auto";
    } else {
      // Random màu sắc cho cánh hoa
      petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    }

    petalsContainer.appendChild(petal);

    // Xóa cánh hoa sau khi rơi xong để giảm tải cho trình duyệt
    setTimeout(
      () => {
        if (petal && petal.parentNode) {
            petal.remove();
        }
      },
      (duration + delay) * 1000,
    );
  }

  // Khởi tạo các cánh hoa rơi tự động liên tục
  setInterval(createPetal, 300);

  // Khởi tạo ngay một lượng cánh hoa lúc đầu
  for (let i = 0; i < 30; i++) {
    setTimeout(createPetal, Math.random() * 3000);
  }

  // --- LOGIC THIỆP 3D & ÂM THANH ---
  const bookCard = document.getElementById("birthday-card");
  const typewriterText = document.getElementById("typewriter-text");
  const musicToggle = document.getElementById("music-toggle");
  const bgMusic = document.getElementById("bg-music");
  
  let isCardOpen = false;
  let isTypewriterDone = false;
  let isMusicPlaying = false;

  // Nội dung cần gõ
  const fullText = typewriterText.innerHTML;
  typewriterText.innerHTML = ""; // Xóa nội dung lúc đầu ẩn đi
  typewriterText.classList.remove("typewriter-hidden");

  // Hàm Typing Text (Typewriter effect)
  function typeWriter(text, element, speed = 50) {
      isTypewriterDone = true; // Tránh gọi lặp lại
      element.classList.add("typewriter-cursor");
      
      let i = 0;
      function type() {
          if (i < text.length) {
              element.innerHTML += text.charAt(i);
              i++;
              setTimeout(type, speed);
          } else {
              // Gõ xong thì bỏ con trỏ nhấp nháy
              setTimeout(() => {
                  element.classList.remove("typewriter-cursor");
              }, 1500);
          }
      }
      type();
  }

  // Sự kiện khi bấm vào thiệp
  bookCard.addEventListener("click", function(e) {
      // Bỏ qua nếu đang bấm vào nút nhạc hoặc chữ
      if(e.target.closest('#music-toggle') || e.target.closest('#typewriter-text') || e.target.closest('.tulip-container')) {
          return;
      }

      const isClickOnCover = e.target.closest('#cover');
      const isClickOnInside = e.target.closest('#inside');

      // Đảo trạng thái mở/đóng
      if (!isCardOpen) {
          // Chỉ mở khi click bìa cover
          if (isClickOnCover) {
              bookCard.classList.add("open");
              isCardOpen = true;

              // Phát nhạc tự động (nếu browser cho phép khi có tương tác click)
              if(!isMusicPlaying) {
                  bgMusic.volume = 0.5;
                  bgMusic.play().then(() => {
                      isMusicPlaying = true;
                      updateMusicButton();
                  }).catch(err => console.log("Trình duyệt chạm auto-play", err));
              }

              // Chờ thiệp lật xong (1.2s) rồi bắt đầu lặp chữ
              if (!isTypewriterDone) {
                  setTimeout(() => {
                      typeWriter(fullText, typewriterText, 60);
                  }, 1200); 
              }
          }
      } else {
          // Thiệp đang mở, phân luồng theo mặt đang bấm
          if (isClickOnInside) {
              // Bấm mặt 3 hoặc mặt 4 -> lật tiếp qua xem mặt 4 hoặc lật lại xem mặt 3
              bookCard.classList.toggle("show-back");
          } else if (isClickOnCover) {
              // Bấm bìa ngoài cùng 1 hoặc 2 -> gập hẳn cái thiệp lại
              bookCard.classList.remove("open");
              bookCard.classList.remove("show-back"); // Reset flip
              isCardOpen = false;
          }
      }
  });

  // Sự kiện bật/tắt nhạc
  musicToggle.addEventListener("click", function(e) {
      e.stopPropagation(); // Không cho lan event lên thiệp làm đóng thiệp
      
      if (isMusicPlaying) {
          bgMusic.pause();
          isMusicPlaying = false;
      } else {
          bgMusic.play();
          isMusicPlaying = true;
      }
      updateMusicButton();
  });

  function updateMusicButton() {
      if (isMusicPlaying) {
          musicToggle.innerHTML = '<span class="music-icon">⏸️</span> Tắt Nhạc';
      } else {
          musicToggle.innerHTML = '<span class="music-icon">🎵</span> Bật Nhạc';
      }
  }
});
