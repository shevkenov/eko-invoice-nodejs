function uploadFile(event){  
    const files = event.target.files[0];
    const formData = new FormData();
    formData.append('fileToUpload', files) 

    const ajax = new XMLHttpRequest();

    ajax.open("POST", "/upload");
    ajax.send(formData);
}

const browseInput = document.querySelector(".inputUploadFile");
const progressInfo = document.querySelector(".progressInfo");
const downloadFile = document.querySelector(".downloadFile");
const progressBar = document.querySelector(".progressBar");
const invoice = document.querySelector('.invoice');
const invoiceResultTable = document.querySelector('#customers');

if(invoiceResultTable){
  invoice.setAttribute("style", "height: calc(100%)");
}

browseInput.addEventListener("change", event => {
  const files = event.target.files[0];
  const formData = new FormData();
  formData.append("fileToUpload", files);

  const ajax = new XMLHttpRequest();
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", ajaxComplete, false);
  ajax.addEventListener("abort", ajaxAbortHandler, false);
  ajax.addEventListener("error", ajaxErrorHandler, false);

  ajax.open("post", "/uploadVat");
  ajax.send(formData);
});

downloadFile.addEventListener("click", event => {
  downloadFile.setAttribute("style", "display: none");
  progressInfo.textContent = "";
  progressBar.setAttribute("style", `width: 0`);
});

function progressHandler(event) {
  var percent = (event.loaded / event.total) * 100;
  percent = parseInt(percent);

  progressBar.setAttribute("style", `width: ${percent}%`);
  progressInfo.textContent = `${percent}% of data uploaded... please wait!`;
}

function ajaxComplete() {
  progressInfo.textContent = "Upload Completed!";
  downloadFile.setAttribute("style", "display: block");
}

function ajaxAbortHandler() {
  progressInfo.textContent = "Upload aborted!";
}

function ajaxErrorHandler() {
  progressInfo.textContent = "Upload failed!";
}
