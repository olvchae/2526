const steps = [...document.querySelectorAll(".step")];

const toSendModal = document.getElementById("toSendModal");
const stay2025 = document.getElementById("stay2025");
const send2025 = document.getElementById("send2025");

const saveBtn = document.getElementById("saveBtn");
const toFinal = document.getElementById("toFinal");
const stay2026 = document.getElementById("stay2026");
const welcome2026 = document.getElementById("welcome2026");
const restart = document.getElementById("restart");

const paper2025 = document.getElementById("paper2025");
const flyPaper = document.getElementById("flyPaper");
const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const p3 = document.getElementById("p3");

const paper2026 = document.getElementById("paper2026");

const toast = document.getElementById("toast");
const captureArea = document.getElementById("captureArea");

const stickerPicker = document.getElementById("stickerPicker");
const sticker1 = document.getElementById("sticker1");
const sticker2 = document.getElementById("sticker2");
const sticker3 = document.getElementById("sticker3");

const fontPicker = document.getElementById("fontPicker");
const paperHeader = document.getElementById("paperHeader");

const fx = document.getElementById("fx");
const fxCtx = fx.getContext("2d");

const fxFinal = document.getElementById("fxFinal");
const fxFinalCtx = fxFinal ? fxFinal.getContext("2d") : null;

const clock = document.getElementById("clock");
const newYearMessage = document.getElementById("newYearMessage");

const sunsetWrap = document.getElementById("sunsetWrap");

let currentStep = 0;

function go(step){
  // sunsetSun 요소가 있는 모든 step에서 top 속성 충돌 방지
  const targetStep = steps[step];
  if (targetStep) {
    const sun = targetStep.querySelector('.sunsetSun.gone');
    if (sun) {
      sun.style.top = 'auto';
    }
  }

  steps[currentStep].classList.remove("active");
  currentStep = step;
  steps[currentStep].classList.add("active");

  // 각 단계 진입 시 포커스
  if(step === 1){
    const first = steps[1].querySelector("input");
    setTimeout(() => first && first.focus(), 120);
  }
  if(step === 3){
    const first = steps[3].querySelector("input");
    setTimeout(() => first && first.focus(), 120);
    resizeFx();
  }
  if(step === 5){
    startClock();
  }
}

// STEP 0 초기 애니메이션 (해지는 모션 후 자동으로 STEP 1로)
async function initStep0(){
  await wait(7000); // 해가 완전히 지고 글자가 사라진 후 알림창 표시
  if(currentStep === 0){
    go(1);
  }
}

// 페이지 로드 시 실행
initStep0();

function getInputs(stepEl){
  return [...stepEl.querySelectorAll("input")].map(i => i.value.trim());
}

function showToast(){
  toast.classList.remove("on");
  void toast.offsetWidth;
  toast.classList.add("on");
}

function resizeFx(){
  const rect = captureArea.getBoundingClientRect();
  fx.width = Math.floor(rect.width * devicePixelRatio);
  fx.height = Math.floor(rect.height * devicePixelRatio);
  fxCtx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}

window.addEventListener("resize", () => {
  if(currentStep === 3) resizeFx();
});


/* STEP 1 -> STEP 2 */
toSendModal.addEventListener("click", () => {
  const v = getInputs(steps[1]);
  // 최소 1개는 입력되도록(너무 엄격하게는 안 함)
  if(!v.some(Boolean)){
    const first = steps[1].querySelector("input");
    first && first.focus();
    return;
  }
  go(2);

  // 애니메이션용 종이에 텍스트 세팅
  p1.textContent = v[0] || "";
  p2.textContent = v[1] || "";
  p3.textContent = v[2] || "";

  flyPaper.classList.remove("show","crumple","fly");
});

/* STEP 2: 아니오 -> STEP 1 */
stay2025.addEventListener("click", () => go(1));

/* STEP 2: 네 -> 접어서 사라지기 -> STEP 3 */
send2025.addEventListener("click", async () => {
  flyPaper.classList.add("show");

  // 1) 종이 계속 반 접기 (점이 될 때까지, 서서히 투명해지며)
  flyPaper.classList.add("crumple");
  await wait(1800);

  // 2) 완전히 사라지기
  flyPaper.classList.add("fly");
  await wait(500);

  go(3);
});

/* 이미지 저장(2026 화면만) */
saveBtn.addEventListener("click", async () => {
  const v = getInputs(steps[3]);
  if(!v.some(Boolean)){
    const first = steps[3].querySelector("input");
    first && first.focus();
    return;
  }

  // html2canvas로 종이 영역만 캡처
  const canvas = await html2canvas(paper2026, {
    backgroundColor: "#fffdf6",
    scale: 2,
    useCORS: true
  });

  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-2026-goals.png";
  a.click();

  showToast();
});

