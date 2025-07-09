let data = [];
let editingIndex = -1;
const rowsPerPage = 5;
let currentPage = 1;

document.getElementById('absensiForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const absen = {
    nama: document.getElementById('nama').value,
    alamat: document.getElementById('alamat').value,
    jenisKelamin: document.getElementById('jenisKelamin').value,
    tanggalAbsen: document.getElementById('tanggalAbsen').value,
    jamMasuk: document.getElementById('jamMasuk').value,
    jamKeluar: document.getElementById('jamKeluar').value
  };

  if (editingIndex >= 0) {
    data[editingIndex] = absen;
    editingIndex = -1;
  } else {
    data.push(absen);
  }

  this.reset();
  renderTable();
});

function formatJamTo12Hour(jam) {
  const [hour, minute] = jam.split(':');
  const date = new Date();
  date.setHours(parseInt(hour, 10));
  date.setMinutes(parseInt(minute, 10));
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function renderTable() {
  const table = document.getElementById('dataTable');
  table.innerHTML = '';

  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedData = data.slice(start, end);

  paginatedData.forEach((item, index) => {
    const row = `<tr>
      <td>${start + index + 1}</td>
      <td>${item.nama}</td>
      <td>${item.alamat}</td>
      <td>${item.jenisKelamin}</td>
      <td>${item.tanggalAbsen}</td>
      <td>${formatJamTo12Hour(item.jamMasuk)}</td>
      <td>${formatJamTo12Hour(item.jamKeluar)}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editData(${start + index})">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteData(${start + index})">Hapus</button>
      </td>
    </tr>`;
    table.insertAdjacentHTML('beforeend', row);
  });

  const container = document.getElementById('absensiContainer');
  container.style.display = data.length > 0 ? 'block' : 'none';

  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(data.length / rowsPerPage);
  if (totalPages === 0) return;

  for (let i = 1; i <= totalPages; i++) {
    const li = `<li class="page-item ${i === currentPage ? 'active' : ''}">
      <button class="page-link" onclick="goToPage(${i})">${i}</button>
    </li>`;
    pagination.insertAdjacentHTML('beforeend', li);
  }
}

function goToPage(page) {
  currentPage = page;
  renderTable();
}

function editData(index) {
  const item = data[index];
  document.getElementById('nama').value = item.nama;
  document.getElementById('alamat').value = item.alamat;
  document.getElementById('jenisKelamin').value = item.jenisKelamin;
  document.getElementById('tanggalAbsen').value = item.tanggalAbsen;
  document.getElementById('jamMasuk').value = item.jamMasuk;
  document.getElementById('jamKeluar').value = item.jamKeluar;
  editingIndex = index;
}

function deleteData(index) {
  if (confirm('Yakin hapus data?')) {
    data.splice(index, 1);
    const totalPages = Math.ceil(data.length / rowsPerPage);
    if (currentPage > totalPages) {
      currentPage = Math.max(1, totalPages);
    }
    renderTable();
  }
}

function sortByNama() {
  data.sort((a, b) => a.nama.localeCompare(b.nama));
  renderTable();
}

renderTable();
