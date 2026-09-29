document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    /* =========================================================
       KONFIGURASI GOOGLE APPS SCRIPT
    ========================================================= */

    const API_URL =
        "https://script.google.com/macros/s/AKfycbwjpw-iAGPVjeBgJFMX0QgSBwB4U7y68WmATkwB1hcnxPlFuNDJWNGMe2TSnq6omgyz/exec";


    /* =========================================================
       HELPER
    ========================================================= */

    function getElement(id) {
        return document.getElementById(id);
    }

    function getAll(selector) {
        return document.querySelectorAll(selector);
    }


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


    let currentStep = 1;


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
                    number === stepNumber
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
       ERROR
    ========================================================= */

    function clearErrors() {

        getAll(".error").forEach(
            function (error) {

                error.textContent = "";

            }
        );

    }


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


        /* PHONE */

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


        /* KABUPATEN */

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
       7 FOTO
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


    const uploadMessages = {

        selfie:
            "Foto selfie wajib diunggah.",

        accountProof:
            "Foto bukti kepemilikan akun wajib diunggah.",

        newAccount:
            "Foto bukti akun baru wajib diunggah.",

        qrisProof:
            "Foto bukti transaksi QRIS Rp1 wajib diunggah.",

        qrisEducation:
            "Foto edukasi QRIS wajib diunggah.",

        postTest:
            "Foto pengerjaan post test wajib diunggah.",

        postTestProof:
            "Foto selesai pengerjaan post test wajib diunggah."

    };


    function validateUploads() {

        clearErrors();

        let valid = true;


        uploadInputs.forEach(
            function (id) {

                const input =
                    getElement(id);

                const error =
                    getElement(
                        id + "Error"
                    );


                if (
                    !input ||
                    !input.files ||
                    input.files.length === 0
                ) {

                    if (error) {

                        error.textContent =
                            uploadMessages[id];

                    }

                    valid = false;

                }

            }
        );


        return valid;

    }


    /* =========================================================
       UPLOAD BUTTON
    ========================================================= */

    getAll(".upload-button")
        .forEach(function (button) {

            button.type = "button";

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


                    /* BATAS FILE */

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


                    createPreview(this);


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
       PREVIEW
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
       SUMMARY
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


        const summaryDocuments =
            getElement(
                "summaryDocuments"
            );


        if (
            summaryDocuments
        ) {

            summaryDocuments.innerHTML =
                "";


            const documents = [

                {
                    id: "selfie",
                    name: "Foto Selfie"
                },

                {
                    id: "accountProof",
                    name: "Bukti Kepemilikan Akun"
                },

                {
                    id: "newAccount",
                    name: "Akun Baru Dibuat"
                },

                {
                    id: "qrisProof",
                    name: "Transaksi QRIS Rp1"
                },

                {
                    id: "qrisEducation",
                    name: "Edukasi QRIS"
                },

                {
                    id: "postTest",
                    name: "Pengerjaan Post Test"
                },

                {
                    id: "postTestProof",
                    name: "Selesai Pengerjaan Post Test"
                }

            ];


            documents.forEach(
                function (documentItem) {

                    const input =
                        getElement(
                            documentItem.id
                        );


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "document-item";


                    item.textContent =
                        "✓ " +
                        documentItem.name +
                        " — " +
                        (
                            input &&
                            input.files.length > 0
                                ? input.files[0].name
                                : "Terunggah"
                        );


                    summaryDocuments.appendChild(
                        item
                    );

                }
            );

        }

    }


    /* =========================================================
       FILE → BASE64
    ========================================================= */

    function fileToBase64(file) {

        return new Promise(
            function (resolve, reject) {

                const reader =
                    new FileReader();


                reader.onload =
                    function () {

                        resolve(
                            reader.result
                        );

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
       AMBIL SEMUA FOTO
    ========================================================= */

    async function collectImages() {

        const images = {};


        for (
            const id of uploadInputs
        ) {

            const input =
                getElement(id);

            if (
                !input ||
                !input.files ||
                input.files.length === 0
            ) {

                throw new Error(
                    "Foto " +
                    id +
                    " belum diunggah."
                );

            }


            images[id] =
                await fileToBase64(
                    input.files[0]
                );

        }


        return images;

    }


    /* =========================================================
       NEXT STEP 1
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


    if (nextStep1) {

        nextStep1.type =
            "button";

        nextStep1.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                if (
                    validatePersonalData()
                ) {

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

                if (
                    validateUploads()
                ) {

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
       NIK
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
       PHONE
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
       SUBMIT KE GOOGLE APPS SCRIPT
    ========================================================= */

    if (participantForm) {

        participantForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                if (
                    currentStep !== 3
                ) {

                    return;

                }


                /* CEK PERSETUJUAN */

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


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Mengirim data...";

                }


                try {

                    /* AMBIL DATA */

                    const nama =
                        getElement(
                            "nama"
                        )?.value.trim() || "";

                    const nik =
                        getElement(
                            "nik"
                        )?.value.trim() || "";

                    const phone =
                        getElement(
                            "phone"
                        )?.value.trim() || "";

                    const email =
                        getElement(
                            "email"
                        )?.value.trim() || "";

                    const kabupaten =
                        getElement(
                            "kabupaten"
                        )?.value || "";


                    /* AMBIL 7 FOTO */

                    const images =
                        await collectImages();


                    /* DATA YANG DIKIRIM */

                    const payload = {

                        name: nama,

                        nik: nik,

                        phone: phone,

                        email: email,

                        regency: kabupaten,

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


                    /* KIRIM KE APPS SCRIPT */

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


                    /* NOMOR REFERENSI */

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


                    /* SEMBUNYIKAN FORM */

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


                    /* TAMPILKAN SUCCESS */

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


                } catch (error) {

                    console.error(
                        error
                    );


                    alert(
                        "Data gagal dikirim. Silakan coba lagi."
                    );

                } finally {

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
       NEW PARTICIPANT
    ========================================================= */

    if (newParticipant) {

        newParticipant.type =
            "button";


        newParticipant.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                if (
                    participantForm
                ) {

                    participantForm.reset();

                }


                clearErrors();


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


                showStep(1);

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
        "Petualangan Sanak Digital berhasil dijalankan."
    );

});