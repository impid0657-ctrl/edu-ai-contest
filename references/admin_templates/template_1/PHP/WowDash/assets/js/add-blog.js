
  // Editor Js Start
  const quill = new Quill('#editor', {
    modules: {
      syntax: true,
      toolbar: '#toolbar-container',
    },
    placeholder: 'Compose an epic...',
    theme: 'snow',
  });
  // Editor Js End


  // =============================== Upload Single Image js start here ================================================
  const fileInput = document.getElementById("upload-file");
  const imagePreview = document.getElementById("uploaded-img__preview");
  const uploadedImgContainer = document.querySelector(".uploaded-img");
  const removeButton = document.querySelector(".uploaded-img__remove");

  fileInput.addEventListener("change", (e) => {
      if (e.target.files.length) {
      const src = URL.createObjectURL(e.target.files[0]);
      imagePreview.src = src;
      uploadedImgContainer.classList.remove('d-none');
      }
  });
  removeButton.addEventListener("click", () => {
      imagePreview.src = "";
      uploadedImgContainer.classList.add('d-none');
      fileInput.value = ""; 
  });
  // =============================== Upload Single Image js End here ================================================