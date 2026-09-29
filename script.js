document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================================================
       SANAK DIGITAL
       PETUALANGAN SANAK DIGITAL
       BANK INDONESIA PROVINSI RIAU
       ========================================================= */


    /* =========================================================
       GOOGLE APPS SCRIPT API
       ========================================================= */

    const API_URL =
        "https://script.google.com/macros/s/AKfycbwjpw-iAGPVjeBgJFMX0QgSBwB4U7y68WmATkwB1hcnxPlFuNDJWNGMe2TSnq6omgyz/exec";


    /* =========================================================
       PENGATURAN KOMPRESI FOTO
       ========================================================= */

    const MAX_FILE_SIZE =
        10 * 1024 * 1024; // 10 MB

    const MAX_IMAGE_SIZE =
        1600; // maksimal lebar / tinggi

    const JPEG_QUALITY =
        0.75; // kualitas 75%


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
       7 FILE UPLOAD
       ========================================================= */

    const uploadInputs = [

        "selfie",

        "accountProof",

        "newAccount",

        "qrisProof",

        "qrisEducation",

        "postTest",

        "postTestProof"

    ];


    /* =========================================================
       NAMA DOKUMEN
       ========================================================= */

    const documentNames = {

        selfie:
            "Foto Selfie",

        accountProof:
            "Bukti Kepemilikan Akun",

        newAccount:
            "Akun Baru Dibuat",

        qrisProof:
            "Transaksi QRIS Rp1",

        qrisEducation:
            "Edukasi QRIS",

        postTest:
            "Pengerjaan Post Test",

        postTestProof:
            "Selesai Pengerjaan Post Test"

    };


    /* =========================================================
       SHOW STEP
       ========================================================= */

    function showStep(stepNumber) {

        currentStep =
            stepNumber;


        const steps =
            getAll(".form-step");


        const indicators =
            getAll(".step");


        steps.forEach(function (step) {

            step.classList.remove(
                "active"
            );


            if (
                step.id ===
                "step" + stepNumber ||

                step.dataset.step ===
                String(stepNumber)
            ) {

                step.classList.add(
                    "active"
                );

            }

        });


        indicators.forEach(
            function (step, index) {

                const number =
                    index + 1;


                step.classList.remove(
                    "active"
                );


                if (
                    number ===
                    stepNumber
                ) {

                    step.classList.add(
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

        getAll(".error")
            .forEach(function (error) {

                error.textContent =
                    "";

            });

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
       VALIDASI DATA PRIBADI
       ========================================================= */

    function validatePersonalData() {

        clearErrors();

        let valid = true;


        /* =====================================================
           NAMA
        ===================================================== */

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


        /* =====================================================
           NIK
        ===================================================== */

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

            }

            else if (
                nikValue.length !== 16
            ) {

                showError(
                    "nikError",
                    "NIK harus terdiri dari 16 digit."
                );

                valid = false;

            }

        }


        /* =====================================================
           NOMOR HP
        ===================================================== */

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

            }

            else if (
                !/^08\d{8,13}$/
                    .test(phoneValue)
            ) {

                showError(
                    "phoneError",
                    "Nomor HP harus diawali 08."
                );

                valid = false;

            }

        }


        /* =====================================================
           EMAIL
        ===================================================== */

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

            }

            else if (
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


        /* =====================================================
           KABUPATEN / KOTA
        ===================================================== */

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


        const uploads = [

            {
                id: "selfie",
                error: "selfieError",
                message:
                    "Foto selfie wajib diunggah."
            },

            {
                id: "accountProof",
                error:
                    "accountProofError",
                message:
                    "Foto bukti kepemilikan akun wajib diunggah."
            },

            {
                id: "newAccount",
                error:
                    "newAccountError",
                message:
                    "Foto bukti akun baru wajib diunggah."
            },

            {
                id: "qrisProof",
                error:
                    "qrisProofError",
                message:
                    "Foto bukti transaksi QRIS Rp1 wajib diunggah."
            },

            {
                id: "qrisEducation",
                error:
                    "qrisEducationError",
                message:
                    "Foto edukasi QRIS wajib diunggah."
            },

            {
                id: "postTest",
                error:
                    "postTestError",
                message:
                    "Foto pengerjaan post test wajib diunggah."
            },

            {
                id: "postTestProof",
                error:
                    "postTestProofError",
                message:
                    "Foto selesai pengerjaan post test wajib diunggah."
            }

        ];


        uploads.forEach(
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
       FILE UPLOAD
       ========================================================= */

    uploadInputs.forEach(
        function (id) {

            const input =
                getElement(id);


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


                    /* VALIDASI TIPE */

                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {

                        alert(
                            "File harus berupa gambar."
                        );

                        this.value =
                            "";

                        return;

                    }


                    /* VALIDASI UKURAN */

                    if (
                        file.size >
                        MAX_FILE_SIZE
                    ) {

                        alert(
                            "Ukuran foto maksimal 10 MB."
                        );

                        this.value =
                            "";

                        return;

                    }


                    /* PREVIEW */

                    createPreview(
                        this
                    );


                    /* HILANGKAN ERROR */

                    const error =
                        getElement(
                            id + "Error"
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
       PREVIEW FOTO
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


        reader.readAsDataURL(
            file
        );

    }


    /* =========================================================
       COMPRESS FOTO
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


                                /* =====================
                                   RESIZE PROPORSIONAL
                                ===================== */

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
                                                MAX_IMAGE_SIZE /
                                                width
                                            );

                                        width =
                                            MAX_IMAGE_SIZE;

                                    }

                                    else {

                                        width =
                                            Math.round(
                                                width *
                                                MAX_IMAGE_SIZE /
                                                height
                                            );

                                        height =
                                            MAX_IMAGE_SIZE;

                                    }

                                }


                                /* =====================
                                   CANVAS
                                ===================== */

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


                                /* =====================
                                   JPEG COMPRESS
                                ===================== */

                                const compressed =
                                    canvas.toDataURL(
                                        "image/jpeg",
                                        JPEG_QUALITY
                                    );


                                resolve(
                                    compressed
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
                                "Foto gagal dibaca."
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
                summary:
                    "summaryKabupaten"
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

                    }

                    else {

                        summary.textContent =
                            input.value.trim()
                            || "-";

                    }

                }

            }
        );


        /* =====================================================
           SUMMARY DOKUMEN
        ===================================================== */

        const summaryDocuments =
            getElement(
                "summaryDocuments"
            );


        if (
            summaryDocuments
        ) {

            summaryDocuments.innerHTML =
                "";


            uploadInputs.forEach(
                function (id) {

                    const input =
                        getElement(id);


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "document-item";


                    const fileName =
                        input &&
                        input.files &&
                        input.files.length > 0
                            ? input.files[0].name
                            : "Terunggah";


                    item.textContent =
                        "✓ " +
                        documentNames[id] +
                        " — " +
                        fileName;


                    summaryDocuments
                        .appendChild(
                            item
                        );

                }
            );

        }

    }


    /* =========================================================
       KUMPULKAN DAN KOMPRES 7 FOTO
       ========================================================= */

    async function collectCompressedImages() {

        const images = {};


        for (
            let i = 0;
            i < uploadInputs.length;
            i++
        ) {

            const id =
                uploadInputs[i];


            const input =
                getElement(id);


            if (
                !input ||
                !input.files ||
                !input.files[0]
            ) {

                throw new Error(
                    "Foto " +
                    documentNames[id] +
                    " belum dipilih."
                );

            }


            /* UPDATE STATUS */

            updateSubmitStatus(
                "Memproses foto " +
                (i + 1) +
                " dari " +
                uploadInputs.length +
                "..."
            );


            /* COMPRESS */

            const compressed =
                await compressImage(
                    input.files[0]
                );


            images[id] =
                compressed;


            /* UPDATE STATUS */

            updateSubmitStatus(
                "Foto " +
                (i + 1) +
                " dari " +
                uploadInputs.length +
                " siap."
            );

        }


        return images;

    }


    /* =========================================================
       UPDATE STATUS TOMBOL
       ========================================================= */

    function updateSubmitStatus(
        message
    ) {

        if (submitButton) {

            submitButton.textContent =
                message;

        }

    }


    /* =========================================================
       SUBMIT FORM
       ========================================================= */

    if (participantForm) {

        participantForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                /* =================================================
                   PASTIKAN STEP 3
                ================================================= */

                if (
                    currentStep !== 3
                ) {

                    return;

                }


                /* =================================================
                   CEK PERSETUJUAN
                ================================================= */

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


                clearErrors();


                /* =================================================
                   CEK API URL
                ================================================= */

                if (
                    !API_URL ||
                    API_URL.includes(
                        "MASUKKAN_URL"
                    )
                ) {

                    alert(
                        "URL Google Apps Script belum dimasukkan ke script.js."
                    );

                    return;

                }


                /* =================================================
                   DISABLE BUTTON
                ================================================= */

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Menyiapkan data...";

                }


                try {

                    /* =============================================
                       AMBIL DATA PESERTA
                    ============================================= */

                    const nama =
                        getElement(
                            "nama"
                        ).value.trim();


                    const nik =
                        getElement(
                            "nik"
                        ).value.trim();


                    const phone =
                        getElement(
                            "phone"
                        ).value.trim();


                    const email =
                        getElement(
                            "email"
                        ).value.trim();


                    const kabupaten =
                        getElement(
                            "kabupaten"
                        ).value;


                    /* =============================================
                       KOMPRES 7 FOTO
                    ============================================= */

                    const images =
                        await collectCompressedImages();


                    /* =============================================
                       NOMOR REFERENSI SEMENTARA
                    ============================================= */

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


                    /* =============================================
                       PAYLOAD
                    ============================================= */

                    const payload = {

                        name:
                            nama,

                        nik:
                            nik,

                        phone:
                            phone,

                        email:
                            email,

                        regency:
                            kabupaten,

                        selfie:
                            images.selfie,

                        accountProof:
                            images.accountProof,

                        newAccount:
                            images.newAccount,

                        qrisProof:
                            images.qrisProof,

                        qrisEducation:
                            images.qrisEducation,

                        postTest:
                            images.postTest,

                        postTestProof:
                            images.postTestProof

                    };


                    /* =============================================
                       KIRIM KE APPS SCRIPT
                    ============================================= */

                    updateSubmitStatus(
                        "Mengirim data..."
                    );


                    await fetch(
                        API_URL,
                        {
                            method:
                                "POST",

                            mode:
                                "no-cors",

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


                    /* =============================================
                       BERHASIL DIKIRIM
                       
                       no-cors membuat browser tidak dapat
                       membaca response Apps Script.
                    ============================================= */

                    updateSubmitStatus(
                        "Data terkirim..."
                    );


                    await delay(
                        800
                    );


                    /* =============================================
                       TAMPILKAN SUCCESS
                    ============================================= */

                    if (
                        participantForm
                    ) {

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
                            behavior:
                                "smooth",

                            block:
                                "start"
                        });

                    }


                } catch (error) {

                    console.error(
                        "ERROR:",
                        error
                    );


                    alert(
                        "Data gagal dikirim.\n\n" +
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
       DELAY
       ========================================================= */

    function delay(
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
       NOMOR REFERENSI
       ========================================================= */

    function generateReferenceNumber() {

        const date =
            new Date();


        const year =
            date.getFullYear();


        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );


        const random =
            Math.floor(
                1000 +
                Math.random() * 9000
            );


        return (
            "SD-" +
            year +
            month +
            day +
            "-" +
            random
        );

    }


    /* =========================================================
       PESERTA BARU
       ========================================================= */

    if (newParticipant) {

        newParticipant.type =
            "button";


        newParticipant.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                /* RESET FORM */

                if (
                    participantForm
                ) {

                    participantForm.reset();

                }


                /* RESET ERROR */

                clearErrors();


                /* RESET PREVIEW */

                uploadInputs.forEach(
                    function (id) {

                        const input =
                            getElement(id);


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


                /* RESET SUCCESS */

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


                /* TAMPILKAN FORM */

                if (
                    participantForm
                ) {

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


                /* STEP 1 */

                showStep(1);


                /* SCROLL */

                if (
                    formSection
                ) {

                    formSection.scrollIntoView({
                        behavior:
                            "smooth",

                        block:
                            "start"
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
