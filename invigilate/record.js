const table = document.getElementById('invigilate');

// 頁面截圖
document.getElementById('btn-screenshot').addEventListener('click', () => {
  domtoimage.toBlob(table)
    .then((image) => {
      // 將截圖保存為圖片
      const link = document.createElement('a');
      link.href = URL.createObjectURL(image);
      link.download = 'screenshot.png';
      link.click();
    })
    .catch((error) => { console.error('截圖失敗:', error); });
});