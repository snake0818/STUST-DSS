//****************************** 內容資訊 ******************************/
// 參數設置
const width = '1600px';
const height = '900px';
const captionWidth = '10%';
const contentWidth = '90%';

const classificate_col_num = 2;
const content_col_cell_num = 4;
const cookieName = 'examination_schedule_infomation';

// 表格標頭
const timeRowText = [
  { col: classificate_col_num, content: "時程規劃", },
  { col: content_col_cell_num, content: "08:30~09:15   13:00~13:45", },
  { col: content_col_cell_num, content: "09:25~10:10   13:55~14:40", },
  { col: content_col_cell_num, content: "10:20~11:05   14:50~15:35", },
  { col: content_col_cell_num, content: "11:15~12:00   15:45~16:30", },
];

// 項目名稱
const timeCourse = [
  { room: "監一", name: "01.生命徵象測量" },
  { room: "監二", name: "01.生命徵象測量" },
  { name: "02.成人異物梗塞急救法" },
  { name: "03.成人心肺復甦術" },
  { room: "監三", name: "04.備餐、餵食及協助用藥" },
  { room: "監四", name: "04.備餐、餵食及協助用藥" },
  { room: "監五", name: "04.備餐、餵食及協助用藥" },
  { room: "監六", name: "05.洗頭、衣物更換" },
  { room: "監七", name: "06.會陰沖洗及尿管清潔" },
  { name: "07.協助上下床及坐輪椅" },
];

// 配色
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
];

