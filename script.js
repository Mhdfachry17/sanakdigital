document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================================================
       SANAK DIGITAL
       PETUALANGAN SANAK DIGITAL
       BANK INDONESIA PROVINSI RIAU

       SISTEM:
       GitHub Pages
            ↓
       Google Apps Script
            ↓
       Google Drive + Google Sheets
       ========================================================= */


    /* =========================================================
       KONFIGURASI
       ========================================================= */

    const API_URL =
        "https://script.google.com/macros/s/AKfycbwjpw-iAGPVjeBgJFMX0QgSBwB4U7y68WmATkwB1hcnxPlFuNDJWNGMe2TSnq6omgyz/exec";

    /*
       Contoh:

       const API_URL =
       "https://script.google.com/macros/s/XXXXXXXXXXXX/exec";
    */


    /*
       Pengaturan kompresi foto.

       1280 px cukup untuk dokumentasi.
       Quality 0.60 membuat ukuran file jauh lebih kecil
       dibanding foto asli kamera iPhone.
    */

    const MAX_IMAGE_SIZE = 1280;
    const JPEG_QUALITY = 0.60;


    /* =========================================================
       HELPER
       ========================================================= */

    function getElement(id) {
        return document.getElementById(id);
    }


    function getAll(selector) {
        return document.querySelectorAll(selector);
    }


    let currentStep = 1;


    /* =========================================================
       ELEMENT
       ========================================================= */

    const startButton =
        getElement("startButton");

    const formSection =
        getElement("formSection");

    const participantForm =
        getElement("participantForm");

    const nextStep1 =
        getElement("nextStep1");

    const nextStep2 =
        getElement("nextStep2");

    const prevStep2 =
        getElement("prevStep2");

    const prevStep3 =
        getElement("prevStep3");

    const submitButton =
        getElement("submitButton");

    const newParticipant =
        getElement("newParticipant");

    const agreement =
        getElement("agreement");


    /* =========================================================
       DAFTAR 7 FOTO
       ========================================================= */

    const uploadConfig = [

        {
            id: "selfie",
            error: "selfieError",
            field: "selfie",
            label: "Foto Selfie",
            message: "Foto selfie wajib diunggah."
        },

        {
            id: "accountProof",
            error: "accountProofError",
            field: "accountProof",
            label: "Bukti Kepemilikan Akun",
            message:
                "Foto bukti kepemilikan akun wajib diunggah."
        },

        {
            id: "newAccount",
            error: "newAccountError",
            field: "newAccount",
            label: "Akun Baru Dibuat",
            message:
                "Foto bukti akun baru dibuat wajib diunggah."
        },

        {
            id: "qrisProof",
            error: "qrisProofError",
            field: "qrisProof",
            label: "Transaksi QRIS Rp1",
            message:
                "Foto bukti transaksi QRIS Rp1 wajib diunggah."
        },

        {
            id: "qrisEducation",
            error: "qrisEducationError",
            field: "qrisEducation",
            label: "Edukasi QRIS",
            message:
                "Foto edukasi QRIS wajib diunggah."
        },

        {
            id: "postTest",
            error: "postTestError",
            field: "postTest",
            label: "Pengerjaan Post Test",
            message:
                "Foto pengerjaan post test wajib diunggah."
        },

        {
            id: "postTestProof",
            error: "postTestProofError",
            field: "postTestProof",
            label: "Selesai Pengerjaan Post Test",
            message:
                "Foto selesai pengerjaan post test wajib diunggah."
        }

    ];


    /* =========================================================
       SHOW STEP
       ========================================================= */

    function showStep(stepNumber) {

        currentStep = stepNumber;

        const steps =
            getAll(".form-step");

        const stepIndicators =
            getAll(".step");


        steps.forEach(function (step) {

            step.classList.remove("active");


            if (
                step.id ===
                    "step" + stepNumber ||

                step.dataset.step ===
                    String(stepNumber)
            ) {

                step.classList.add("active");

            }

        });


        stepIndicators.forEach(
            function (step, index) {

                const number =
                    index + 1;


                if (
                    number ===
                    stepNumber
                ) {

                    step.classList.add(
                        "active"
                    );

                } else {

                    step.classList.remove(
                        "active"
                    );

                }

            }
        );


        if (formSection) {

            formSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /* =========================================================
       CLEAR ERROR
       ========================================================= */

    function clearErrors() {

        getAll(".error").forEach(
            function (error) {

                error.textContent = "";

            }
        );

    }


    /* =========================================================
       SHOW ERROR
       ========================================================= */

    function showError(
        id,
        message
    ) {

        const error =
            getElement(id);

        if (error) {

            error.textContent =
                message;

        }

    }


    /* =========================================================
       VALIDASI DATA DIRI
       ========================================================= */

    function validatePersonalData() {

        clearErrors();

        let valid = true;


        /* NAMA */

        const nama =
            getElement("nama");


        if (
            nama &&
            nama.value.trim() === ""
        ) {

            showError(
                "namaError",
                "Nama sesuai KTP wajib diisi."
            );

            valid = false;

        }


        /* NIK */

        const nik =
            getElement("nik");


        if (nik) {

            const nikValue =
                nik.value
                    .replace(/\D/g, "");


            if (
                nikValue === ""
            ) {

                showError(
                    "nikError",
                    "NIK wajib diisi."
                );

                valid = false;

            } else if (
                nikValue.length !== 16
            ) {

                showError(
                    "nikError",
                    "NIK harus terdiri dari 16 digit."
                );

                valid = false;

            }

        }


        /* NOMOR HP */

        const phone =
            getElement("phone");


        if (phone) {

            const phoneValue =
                phone.value
                    .replace(/\D/g, "");


            if (
                phoneValue === ""
            ) {

                showError(
                    "phoneError",
                    "Nomor HP wajib diisi."
                );

                valid = false;

            } else if (
                !/^08\d{8,13}$/.test(
                    phoneValue
                )
            ) {

                showError(
                    "phoneError",
                    "Nomor HP harus diawali 08."
                );

                valid = false;

            }

        }


        /* EMAIL */

        const email =
            getElement("email");


        if (email) {

            const emailValue =
                email.value.trim();


            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (
                emailValue === ""
            ) {

                showError(
                    "emailError",
                    "Email wajib diisi."
                );

                valid = false;

            } else if (
                !emailPattern.test(
                    emailValue
                )
            ) {

                showError(
                    "emailError",
                    "Format email tidak valid."
                );

                valid = false;

            }

        }


        /* KABUPATEN / KOTA */

        const kabupaten =
            getElement("kabupaten");


        if (
            kabupaten &&
            kabupaten.value === ""
        ) {

            showError(
                "kabupatenError",
                "Kabupaten/Kota wajib dipilih."
            );

            valid = false;

        }


        return valid;

    }


    /* =========================================================
       VALIDASI 7 FOTO
       ========================================================= */

    function validateUploads() {

        clearErrors();

        let valid = true;


        uploadConfig.forEach(
            function (item) {

                const input =
                    getElement(item.id);


                if (
                    !input ||
                    !input.files ||
                    input.files.length === 0
                ) {

                    showError(
                        item.error,
                        item.message
                    );

                    valid = false;

                }

            }
        );


        return valid;

    }


    /* =========================================================
       START BUTTON
       ========================================================= */

    if (startButton) {

        startButton.type =
            "button";


        startButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showStep(1);

            }
        );

    }


    /* =========================================================
       NEXT STEP 1
       ========================================================= */

    if (nextStep1) {

        nextStep1.type =
            "button";


        nextStep1.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const valid =
                    validatePersonalData();


                if (valid) {

                    showStep(2);

                }

            }
        );

    }


    /* =========================================================
       PREVIOUS STEP 2
       ========================================================= */

    if (prevStep2) {

        prevStep2.type =
            "button";


        prevStep2.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showStep(1);

            }
        );

    }


    /* =========================================================
       NEXT STEP 2
       ========================================================= */

    if (nextStep2) {

        nextStep2.type =
            "button";


        nextStep2.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const valid =
                    validateUploads();


                if (valid) {

                    createSummary();

                    showStep(3);

                }

            }
        );

    }


    /* =========================================================
       PREVIOUS STEP 3
       ========================================================= */

    if (prevStep3) {

        prevStep3.type =
            "button";


        prevStep3.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showStep(2);

            }
        );

    }


    /* =========================================================
       NIK INPUT
       ========================================================= */

    const nikInput =
        getElement("nik");


    if (nikInput) {

        nikInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .slice(0, 16);

            }
        );

    }


    /* =========================================================
       PHONE INPUT
       ========================================================= */

    const phoneInput =
        getElement("phone");


    if (phoneInput) {

        phoneInput.addEventListener(
            "input",
            function () {

                this.value =
                    this.value
                        .replace(/\D/g, "")
                        .slice(0, 15);

            }
        );

    }


    /* =========================================================
       UPLOAD BUTTON
       ========================================================= */

    getAll(".upload-button")
        .forEach(function (button) {

            button.type =
                "button";


            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const target =
                        button.dataset.target;


                    const input =
                        getElement(target);


                    if (input) {

                        input.click();

                    }

                }
            );

        });


    /* =========================================================
       FILE INPUT
       ========================================================= */

    uploadConfig.forEach(
        function (item) {

            const input =
                getElement(item.id);


            if (!input) {
                return;
            }


            input.addEventListener(
                "change",
                function () {

                    const file =
                        this.files[0];


                    if (!file) {
                        return;
                    }


                    /* CEK GAMBAR */

                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        alert(
                            "File harus berupa gambar."
                        );

                        this.value = "";

                        return;

                    }


                    /* MAKSIMAL 10 MB */

                    if (
                        file.size >
                        10 * 1024 * 1024
                    ) {

                        alert(
                            "Ukuran foto maksimal 10 MB."
                        );

                        this.value = "";

                        return;

                    }


                    /* PREVIEW */

                    createPreview(
                        this
                    );


                    /* HILANGKAN ERROR */

                    const error =
                        getElement(
                            item.error
                        );


                    if (error) {

                        error.textContent =
                            "";

                    }

                }
            );

        }
    );


    /* =========================================================
       CREATE PREVIEW
       ========================================================= */

    function createPreview(input) {

        const file =
            input.files[0];


        if (!file) {
            return;
        }


        const uploadCard =
            input.closest(
                ".upload-card"
            );


        if (!uploadCard) {
            return;
        }


        const preview =
            uploadCard.querySelector(
                ".preview"
            );


        if (!preview) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                preview.innerHTML =
                    "";


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    event.target.result;


                image.alt =
                    "Preview foto";


                preview.appendChild(
                    image
                );

            };


        reader.readAsDataURL(file);

    }


    /* =========================================================
       CREATE SUMMARY
       ========================================================= */

    function createSummary() {

        const fields = [

            {
                input: "nama",
                summary: "summaryNama"
            },

            {
                input: "nik",
                summary: "summaryNik"
            },

            {
                input: "phone",
                summary: "summaryPhone"
            },

            {
                input: "email",
                summary: "summaryEmail"
            },

            {
                input: "kabupaten",
                summary: "summaryKabupaten"
            }

        ];


        fields.forEach(
            function (item) {

                const input =
                    getElement(
                        item.input
                    );


                const summary =
                    getElement(
                        item.summary
                    );


                if (
                    input &&
                    summary
                ) {

                    if (
                        input.tagName ===
                        "SELECT"
                    ) {

                        const selected =
                            input.options[
                                input.selectedIndex
                            ];


                        summary.textContent =
                            selected
                                ? selected.text
                                : "-";

                    } else {

                        summary.textContent =
                            input.value.trim()
                            || "-";

                    }

                }

            }
        );


        /* -----------------------------------------------------
           SUMMARY DOKUMEN
           ----------------------------------------------------- */

        const summaryDocuments =
            getElement(
                "summaryDocuments"
            );


        if (
            summaryDocuments
        ) {

            summaryDocuments.innerHTML =
                "";


            uploadConfig.forEach(
                function (item) {

                    const input =
                        getElement(
                            item.id
                        );


                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "document-item";


                    let fileName =
                        "Terunggah";


                    if (
                        input &&
                        input.files &&
                        input.files.length > 0
                    ) {

                        fileName =
                            input.files[0].name;

                    }


                    div.textContent =
                        "✓ " +
                        item.label +
                        " — " +
                        fileName;


                    summaryDocuments.appendChild(
                        div
                    );

                }
            );

        }

    }


    /* =========================================================
       GENERATE REFERENCE
       ========================================================= */

    function generateReferenceNumber() {

        const date =
            new Date();


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                date.getDate()
            ).padStart(2, "0");


        const hour =
            String(
                date.getHours()
            ).padStart(2, "0");


        const minute =
            String(
                date.getMinutes()
            ).padStart(2, "0");


        const second =
            String(
                date.getSeconds()
            ).padStart(2, "0");


        const random =
            Math.floor(
                100 + Math.random() * 900
            );


        return (
            "SD-" +
            year +
            month +
            day +
            "-" +
            hour +
            minute +
            second +
            "-" +
            random
        );

    }


    /* =========================================================
       KOMPRES FOTO
       ========================================================= */

    function compressImage(file) {

        return new Promise(
            function (resolve, reject) {

                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        const image =
                            new Image();


                        image.onload =
                            function () {

                                let width =
                                    image.width;

                                let height =
                                    image.height;


                                /* ---------------------------------
                                   RESIZE
                                   --------------------------------- */

                                if (
                                    width >
                                        MAX_IMAGE_SIZE ||
                                    height >
                                        MAX_IMAGE_SIZE
                                ) {

                                    if (
                                        width >
                                        height
                                    ) {

                                        height =
                                            Math.round(
                                                height *
                                                (
                                                    MAX_IMAGE_SIZE /
                                                    width
                                                )
                                            );

                                        width =
                                            MAX_IMAGE_SIZE;

                                    } else {

                                        width =
                                            Math.round(
                                                width *
                                                (
                                                    MAX_IMAGE_SIZE /
                                                    height
                                                )
                                            );

                                        height =
                                            MAX_IMAGE_SIZE;

                                    }

                                }


                                /* ---------------------------------
                                   CANVAS
                                   --------------------------------- */

                                const canvas =
                                    document.createElement(
                                        "canvas"
                                    );


                                canvas.width =
                                    width;


                                canvas.height =
                                    height;


                                const context =
                                    canvas.getContext(
                                        "2d"
                                    );


                                context.drawImage(
                                    image,
                                    0,
                                    0,
                                    width,
                                    height
                                );


                                /* ---------------------------------
                                   JPEG
                                   --------------------------------- */

                                canvas.toBlob(
                                    function (blob) {

                                        if (!blob) {

                                            reject(
                                                new Error(
                                                    "Gagal mengompres foto."
                                                )
                                            );

                                            return;

                                        }


                                        const blobReader =
                                            new FileReader();


                                        blobReader.onload =
                                            function () {

                                                resolve(
                                                    blobReader.result
                                                );

                                            };


                                        blobReader.onerror =
                                            function () {

                                                reject(
                                                    new Error(
                                                        "Gagal membaca foto."
                                                    )
                                                );

                                            };


                                        blobReader.readAsDataURL(
                                            blob
                                        );

                                    },
                                    "image/jpeg",
                                    JPEG_QUALITY
                                );

                            };


                        image.onerror =
                            function () {

                                reject(
                                    new Error(
                                        "Foto tidak dapat diproses."
                                    )
                                );

                            };


                        image.src =
                            event.target.result;

                    };


                reader.onerror =
                    function () {

                        reject(
                            new Error(
                                "Gagal membaca file."
                            )
                        );

                    };


                reader.readAsDataURL(
                    file
                );

            }
        );

    }


    /* =========================================================
       UPLOAD SATU FOTO
       ========================================================= */

    async function uploadSingleImage(
        referenceNumber,
        item
    ) {

        const input =
            getElement(item.id);


        if (
            !input ||
            !input.files ||
            input.files.length === 0
        ) {

            throw new Error(
                item.label +
                " belum dipilih."
            );

        }


        const file =
            input.files[0];


        /* -----------------------------------------------------
           KOMPRES
           ----------------------------------------------------- */

        const compressedImage =
            await compressImage(file);


        /* -----------------------------------------------------
           DATA
           ----------------------------------------------------- */

        const payload = {

            action: "uploadImage",

            referenceNumber:
                referenceNumber,

            field:
                item.field,

            image:
                compressedImage

        };


        /* -----------------------------------------------------
           KIRIM KE APPS SCRIPT
           ----------------------------------------------------- */

        await fetch(
            API_URL,
            {

                method: "POST",

                mode: "no-cors",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(
                        payload
                    )

            }
        );


        /*
           Karena Apps Script Web App
           digunakan lintas domain,
           mode no-cors digunakan.

           Browser tidak dapat membaca response,
           tetapi request tetap dikirim.
        */


        return true;

    }


    /* =========================================================
       UPLOAD 7 FOTO SATU PER SATU
       ========================================================= */

    async function uploadAllImages(
        referenceNumber
    ) {

        for (
            let i = 0;
            i < uploadConfig.length;
            i++
        ) {

            const item =
                uploadConfig[i];


            updateUploadProgress(
                i + 1,
                uploadConfig.length,
                item.label
            );


            await uploadSingleImage(
                referenceNumber,
                item
            );


            /*
               Jeda kecil agar iPhone tidak
               terlalu cepat memproses request
               berikutnya.
            */

            await sleep(250);

        }

    }


    /* =========================================================
       UPDATE PROGRESS
       ========================================================= */

    function updateUploadProgress(
        current,
        total,
        label
    ) {

        const percentage =
            Math.round(
                (
                    (current - 1) /
                    total
                ) * 100
            );


        if (submitButton) {

            submitButton.textContent =
                "Mengunggah " +
                current +
                "/" +
                total +
                " (" +
                percentage +
                "%)";

        }


        console.log(
            "Upload " +
            current +
            "/" +
            total +
            ": " +
            label
        );

    }


    /* =========================================================
       SIMPAN DATA PESERTA
       ========================================================= */

    async function saveParticipant(
        referenceNumber
    ) {

        const nama =
            getElement("nama");


        const nik =
            getElement("nik");


        const phone =
            getElement("phone");


        const email =
            getElement("email");


        const kabupaten =
            getElement("kabupaten");


        const payload = {

            action:
                "saveParticipant",

            referenceNumber:
                referenceNumber,

            name:
                nama
                    ? nama.value.trim()
                    : "",

            nik:
                nik
                    ? nik.value
                        .replace(/\D/g, "")
                    : "",

            phone:
                phone
                    ? phone.value
                        .replace(/\D/g, "")
                    : "",

            email:
                email
                    ? email.value.trim()
                    : "",

            regency:
                kabupaten
                    ? kabupaten.value
                    : ""

        };


        await fetch(
            API_URL,
            {

                method: "POST",

                mode: "no-cors",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(
                        payload
                    )

            }
        );


        return true;

    }


    /* =========================================================
       SLEEP
       ========================================================= */

    function sleep(
        milliseconds
    ) {

        return new Promise(
            function (resolve) {

                setTimeout(
                    resolve,
                    milliseconds
                );

            }
        );

    }


    /* =========================================================
       SUBMIT FORM
       ========================================================= */

    if (participantForm) {

        participantForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                /* ------------------------------------------------
                   HARUS STEP 3
                   ------------------------------------------------ */

                if (
                    currentStep !== 3
                ) {

                    return;

                }


                /* ------------------------------------------------
                   CEK API URL
                   ------------------------------------------------ */

                if (
                    !API_URL ||
                    API_URL ===
                    "MASUKKAN_URL_WEB_APP_DI_SINI"
                ) {

                    alert(
                        "URL Google Apps Script belum dimasukkan."
                    );

                    return;

                }


                /* ------------------------------------------------
                   CEK PERSETUJUAN
                   ------------------------------------------------ */

                if (
                    agreement &&
                    !agreement.checked
                ) {

                    showError(
                        "agreementError",
                        "Silakan centang persetujuan terlebih dahulu."
                    );

                    return;

                }


                /* ------------------------------------------------
                   CEK DATA DIRI
                   ------------------------------------------------ */

                if (
                    !validatePersonalData()
                ) {

                    showStep(1);

                    return;

                }


                /* ------------------------------------------------
                   CEK FOTO
                   ------------------------------------------------ */

                if (
                    !validateUploads()
                ) {

                    showStep(2);

                    return;

                }


                clearErrors();


                /* ------------------------------------------------
                   BUTTON
                   ------------------------------------------------ */

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Menyiapkan...";

                }


                try {

                    /* --------------------------------------------
                       GENERATE REFERENCE
                       -------------------------------------------- */

                    const reference =
                        generateReferenceNumber();


                    const referenceElement =
                        getElement(
                            "referenceNumber"
                        );


                    if (
                        referenceElement
                    ) {

                        referenceElement.textContent =
                            reference;

                    }


                    /* --------------------------------------------
                       UPLOAD 7 FOTO
                       -------------------------------------------- */

                    await uploadAllImages(
                        reference
                    );


                    /* --------------------------------------------
                       SIMPAN DATA PESERTA
                       -------------------------------------------- */

                    if (submitButton) {

                        submitButton.textContent =
                            "Menyimpan data...";

                    }


                    await sleep(500);


                    await saveParticipant(
                        reference
                    );


                    /* --------------------------------------------
                       BERHASIL
                       -------------------------------------------- */

                    if (participantForm) {

                        participantForm.style.display =
                            "none";

                    }


                    const stepper =
                        document.querySelector(
                            ".stepper"
                        );


                    if (stepper) {

                        stepper.style.display =
                            "none";

                    }


                    const successSection =
                        getElement(
                            "successSection"
                        );


                    if (
                        successSection
                    ) {

                        successSection.style.display =
                            "block";


                        successSection.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Kirim Data";

                    }


                } catch (error) {

                    console.error(
                        "ERROR:",
                        error
                    );


                    alert(
                        "Data belum berhasil dikirim.\n\n" +
                        "Silakan coba lagi.\n\n" +
                        "Detail: " +
                        error.message
                    );


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Kirim Data";

                    }

                }

            }
        );

    }


    /* =========================================================
       NEW PARTICIPANT
       ========================================================= */

    if (newParticipant) {

        newParticipant.type =
            "button";


        newParticipant.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                /* RESET FORM */

                if (participantForm) {

                    participantForm.reset();

                }


                /* RESET ERROR */

                clearErrors();


                /* RESET PREVIEW */

                uploadConfig.forEach(
                    function (item) {

                        const input =
                            getElement(
                                item.id
                            );


                        if (input) {

                            input.value =
                                "";

                        }


                        const card =
                            input?.closest(
                                ".upload-card"
                            );


                        const preview =
                            card?.querySelector(
                                ".preview"
                            );


                        if (preview) {

                            preview.innerHTML =
                                "";

                        }

                    }
                );


                /* TAMPILKAN FORM */

                if (participantForm) {

                    participantForm.style.display =
                        "block";

                }


                const stepper =
                    document.querySelector(
                        ".stepper"
                    );


                if (stepper) {

                    stepper.style.display =
                        "flex";

                }


                const successSection =
                    getElement(
                        "successSection"
                    );


                if (
                    successSection
                ) {

                    successSection.style.display =
                        "none";

                }


                /* RESET BUTTON */

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Kirim Data";

                }


                /* KEMBALI STEP 1 */

                showStep(1);


                /* SCROLL */

                if (formSection) {

                    formSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    }


    /* =========================================================
       AGREEMENT
       ========================================================= */

    if (agreement) {

        agreement.addEventListener(
            "change",
            function () {

                if (
                    this.checked
                ) {

                    showError(
                        "agreementError",
                        ""
                    );

                }

            }
        );

    }


    /* =========================================================
       INITIAL
       ========================================================= */

    showStep(1);


    console.log(
        "Sanak Digital JS berhasil dijalankan."
    );

});
