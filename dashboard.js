const userAktif = localStorage.getItem("userAktif");
if (!userAktif) {
    alert("Anda belum login! Mengalihkan ke halaman utama.");
    window.location.href = "index.html";
}

document.getElementById("historyTitle").innerText = `Daftar Rekam Transaksi (${userAktif})`;

const keyDataUser = "dataFinansee_" + userAktif;
const databaseLokal = JSON.parse(localStorage.getItem(keyDataUser)) || [];

const filterHarian = document.getElementById("filter-harian");
const filterMingguan = document.getElementById("filter-mingguan");
const filterBulanan = document.getElementById("filter-bulanan");
const filterTahunan = document.getElementById("filter-tahunan");
const listContainer = document.getElementById("listTransaksi");

const daftarHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const daftarBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

function buatTeksDetailWaktu(tanggalObj) {
    const namaHari = daftarHari[tanggalObj.getDay()];
    const tgl = tanggalObj.getDate();
    const namaBulan = daftarBulan[tanggalObj.getMonth()];
    const tahun = tanggalObj.getFullYear();

    return `${namaHari}, ${tgl} ${namaBulan} ${tahun}`;
}

function tampilkanDataBerdasarkanWaktu(rentang) {
    listContainer.innerHTML = "";
    let totalPemasukan = 0;
    let totalPengeluaran = 0;
    const hariIni = new Date();
    
    const dataTerfilter = databaseLokal.filter(item => {
        const tanggalItem = new Date(item.tanggal);
        const selisihWaktu = hariIni - tanggalItem;
        const selisihHari = Math.floor(selisihWaktu / (1000 * 60 * 60 * 24));

        if (rentang === "harian") {
            return tanggalItem.toDateString() === hariIni.toDateString()
        } else if (rentang === "mingguan") {
            return selisihHari >= 0 && selisihHari <= 7;
        } else if (rentang === "bulanan") {
            return tanggalItem.getMonth() === hariIni.getMonth() && tanggalItem.getFullYear() === hariIni.getFullYear();
        } else if (rentang === "tahunan") {
            return tanggalItem.getFullYear() === hariIni.getFullYear();
        }
        return false;
    });

    dataTerfilter.forEach(item => {
        if (item.tipeTransaksi === "pemasukan") totalPemasukan += item.jumlah;
        else totalPengeluaran += item.jumlah;

        const tanggalObj = new Date(item.tanggal);
        const teksDetailWaktu = buatTeksDetailWaktu(tanggalObj);
        const itemHTML = document.createElement("div");
        itemHTML.classList.add("transaction-item");
        
        const tanda = item.tipeTransaksi === "pemasukan" ? "+" : "-";
        const warnaKelas = item.tipeTransaksi === "pemasukan" ? "text-pemasukan" : "text-pengeluaran";

        const teksTampilan = (!item.keterangan || item.keterangan.trim() === "" || item.keterangan === "tanpa catatan") 
            ? item.kategori 
            : item.keterangan;

        itemHTML.innerHTML = `
            <div class="left-side">
                <strong>${teksTampilan}</strong>
                <span>${teksDetailWaktu}</span>
            </div>
            <div class="right-side-amount ${warnaKelas}">
                <strong>${tanda} Rp ${item.jumlah.toLocaleString('id-ID')}</strong>
            </div>
        `;
        listContainer.appendChild(itemHTML);
    });

    const totalSaldo = totalPemasukan - totalPengeluaran;
    document.getElementById("totalPemasukan").innerText = `Rp ${totalPemasukan.toLocaleString('id-ID')}`;
    document.getElementById("totalPengeluaran").innerText = `Rp ${totalPengeluaran.toLocaleString('id-ID')}`;
    
    const saldoElement = document.getElementById("totalSaldo");
    saldoElement.innerText = `Rp ${totalSaldo.toLocaleString('id-ID')}`;
    saldoElement.style.color = totalSaldo < 0 ? "#ffcdd2" : "white";

    if (dataTerfilter.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:#999; font-size:14px; margin-top:30px;">Tidak ada transaksi</p>`;
    }
}

function resetAktifFilter(elemenAktif) {
    [filterHarian, filterMingguan, filterBulanan, filterTahunan].forEach(btn => btn.classList.remove("active"));
    elemenAktif.classList.add("active");
}

filterHarian.addEventListener("click", () => { resetAktifFilter(filterHarian); tampilkanDataBerdasarkanWaktu("harian"); });
filterMingguan.addEventListener("click", () => { resetAktifFilter(filterMingguan); tampilkanDataBerdasarkanWaktu("mingguan"); });
filterBulanan.addEventListener("click", () => { resetAktifFilter(filterBulanan); tampilkanDataBerdasarkanWaktu("bulanan"); });
filterTahunan.addEventListener("click", () => { resetAktifFilter(filterTahunan); tampilkanDataBerdasarkanWaktu("tahunan"); });

tampilkanDataBerdasarkanWaktu("harian");
