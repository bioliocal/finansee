        const userAktif = localStorage.getItem("userAktif");
        if (!userAktif) {
            alert("Anda belum login! Mengalihkan ke halaman utama.");
            window.location.href = "index.html";
        }

        let tipeTransaksi = "pengeluaran";
        const btnPengeluaran = document.getElementById("btnPengeluaran");
        const btnPemasukan = document.getElementById("btnPemasukan");
        const groupKategori = document.getElementById("group-kategori");
        const groupKeterangan = document.getElementById("group-keterangan");
        const inputKategori = document.getElementById("kategori");
        const inputJumlah = document.getElementById("jumlah");
        const inputKeterangan = document.getElementById("keterangan");

        inputJumlah.addEventListener("input", function(e) {
            let angkaMurni = this.value.replace(/\D/g, "");
            let hasilFormat = angkaMurni.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            this.value = hasilFormat;
        });

        btnPengeluaran.addEventListener("click", () => {
            tipeTransaksi = "pengeluaran";
            btnPengeluaran.classList.add("active");
            btnPemasukan.classList.remove("active");
            groupKategori.style.display = "flex";
            groupKeterangan.style.display = "flex";
            inputKategori.required = true;
        });

        btnPemasukan.addEventListener("click", () => {
            tipeTransaksi = "pemasukan";
            btnPemasukan.classList.add("active");
            btnPengeluaran.classList.remove("active");
            groupKategori.style.display = "none";
            groupKeterangan.style.display = "none";
            inputKategori.required = false;
        });

        document.getElementById("transactionForm").addEventListener("submit", function(e) {
            e.preventDefault();
            const tanggalRealtime = new Date().toISOString(); 
            
            const nilaiKolom = inputJumlah.value;
            const jumlahMurni = nilaiKolom.replace(/\./g, ""); 
            const jumlah = parseInt(jumlahMurni) || 0;

            if (jumlah <= 0) {
                alert("Masukkan jumlah uang yang valid!");
                return;
            }

            const kategori = tipeTransaksi === "pengeluaran" ? inputKategori.value : "Pemasukan";
            const keterangan = tipeTransaksi === "pengeluaran" ? (inputKeterangan.value || "Pengeluaran Tanpa Catatan") : "Uang Masuk";

            const dataBaru = { tipeTransaksi, tanggal: tanggalRealtime, kategori, jumlah, keterangan };
            
            const keyDataUser = "dataFinansee_" + userAktif;
            let daftarTransaksi = JSON.parse(localStorage.getItem(keyDataUser)) || [];
            daftarTransaksi.push(dataBaru);
            localStorage.setItem(keyDataUser, JSON.stringify(daftarTransaksi));

            alert("Transaksi berhasil disimpan!");
            window.location.href = "dashboard.html";
        });