/* STEP 3 -> STEP 4 */
toFinal.addEventListener("click", () => go(4));

/* STEP 4: 아니오 -> STEP 3 */
stay2026.addEventListener("click", () => go(3));

/* STEP 4: 네 -> STEP 5 (해뜨는 모션) */
welcome2026.addEventListener("click", () => go(5));

/* 다시 시작 */
restart.addEventListener("click", () => location.reload());

/* 스티커 선택 기능 */
let selectedSticker = "✦";

stickerPicker.addEventListener("click", (e) => {
  const btn = e.target.closest(".stickerBtn");
  if (!btn) return;

  // 모든 버튼 비활성화
  stickerPicker.querySelectorAll(".stickerBtn").forEach(b => b.classList.remove("active"));

  // 선택된 버튼 활성화
  btn.classList.add("active");

  // 선택된 스티커 저장
  selectedSticker = btn.dataset.sticker;

  // 모든 스티커 업데이트
  sticker1.textContent = selectedSticker;
  sticker2.textContent = selectedSticker;
  sticker3.textContent = selectedSticker;
});

// 초기 선택 상태
stickerPicker.querySelector(".stickerBtn").classList.add("active");

/* 폰트 선택 기능 */
fontPicker.addEventListener("click", (e) => {
  const btn = e.target.closest(".fontBtn");
  if (!btn) return;

  // 모든 버튼 비활성화
  fontPicker.querySelectorAll(".fontBtn").forEach(b => b.classList.remove("active"));

  // 선택된 버튼 활성화
  btn.classList.add("active");

  // 폰트 변경
  const fontFamily = btn.dataset.font;
  const inputs = paper2026.querySelectorAll(".inp");
  inputs.forEach(inp => {
    inp.style.fontFamily = fontFamily;
  });

  // 헤더도 폰트 변경
  paperHeader.style.fontFamily = fontFamily;
});

/* 유틸 */
function wait(ms){ return new Promise(r => setTimeout(r, ms)); }

/* 폭죽 */
const particles = [];
function fireworkBurst(n=6){
  resizeFx();
  const rect = captureArea.getBoundingClientRect();

  for(let i=0;i<n;i++){
    spawn(
      rand(rect.width*0.25, rect.width*0.75),
      rand(rect.height*0.20, rect.height*0.55)
    );
  }

  if(!animating){
    animating = true;
    requestAnimationFrame(tick);
  }
}

const colors = ["#ffda6a", "#7cf0d6", "#ff7ad9", "#8fb7ff", "#b6ff7a", "#ffa07a"];
function spawn(x,y){
  const count = randInt(18, 28);
  for(let i=0;i<count;i++){
    const ang = Math.random() * Math.PI * 2;
    const spd = rand(1.2, 3.4);
    particles.push({
      x, y,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      life: rand(26, 44),
      c: colors[randInt(0, colors.length-1)]
    });
  }
}

let animating = false;
function tick(){
  fxCtx.clearRect(0,0,fx.width,fx.height);

  for(let i=particles.length-1; i>=0; i--){
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04; // 중력
    p.life -= 1;

    fxCtx.fillStyle = p.c;
    fxCtx.fillRect(p.x, p.y, 3, 3);

    if(p.life <= 0) particles.splice(i,1);
  }

  if(particles.length > 0){
    requestAnimationFrame(tick);
  }else{
    animating = false;
  }
}

function rand(a,b){ return a + Math.random()*(b-a); }
function randInt(a,b){ return Math.floor(rand(a,b+1)); }

/* 시계 기능 */
let clockInterval = null;
let hasTriggeredNewYear = false;
let previousTime = '';

function startClock(){
  if(clockInterval) clearInterval(clockInterval);
  hasTriggeredNewYear = false;

  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}

function updateClock(){
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const currentTime = `${hours}${minutes}${seconds}`;

  if(clock){
    const digits = clock.querySelectorAll('.clock__digit');
    if(digits.length === 6){
      // 플립 효과와 함께 숫자 업데이트
      updateDigitWithFlip(digits[0], hours[0], previousTime[0]);
      updateDigitWithFlip(digits[1], hours[1], previousTime[1]);
      updateDigitWithFlip(digits[2], minutes[0], previousTime[2]);
      updateDigitWithFlip(digits[3], minutes[1], previousTime[3]);
      updateDigitWithFlip(digits[4], seconds[0], previousTime[4]);
      updateDigitWithFlip(digits[5], seconds[1], previousTime[5]);
    }
  }

  previousTime = currentTime;

  // 실제 배포용: 1월 1일 00:00:00에만 한 번 실행
  const month = now.getMonth();
  const date = now.getDate();
  if(month === 0 && date === 1 && hours === '00' && minutes === '00' && seconds === '00' && !hasTriggeredNewYear){
    hasTriggeredNewYear = true;
    triggerNewYear();
  }
}