// 考生編號
const studentNum = [
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

// 考核時間
const estimatedTimes = [20, 20, 5, 6, 40, 40, 40, 40, 25, 20];

// 吐司資訊
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

//****************************** 動態生成 ******************************/
// 參數設置
const content_col_num = timeRowText.length - 1;

// 標題設置
const thead = document.querySelector('#invigilate thead');
thead.querySelector('th').colSpan = classificate_col_num + content_col_num * content_col_cell_num;
// 時程表設置
timeRowText.forEach(({ content, col }) => {
  const cell = document.createElement('th');
  // 設置 th(cell) 內容與屬性，並將其添加至 thead
  cell.textContent = content;
  cell.colSpan = col;
  thead.appendChild(cell);
});

// 監考分類與項目設置
const tbody = document.querySelector('#invigilate tbody');
let prevRoom = null, rowspan = 0;
timeCourse.forEach(({ room, name }, index) => {
  const row = document.createElement('tr');
  const rCell = document.createElement('th');
  const nCell = document.createElement('th');
  // 檢查 room 是否存在，沒有則代表與前項同間監考考場，並將 rowspan 都增加
  if (!room) { rowspan++; tbody.children[index - rowspan].cells[0].rowSpan++; }
  else {
    rowspan = 0;
    // 設置 th(rCell) 內容與屬性，並將其添加至 row
    rCell.textContent = prevRoom = room;
    rCell.classList.add('room');
    row.appendChild(rCell);
  }
  // 設置 th(nCell) 內容與屬性，並將其添加至 row
  nCell.textContent = name;
  nCell.classList.add('name');
  row.appendChild(nCell);

  // 設置 tr(row) 屬性，並將其添加至 tbody
  row.id = `r${index}`;
  row.style.backgroundColor = colors[index];
  tbody.appendChild(row);
});

// 考生內容設置
const rowList = tbody.querySelectorAll('tr');
rowList.forEach((row, index) => {
  // 取得並分解內容
  const content_list = studentNum[index].split(',');
  // 依據內容設置區域參數
  const col_cell_num = content_list.length / content_col_cell_num;
  const cell_col_num = content_col_cell_num ** 2 / content_list.length;
  let null_cell_count = 0; // 累計空格數

  content_list.forEach((item, contentIndex) => {
    if (item === "00") {
      // 若前面無空格或換行則建立
      if (!null_cell_count || !(contentIndex % col_cell_num)) {
        const nullCell = document.createElement('td');
        nullCell.colSpan = !null_cell_count ? cell_col_num : cell_col_num * null_cell_count;
        row.appendChild(nullCell);
      } else {
        row.lastChild.colSpan += cell_col_num;
      }
      null_cell_count++;
    }
    else {
      // 清除空格記數
      null_cell_count = 0;

      // 設置考生及進出時間元素
      const item_cell = document.createElement('td');
      item_cell.innerHTML = `
        <div class="student">${item}號</div>
        <div class="time">
          <div class="Entry-time-set">進<span class="Entry-time"></span></div>
          <div class="Leave-time-set">出<span class="Leave-time"></span></div>
        </div>
        <div class="Countdown"></div>
      `;
      item_cell.colSpan = cell_col_num;
      item_cell.classList.add('clickAble');

      row.appendChild(item_cell);
    }
  })
})

// 將格式化的時間設置為相應元素的 textContent
function formatTime(time) {
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 標記時間
function showTimer(rowIndex, element0, element1, settingTime = null) {
  // 若無設置時間則寫入當前時間
  settingTime = settingTime || new Date();
  element0.textContent = formatTime(settingTime);
  // 寫入預計時間
  const estimated = new Date(settingTime.getTime() + estimatedTimes[rowIndex] * 60000);
  element1.textContent = formatTime(estimated);
}

// 存入考試流程表資訊至 cookie 中
function saveInfoInCookie() {
  var dataToStore = [];
  clickAbleElements.forEach(element => {
    // 考生考試狀態紀錄
    const status = element.classList[1];
    // 考生號碼紀錄
    const number = element.querySelector('.student').textContent;
    // 考生進場時間紀錄
    const entryText = element.querySelector('.Entry-time').textContent;
    const entryTime = (entryText === '') ? undefined : entryText;
    // 考生離場時間紀錄
    const leaveText = element.querySelector('.Leave-time').textContent;
    const leaveTime = (leaveText === '') ? undefined : leaveText;
    // 將考生資訊紀錄到陣列中
    dataToStore.push({ status, number, entryTime, leaveTime });
  });
  // 將 dataToStore 物件轉換為字串格式
  var dataString = JSON.stringify(dataToStore);
  // 將資料存入 Cookie
  document.cookie = `${cookieName}=${dataString}`;
}

// 讀取 cookie 中考試流程表資訊，並填入對應元素
function loadCookieData() {
  // 獲取包含所有 Cookie 的字串
  var cookieString = document.cookie;
  // 將字串分割成各個 Cookie
  var cookieArray = cookieString.split(";");
  // 用於紀錄取得的 cookie 內容
  var infoString = null;

  // 在 Cookie 中尋找對應的 Cookie
  cookieArray.forEach(cookie => {
    // 提取 cookie 的內容
    if (cookie.trim().startsWith(`${cookieName}=`)) {
      infoString = cookie.trim().substring(`${cookieName}=`.length);
    }
  });

  // 如果內容存在則解析並填入數據
  if (infoString) {
    try {
      // 解碼並解析 JSON 字串
      const Data = JSON.parse(decodeURIComponent(infoString));
      clickAbleElements.forEach((element, index) => {
        // 如果有狀態紀錄，則添加對應的狀態類別
        if (Data[index].status) element.classList.add(Data[index].status);
        // 如果有進場時間，則設置對應元素的文本內容
        if (Data[index].entryTime) element.querySelector('.Entry-time').textContent = Data[index].entryTime;
        // 如果有離場時間，則設置對應元素的文本內容
        if (Data[index].leaveTime) element.querySelector('.Leave-time').textContent = Data[index].leaveTime;
      })
    } catch (err) {
      console.error("Error parsing JSON from cookie:", err);
    }
  }
}

// 檢驗 cookie 是否存在
function checkCookieExist(cookie_name) {
  // 取得 cookie 字串後格式化文字並分裂各個 cookie 後，做尋找的動作
  const exist = document.cookie.trim().split(';').find(row => row.startsWith(`${cookie_name}=`));
  return exist ? true : false;
}

//****************************** 網頁執行 ******************************/

// 取得所有 room 元素，並添加點擊事件監聽器切換 leave 類別
const roomElements = document.querySelectorAll('.room');
roomElements.forEach(element => {
  element.addEventListener('click', () => {
    element.classList.toggle('leave');
  })
});

// 清除緩存按鈕點擊事件
document.getElementById("clean-cookie").addEventListener("click", () => {
  // 檢驗 cookie 是否存在
  if (checkCookieExist(cookieName)) {
    // 確認介面
    swal.fire({
      title: "清空網站緩存",
      icon: "warning",
      iconColor: 'red',
      text: `您確定要執行此操作嗎？`,
      showCancelButton: true,
      focusCancel: true,
    }).then(result => {
      if (result.isConfirmed) {
        const path = window.location.pathname.replace(/\/[^\/]*$/, '');
        // 使 cookie 過期，從而清除所有 cookie
        document.cookie = `${cookieName}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0;`;
        // 初始化表格內容
        clickAbleElements.forEach(element => {
          element.classList = 'clickAble';
          element.querySelector('.Entry-time').textContent = '';
          element.querySelector('.Leave-time').textContent = '';
          element.querySelector('.Countdown').style.display = 'none';
          element.querySelector('.Entry-time-set').style.display = 'block';
          element.querySelector('.Leave-time-set').style.display = 'block';
        })
        // 檢驗 cookie 是否被刪除並給予回應
        if (!checkCookieExist(cookieName)) {
          Toast.fire({ icon: "success", title: "成功清除緩存" });
        }
      }
    })
  } else {
    Toast.fire({ icon: "error", title: "緩存並不存在" });
  }
});

// 模式清除按鈕點擊事件
document.getElementById("clean-mode").addEventListener("click", () => {
  document.querySelectorAll('.btn-check[type="radio"]').forEach(radio => {
    radio.checked = false;
  })
})

// 取得所有內容元素
const clickAbleElements = document.querySelectorAll('.clickAble');
loadCookieData(); // 執行讀取資訊函數
// 迭代每個元素建立點擊事件監聽
clickAbleElements.forEach(element => {
  element.addEventListener('click', () => {
    const number = element.querySelector('.student');
    const elementEntry = element.querySelector('.Entry-time-set');
    const elementLeave = element.querySelector('.Leave-time-set');
    const elementEntryTime = element.querySelector('.Entry-time');
    const elementLeaveTime = element.querySelector('.Leave-time');

    // 階段操作
    const operate = (interface_title, isSafe = null) => {
      const rIndex = (element.parentElement.id).replace('r', '');
      // 根據介面標題設置操作函數
      var confirmAction = null;
      switch (interface_title) {
        case '開始監考':
          // 給予類別(學生進場)，並記錄時間
          confirmAction = () => {
            element.classList.add('selected');
            showTimer(rIndex, elementEntryTime, elementLeaveTime);
          };
          break;
        case '結束監考':
          // 更新階段類別
          confirmAction = () => {
            element.classList.remove('selected');
            element.classList.add('locked');

            var timer = element.querySelector('.Countdown');
            if (!timer.classList.contains('running')) {
            var time = 300;
              timer.classList.add('running');
              elementEntry.style.display = 'none';
              elementLeave.style.display = 'none';
              var countdown = setInterval(function () {
                var minutes = Math.floor(time / 60);
                var seconds = time % 60;
                seconds = seconds < 10 ? '0' + seconds : seconds;
                timer.textContent = minutes + ':' + seconds;
                time--;
                if (time < 0) {
                  clearInterval(countdown);
                  timer.textContent = '';
                  elementEntry.style.display = 'block';
                  elementLeave.style.display = 'block';
                  timer.classList.remove('running');
                }
              }, 1000);
            }
          };
          break;
        case '解除鎖定並清空資訊':
        case '解除缺席狀態':
          isSafe = true;
          confirmAction = () => {
            // 清除時間內容與鎖定類別
            elementEntryTime.textContent = '';
            elementLeaveTime.textContent = '';
            element.classList.remove('locked');
            element.classList.remove('absent');
            Toast.fire({ icon: "success", title: "成功清除" });
          }
          break;
        case '編輯進場時間':
          confirmAction = () => {
            Swal.fire({
              title: "請輸入進場時間",
              html: `
                <div id="timeset">
                  <input id="setHour" class="swal2-input" min="0" max="23" placeholder="小時">
                  <span>:</span>
                  <input id="setMinute" class="swal2-input" min="0" max="59" placeholder="分鐘">
                </div>
              `,
              showCancelButton: true,
              showLoaderOnConfirm: true,
              didOpen: () => {
                const hourInput = document.getElementById('setHour');
                const minuteInput = document.getElementById('setMinute');
                // 限制只能輸入數字
                [hourInput, minuteInput].forEach(item => {
                  item.addEventListener('input', (event) => {
                    event.target.value = event.target.value.replace(/\D/g, '');
                  })
                })
              },
              preConfirm: async () => {
                const timeset = document.getElementById('timeset');
                const hour = timeset.querySelector('#setHour').value;
                const minute = timeset.querySelector('#setMinute').value;
                // 檢驗輸入符合條件(輸入為數字、不為空且在合法範圍)
                if (!/^\d+$/.test(hour) || !/^\d+$/.test(minute)
                  || hour === "" || minute === ""
                  || hour < 0 || hour > 23
                  || minute < 0 || minute > 59) {
                  Swal.showValidationMessage('請輸入有效的時間（0-23小時，0-59分鐘）');
                  return false;
                }
                // 設定時間並回傳字串
                const setTime = new Date();
                setTime.setHours(hour);
                setTime.setMinutes(minute);
                setTime.setSeconds(0);
                return setTime;
              },
            }).then((result) => {
              if (result.isConfirmed) {
                // 設置時間
                showTimer(rIndex, elementEntryTime, elementLeaveTime, result.value);
                Toast.fire({ icon: "success", title: "成功編輯進場時間" });
              }
            });
          }
          break;
        case '標記學生為缺考':
          confirmAction = () => {
            // 清除時間內容與鎖定類別
            elementEntryTime.textContent = '';
            elementLeaveTime.textContent = '';
            element.classList.add('absent');
            Toast.fire({ icon: "success", title: "成功標記" });
          }
          break;
      }

      // 執行動作並更新緩存
      const action = () => { confirmAction(); saveInfoInCookie(); }
      // 防誤觸狀態且有操作函數
      if (isSafe) {
        // 確認介面
        swal.fire({
          title: `${interface_title}`,
          icon: "warning",
          text: `您確定要對 ${number.textContent} 執行此操作嗎？`,
          showCancelButton: true,
          focusCancel: true,
        }).then((result) => { if (result.isConfirmed) { action(); } })
      } else { action(); }
    }
    const ConfirmChecked = document.getElementById('comfirm').checked;
    const AbsentChecked = document.getElementById('absent').checked;
    const UnlockChecked = document.getElementById('unlock').checked;
    const EditChecked = document.getElementById('edit').checked;
    const ElementSelected = element.classList.contains("selected");
    const ElementLocked = element.classList.contains("locked");
    const ElementAbsent = element.classList.contains("absent");

    // 當為缺席模式
    if (AbsentChecked && !ElementSelected && !ElementLocked && !ElementAbsent) { operate("標記學生為缺考", ConfirmChecked); }
    // 當為解鎖模式
    else if (UnlockChecked && (ElementLocked || ElementAbsent)) {
      // 當為鎖定狀態
      if (ElementLocked) { operate("解除鎖定並清空資訊"); }
      // 當為缺席狀態
      if (ElementAbsent) { operate("解除缺席狀態"); }
    }
    else if (EditChecked && (ElementSelected || ElementLocked)) { operate("編輯進場時間", ConfirmChecked); }
    else {
      // 當為非鎖定狀態
      if (!ElementLocked && !ElementAbsent) {
        // 學生有無進場狀態
        if (!ElementSelected) { operate("開始監考", ConfirmChecked); }
        else { operate("結束監考", ConfirmChecked); }
      }
    }
  });
});