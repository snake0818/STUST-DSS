// 內容資訊
const timeRowText = [
  { col: 2, content: "時程規劃", },
  { col: 4, content: "08:30~09:15   13:00~13:45", },
  { col: 4, content: "09:25~10:10   13:55~14:40", },
  { col: 4, content: "10:20~11:05   14:50~15:35", },
  { col: 4, content: "11:15~12:00   15:45~16:30", },
]
const timeCourse = [
  { room: "監一", name: "01.生命徵象測量" },
  { room: "監二", name: "01.生命徵象測量" },
  { room: "監二", name: "02.成人異物梗塞急救法" },
  { room: "監二", name: "03.成人心肺復甦術" },
  { room: "監三", name: "04.備餐、餵食及協助用藥" },
  { room: "監四", name: "04.備餐、餵食及協助用藥" },
  { room: "監五", name: "04.備餐、餵食及協助用藥" },
  { room: "監六", name: "05.洗頭衣物更換" },
  { room: "監七", name: "06.會陰沖洗及尿管清潔" },
  { room: "監七", name: "07.協助上下床及坐輪椅" },
];
const infoNum = [
  "04,05,01,02,10,11,07,08",
  "06,00,00,00,03,00,00,00,12,00,00,00,09,00,00,00",
  "00,10,11,00,00,07,08,00,00,04,06,00,00,01,02,00",
  "00,00,00,12,00,00,00,09,00,00,00,05,00,00,00,03",
  "01,10,07,04",
  "02,11,08,05",
  "03,12,09,06",
  "08,04,01,10",
  "07,00,00,06,02,00,11,00",
  "00,09,05,00,00,03,00,12",
];
const colors = [
  "#99FF99",
  "#FFC8B4",
  "#FFC8B4",
  "#FFC8B4",
  "#99FFFF",
  "#FFA488",
  "#66FF66",
  "#CCBBFF",
  "#FFCCCC",
  "#FFCCCC",
]

// 設置
const colNum = timeRowText.length;
const colCells = 4;
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

// 標題、時程表設置
document.querySelector('#content thead th').colSpan = 2 + (colNum - 1) * colCells;
const contentTh = document.querySelector('#content thead');
timeRowText.forEach(item => {
  const cell = document.createElement('th');
  cell.textContent = item.content;
  cell.colSpan = item.col;
  cell.style.width = '22%'
  contentTh.appendChild(cell);
});
// 監考分類與項目設置
const contentTb = document.querySelector('#content tbody');
let prevRoom = null, rowspan = 0;
timeCourse.forEach((item, index) => {
  const row = document.createElement('tr');
  const roomCell = document.createElement('th');
  const nameCell = document.createElement('th');

  if (item.room === prevRoom) { rowspan++; }
  else {
    if (prevRoom !== null) { contentTb.children[index - rowspan - 1].cells[0].rowSpan = rowspan + 1; rowspan = 0; }
    prevRoom = item.room;
    roomCell.textContent = item.room;
    roomCell.classList.add('room');
    row.appendChild(roomCell);
  }
  nameCell.textContent = item.name;
  nameCell.classList.add('name');
  row.appendChild(nameCell);
  row.id = `r${index}`;
  row.style.backgroundColor = colors[index];
  contentTb.appendChild(row);
});
if (rowspan > 0) { contentTb.lastChild.previousSibling.cells[0].rowSpan = rowspan + 1; }
// 內容設置
const trlist = contentTb.querySelectorAll('tr');
trlist.forEach((tr, index) => {
  const cellContents = infoNum[index].split(',');
  const numCol = cellContents.length / colCells;
  const col = colCells * colCells / cellContents.length
  let numNull = 0;

  cellContents.forEach((item, index) => {
    const itemCell = document.createElement('td');
    if (item === "00") {
      numNull++;
      if (index && (index + 1) % numCol === 0) {
        const nullCell = document.createElement('td');
        nullCell.colSpan = (numNull === 1) ? col : col * numNull;
        tr.appendChild(nullCell);
        numNull = 0;
      }
    }
    else {
      if (numNull) {
        const nullCell = document.createElement('td');
        nullCell.colSpan = (numNull === 1) ? col : col * numNull;
        tr.appendChild(nullCell);
        numNull = 0;
      }
      itemCell.innerHTML = `
      <div class="number">${item}號</div>
      <div class="timer">
        進  <span class="in"></span>
        <br>
        出  <span class="out"></span>
      </div>`;
      itemCell.colSpan = col;
      itemCell.style.width = `${col * 5.5}%`
      itemCell.classList.add('clickAble')
      tr.appendChild(itemCell);
    }
  })
})
// 標記時間
function showTimer(element) {
  // 取得當前時間
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  // 將格式化的時間設置為相應元素的 textContent
  element.textContent = `${hours}:${minutes}`;
  saveInfoInCookie();
}
// 存入cookie
function saveInfoInCookie() {
  var dataToStore = []
  clickAbleElements.forEach((element, index) => {
    const status = element.classList[1];
    const number = element.querySelector('.number').textContent;
    const getInText = element.querySelector('.in').textContent;
    const getOutText = element.querySelector('.out').textContent;
    const inText = (getInText === '') ? undefined : getInText;
    const outText = (getOutText === '') ? undefined : getOutText;
    dataToStore.push({ status, number, inText, outText });
  });
  // 將 dataToStore 物件轉換為字串格式
  var dataString = JSON.stringify(dataToStore);
  // 將資料存入 Cookie
  document.cookie = "info=" + dataString;
}
// 讀取cookie
function loadCookieData() {
  var cookieString = document.cookie; // 獲取包含所有 Cookie 的字串
  // 將字串分割成各個 Cookie
  var cookieArray = cookieString.split(";");
  var infoString = null;
  // 在 Cookie 中尋找名稱為 "info" 的 Cookie
  cookieArray.forEach((cookie) => {
    // 提取 info 的值
    if (cookie.trim().startsWith("info=")) { infoString = cookie.trim().substring("info=".length); }
  });
  if (infoString) {
    const Data = JSON.parse(decodeURIComponent(infoString));
    clickAbleElements.forEach((element, index) => {
      if (Data[index].status) element.classList.add(Data[index].status);
      if (Data[index].inText) element.querySelector('.in').textContent = Data[index].inText;
      if (Data[index].outText) element.querySelector('.out').textContent = Data[index].outText;
    })
  }
}
// 清除當前頁面
function cleanView() {
  clickAbleElements.forEach(element => {
    element.classList = 'clickAble';
    element.querySelector('.in').textContent = '';
    element.querySelector('.out').textContent = '';
  })
  Toast.fire({ icon: "success", title: "成功清除" });
}

