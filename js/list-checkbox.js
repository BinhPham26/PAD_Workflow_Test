// document.addEventListener("DOMContentLoaded", function () {
//   // Your existing code

//   const STORAGE_KEY = "checkboxItems";
//   const listEl = document.getElementById("list-top-checkbox");
//   const addForm = document.getElementById("addForm");
//   const newItemInput = document.getElementById("newItemInput");
//   const wrapper = document.getElementById("wrapper");
//   const editBtn = document.getElementById("editToggleBtn");

//   let checkboxItems = [];
//   let isEditMode = false;

//   function loadData() {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     checkboxItems = saved
//       ? JSON.parse(saved)
//       : [
//           { text: "Dòng chữ 1", checked: false },
//           { text: "Dòng chữ 2", checked: false },
//           { text: "Dòng chữ 3", checked: false },
//           { text: "Dòng chữ 4", checked: false },
//           { text: "Dòng chữ 5", checked: false },
//         ];
//   }

//   function saveData() {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(checkboxItems));
//   }

//   function updateChart() {
//     const total = checkboxItems.length;
//     const done = checkboxItems.filter((item) => item.checked).length;
//     const percent = total ? Math.round((done / total) * 100) : 0;

//     chart.data.datasets[0].data = [percent, 100 - percent];
//     chart.update();
//     document.getElementById("percentText").innerText = `${percent}%`;
//   }

//   function renderList() {
//     listEl.innerHTML = "";
//     const sorted = [...checkboxItems].sort((a, b) => a.checked - b.checked);
//     sorted.forEach((item, index) => {
//       const container = document.createElement("div");
//       container.className = "container";
//       if (isEditMode) container.classList.add("edit-mode");

//       const span = document.createElement("span");
//       span.className = "text";
//       span.textContent = item.text;
//       if (item.checked) span.classList.add("faded");

//       const checkbox = document.createElement("input");
//       checkbox.type = "checkbox";
//       checkbox.checked = item.checked;

//       checkbox.addEventListener("change", () => {
//         item.checked = checkbox.checked;
//         saveData();
//         renderList();
//         updateChart();
//       });

//       const removeBtn = document.createElement("button");
//       removeBtn.className = "remove-btn";
//       removeBtn.textContent = "×";
//       removeBtn.title = "Xoá dòng này";
//       removeBtn.addEventListener("click", () => {
//         checkboxItems.splice(index, 1);
//         saveData();
//         renderList();
//         updateChart();
//       });

//       container.appendChild(span);
//       container.appendChild(checkbox);
//       container.appendChild(removeBtn);

//       listEl.appendChild(container);
//     });
//   }

//   addForm.addEventListener("submit", (e) => {
//     e.preventDefault();
//     const value = newItemInput.value.trim();
//     if (value) {
//       checkboxItems.push({ text: value, checked: false });
//       newItemInput.value = "";
//       saveData();
//       renderList();
//       updateChart();
//     }
//   });

//   const ctx = document.getElementById("progressChart").getContext("2d");
//   const chart = new Chart(ctx, {
//     type: "doughnut",
//     data: {
//       labels: ["Hoàn thành", "Còn lại"],
//       datasets: [
//         {
//           data: [0, 100],
//           backgroundColor: ["#4caf50", "#e0e0e0"],
//           borderWidth: 0,
//         },
//       ],
//     },
//     options: {
//       cutout: "70%",
//       plugins: {
//         legend: { display: false },
//         tooltip: { enabled: false },
//       },
//     },
//   });

//   loadData();
//   renderList();
//   updateChart();
//   const cancelEditBtn = document.getElementById("cancelEditBtn");
//   const clickAllBtn = document.getElementById("clickAllBtn");

//   let previousState = [];

//   // Lưu trạng thái trước khi sửa
//   function backupState() {
//     previousState = JSON.parse(JSON.stringify(checkboxItems));
//   }

//   // Khôi phục trạng thái ban đầu
//   function restoreState() {
//     checkboxItems = JSON.parse(JSON.stringify(previousState));
//     saveData();
//     isEditMode = false;
//     wrapper.classList.remove("edit-mode");
//     addForm.style.display = "none";
//     editBtn.textContent = "Sửa";
//     cancelEditBtn.style.display = "none";
//     renderList(); // 🔥 THÊM DÒNG NÀY để cập nhật lại danh sách và ẩn nút xóa
//     updateChart();
//   }

//   // Nút "Sửa" toggle
//   editBtn.addEventListener("click", () => {
//     isEditMode = !isEditMode;
//     wrapper.classList.toggle("edit-mode", isEditMode);
//     addForm.style.display = isEditMode ? "flex" : "none";
//     editBtn.textContent = isEditMode ? "Lưu" : "Sửa";
//     cancelEditBtn.style.display = isEditMode ? "inline-block" : "none";

//     if (isEditMode) {
//       backupState();
//     }
//     renderList();
//   });