function updateDigitWithFlip(digitElement, newValue, oldValue){
  if(newValue !== oldValue && oldValue !== undefined){
    // 플립 애니메이션 추가
    digitElement.classList.add('flip');
    setTimeout(() => {
      digitElement.textContent = newValue;
      digitElement.classList.remove('flip');
    }, 300);
  } else {
    digitElement.textContent = newValue;
  }
}

function triggerNewYear(){
  // 폭죽 터뜨리기 - 양쪽에서 풍성하게
  if(fxFinal && fxFinalCtx){
    resizeFxFinal();
    // 왼쪽과 오른쪽에서 번갈아가며 터뜨리기
    for(let i = 0; i < 8; i++){
      setTimeout(() => {
        fireworkBurstFinalSides(8);
      }, i * 250);
    }
  }

  // 새해 알림창 표시
  setTimeout(() => {
    showNewYearAlert();
  }, 2000);
}

function showNewYearAlert(){
  // 기존 알림창이 있으면 제거
  const existingAlert = document.querySelector('.newYearAlert');
  if(existingAlert){
    existingAlert.remove();
  }

  // 알림창 생성
  const alertDiv = document.createElement('div');
  alertDiv.className = 'newYearAlert';
  alertDiv.innerHTML = `
    <div class="modal">
      <div class="modal__header">
        <div class="modal__left">
          <div class="modal__icon"></div>
          <div class="modal__headerTitle">알림</div>
        </div>
        <div class="modal__controls">
          <div class="windowBtn minimize">_</div>
          <div class="windowBtn maximize"></div>
          <div class="windowBtn close">×</div>
        </div>
      </div>
      <div class="modal__content">
        <div class="modal__title">새해 복 많이 받으세요! 🎊</div>
        <div class="modal__actions">
          <button class="btn">확인</button>
        </div>
      </div>
    </div>
  `;

  function closeAlert() {
    alertDiv.remove();
  }

  alertDiv.querySelector('.close').addEventListener('click', closeAlert);
  alertDiv.querySelector('.btn').addEventListener('click', closeAlert);

  document.body.appendChild(alertDiv);
}

function resizeFxFinal(){
  if(!fxFinal) return;
  const rect = fxFinal.getBoundingClientRect();
  fxFinal.width = Math.floor(rect.width * devicePixelRatio);
  fxFinal.height = Math.floor(rect.height * devicePixelRatio);
  fxFinalCtx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}

/* 최종 화면 폭죽 */
const particlesFinal = [];
let animatingFinal = false;

function fireworkBurstFinal(n=6){
  resizeFxFinal();
  const rect = fxFinal.getBoundingClientRect();

  for(let i=0;i<n;i++){
    spawnFinal(
      rand(rect.width*0.25, rect.width*0.75),
      rand(rect.height*0.20, rect.height*0.55)
    );
  }

  if(!animatingFinal){
    animatingFinal = true;
    requestAnimationFrame(tickFinal);
  }
}

function fireworkBurstFinalSides(n=6){
  resizeFxFinal();
  const rect = fxFinal.getBoundingClientRect();

  // 왼쪽에서 터뜨리기
  for(let i=0;i<n/2;i++){
    spawnFinal(
      rand(rect.width*0.05, rect.width*0.25),
      rand(rect.height*0.15, rect.height*0.50)
    );
  }

  // 오른쪽에서 터뜨리기
  for(let i=0;i<n/2;i++){
    spawnFinal(
      rand(rect.width*0.75, rect.width*0.95),
      rand(rect.height*0.15, rect.height*0.50)
    );
  }

  if(!animatingFinal){
    animatingFinal = true;
    requestAnimationFrame(tickFinal);
  }
}

function spawnFinal(x,y){
  const count = randInt(18, 28);
  for(let i=0;i<count;i++){
    const ang = Math.random() * Math.PI * 2;
    const spd = rand(1.2, 3.4);
    particlesFinal.push({
      x, y,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      life: rand(26, 44),
      c: colors[randInt(0, colors.length-1)]
    });
  }
}

function tickFinal(){
  fxFinalCtx.clearRect(0,0,fxFinal.width,fxFinal.height);

  for(let i=particlesFinal.length-1; i>=0; i--){
    const p = particlesFinal[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.04; // 중력
    p.life -= 1;

    fxFinalCtx.fillStyle = p.c;
    fxFinalCtx.fillRect(p.x, p.y, 3, 3);

    if(p.life <= 0) particlesFinal.splice(i,1);
  }

  if(particlesFinal.length > 0){
    requestAnimationFrame(tickFinal);
  }else{
    animatingFinal = false;
  }
}