// *********************** 網頁執行 ***********************

// 取得所有room元素
const roomElements = document.querySelectorAll('.room');
roomElements.forEach((element) => {
  element.addEventListener('click', () => {    
    element.classList.toggle('leave');
  })
})
// 取得所有內容元素
const clickAbleElements = document.querySelectorAll('.clickAble');
loadCookieData();
// 迭代每個元素建立點擊事件監聽
clickAbleElements.forEach((element) => {
  element.addEventListener('click', () => {
    const number = element.querySelector('.number')
    const elementIn = element.querySelector('.in')
    const elementOut = element.querySelector('.out')
    if (element.classList.contains("locked")) {
      if (document.getElementById('unlock').checked) {
        swal.fire({
          title: "解除鎖定並清空資訊",
          icon: "warning",
          text: `您確定要對 ${number.textContent} 執行此操作嗎？`,
          showCancelButton: true,
          focusCancel: true,
        }).then((result) => {
          if (result.isConfirmed) {
            elementIn.textContent = ''; elementOut.textContent = '';
            element.classList.remove('locked');
            saveInfoInCookie();
            Toast.fire({ icon: "success", title: "成功清除" });
          }
        })
      }
    } else {
      const isSafe = document.getElementById('comfirm').checked;
      if (!element.classList.contains("selected")) {
        if (isSafe) {
          swal.fire({
            title: "開始監考",
            icon: "warning",
            text: `您確定要對 ${number.textContent} 執行此操作嗎？`,
            showCancelButton: true,
            focusCancel: true,
          }).then((result) => {
            if (result.isConfirmed) {
              element.classList.add('selected');
              showTimer(elementIn);
            }
          })
        } else {
          element.classList.add('selected');
          showTimer(elementIn);
        }
      } else {
        if (isSafe) {
          swal.fire({
            title: "結束監考",
            icon: "warning",
            text: `您確定要對 ${number.textContent} 執行此操作嗎？`,
            showCancelButton: true,
            focusCancel: true,
          }).then((result) => {
            if (result.isConfirmed) {
              element.classList.remove('selected');
              element.classList.add('locked');
              showTimer(elementOut);
            }
          })
        } else {
          element.classList.remove('selected');
          element.classList.add('locked');
          showTimer(elementOut);
        }
      }
    }
  });
});
// 清除緩存按鈕點擊事件
document.getElementById("cleanCookie").addEventListener("click", () => {
  swal.fire({
    title: "清空網站緩存",
    icon: "warning",
    iconColor: 'red',
    text: `您確定要執行此操作嗎？`,
    showCancelButton: true,
    focusCancel: true,
  }).then((result) => {
    if (result.isConfirmed) {
      // 將 cookie 的到期日期設為過去的時間，從而清除所有 cookie
      document.cookie = "info=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/website/invigilate;";
      cleanView();
    }
  })
});