//   // Nút "Huỷ" trả lại trạng thái ban đầu
//   cancelEditBtn.addEventListener("click", () => {
//     restoreState();
//   });

//   // Nút "Click All"
//   clickAllBtn.addEventListener("click", () => {
//     const allChecked = checkboxItems.every((item) => item.checked);
//     checkboxItems.forEach((item) => (item.checked = !allChecked));
//     saveData();
//     renderList();
//     updateChart();
//   });
// });
document.addEventListener("DOMContentLoaded", function () {
  const boxes = document.querySelectorAll(".box-top-checkbox");

  boxes.forEach((box, index) => {
    const STORAGE_KEY = `checkboxItems_${index}`; // Mỗi box 1 storage riêng

    const listEl = box.querySelector(".list-top-checkbox");
    const addForm = box.querySelector(".addForm");
    const newItemInput = box.querySelector(".newItemInput");
    const wrapper = box.querySelector(".wrapper");
    const editBtn = box.querySelector(".editToggleBtn");
    const cancelEditBtn = box.querySelector(".cancelEditBtn");
    const clickAllBtn = box.querySelector(".clickAllBtn");
    const percentText = box.querySelector(".percentText");

    let checkboxItems = [];
    let isEditMode = false;
    let previousState = [];

    const ctx = box.querySelector(".progressChart").getContext("2d");
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Hoàn thành", "Còn lại"],
        datasets: [
          {
            data: [0, 100],
            backgroundColor: ["#4caf50", "#e0e0e0"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: "70%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    });

    function loadData() {
      const saved = localStorage.getItem(STORAGE_KEY);
      checkboxItems = saved
        ? JSON.parse(saved)
        : [
            { text: "Dòng chữ 1", checked: false },
            { text: "Dòng chữ 2", checked: false },
            { text: "Dòng chữ 3", checked: false },
          ];
    }

    function saveData() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkboxItems));
    }

    function updateChart() {
      const total = checkboxItems.length;
      const done = checkboxItems.filter((item) => item.checked).length;
      const percent = total ? Math.round((done / total) * 100) : 0;

      chart.data.datasets[0].data = [percent, 100 - percent];
      chart.update();
      percentText.innerText = `${percent}%`;
    }

    function renderList() {
      listEl.innerHTML = "";
      const sorted = [...checkboxItems].sort((a, b) => a.checked - b.checked);
      sorted.forEach((item, index) => {
        const container = document.createElement("div");
        container.className = "container";
        if (isEditMode) container.classList.add("edit-mode");

        const span = document.createElement("span");
        span.className = "text";
        span.textContent = item.text;
        if (item.checked) span.classList.add("faded");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.checked;

        checkbox.addEventListener("change", () => {
          item.checked = checkbox.checked;
          saveData();
          updateChart();

          // Tạm thêm hoặc gỡ class để có hiệu ứng trước khi render lại
          if (item.checked) {
            span.classList.add("faded");
          } else {
            span.classList.remove("faded");
          }

          // Delay nhẹ rồi mới render lại để sort vị trí
          setTimeout(() => {
            renderList();
          }, 200); // 200ms để khớp với CSS transition
        });

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "×";
        removeBtn.title = "Xoá dòng này";
        removeBtn.addEventListener("click", () => {
          checkboxItems.splice(index, 1);
          saveData();
          renderList();
          updateChart();
        });

        container.appendChild(span);
        container.appendChild(checkbox);
        container.appendChild(removeBtn);
        listEl.appendChild(container);
      });
    }

    function backupState() {
      previousState = JSON.parse(JSON.stringify(checkboxItems));
    }

    function restoreState() {
      checkboxItems = JSON.parse(JSON.stringify(previousState));
      saveData();
      isEditMode = false;
      wrapper.classList.remove("edit-mode");
      addForm.style.display = "none";
      editBtn.textContent = "Sửa";
      cancelEditBtn.style.display = "none";
      renderList();
      updateChart();
    }

    editBtn.addEventListener("click", () => {
      isEditMode = !isEditMode;
      wrapper.classList.toggle("edit-mode", isEditMode);
      addForm.style.display = isEditMode ? "flex" : "none";
      editBtn.textContent = isEditMode ? "Lưu" : "Sửa";
      cancelEditBtn.style.display = isEditMode ? "inline-block" : "none";

      if (isEditMode) {
        backupState();
      }
      renderList();
    });

    cancelEditBtn.addEventListener("click", () => {
      restoreState();
    });

    clickAllBtn.addEventListener("click", () => {
      const allChecked = checkboxItems.every((item) => item.checked);
      checkboxItems.forEach((item) => (item.checked = !allChecked));
      saveData();
      renderList();
      updateChart();
    });

    addForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const value = newItemInput.value.trim();
      if (value) {
        checkboxItems.push({ text: value, checked: false });
        newItemInput.value = "";
        saveData();
        renderList();
        updateChart();
      }
    });

    // Khởi tạo
    loadData();
    renderList();
    updateChart();
  });
});
