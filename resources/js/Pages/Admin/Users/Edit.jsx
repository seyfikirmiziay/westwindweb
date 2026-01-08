import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import BahnCard from "@/Components/BahnCard";
import Select from "react-select";
import UserCertificate from "@/Components/UserCertificate";
import UserAgreement from "@/Components/UserAgreement";
import UserProgram from "@/Components/UserProgram";
import GehaltsBerichte from "@/Components/GehaltsBerichte";
import {
    Datepicker,
    ToggleSwitch,
    Tabs,
    Modal,
    Button,
    Label,
} from "flowbite-react";
import Swal from "sweetalert2";
import axios from "axios";
import moment from "moment";
import CreatableSelect from "react-select/creatable";
import {
    HiAdjustments,
    HiClipboardList,
    HiUserCircle,
    HiShieldCheck,
    HiCreditCard,
    HiDocumentReport
} from "react-icons/hi";
import { MdDashboard, MdOutlineWorkOutline } from "react-icons/md";



export default function EditUser({ auth, user_id }) {
    const [user, setUser] = useState(null);
    const [userBahnCard, setUserBahnCard] = useState([]);

    const [userProfessions, setUserProfessions] = useState([]);

    const [professions, setProfessions] = useState([]);
    const [advances, setAdvances] = useState([]);
    const [bonus, setBonus] = useState([]);
    const [openBonusModal, setOpenBonusModal] = useState(false);
    const [openAdvancesModal, setOpenAdvancesModal] = useState(false);
    const [hourBanks, setHourBanks] = useState([]);
    const [openHourBanksModal, setOpenHourBanksModal] = useState(false);
    const [aggreements, setAggreements] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [userCertificates, setUserCertificates] = useState([]);
    const [userAgreements, setUserAgreements] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [userPrograms, setUserPrograms] = useState([]);
    const [clients, setClients] = useState([]);
    const [userClients, setUserClients] = useState([]);


    const [alertCertificates, setAlertCertificates] = useState(0);

    useEffect(() => {
        const certificatesNew = async()=> {
            let count = 0;
            for(const certificate of certificates){
             if(certificate.required){
                const userCertificate = userCertificates.find(userCertificate => userCertificate.certificate_id === certificate.id);
                if(!userCertificate){
                    count++;
                } else {
                    if(moment(userCertificate.validity_date).subtract(userCertificate.reminder_day, 'days') <= moment()){
                        count++;
                    }
                }
             }
            }
            setAlertCertificates(count);
        }
        certificatesNew();

    }, [userCertificates]);

    const [newHourBank, setNewHourBank] = useState({
        date: new Date(),
        hours: "",
        type: "",
    });
    const hourBankValidationSchema = yup.object().shape({
        hours: yup.number().required(),
        type: yup.mixed().oneOf(["deposit", "withdraw"]).required(),
        date: yup.date().required(),
    });

    const [newBonus, setNewBonus] = useState({
        transaction_date: new Date(),
        amount: "",
    });
    const [newAdvances, setNewAdvances] = useState({
        transaction_date: new Date(),
        amount: "",
    });

    const getUserBahnCards = () => {
        axios.get(route("bahn-cards-show-user", user_id)).then((res) => {
            setUserBahnCard(res.data.data[0]);
        });
    };

    const getBonus = () => {
        axios.get(route("get-user-bonus", user_id)).then((res) => {
            setBonus(res.data);
        });
    };

    const deleteBonus = (bonus_id) => {
        axios.delete(route("delete-bonus", bonus_id)).then((res) => {
            getBonus();
            setBonus(bonus.filter((item) => item.id !== bonus_id));
        });
    };
    const addNewBonus = () => {
        axios.post(route("add-bonus", user_id), newBonus).then((res) => {
            getBonus();
            setOpenBonusModal(false);
        });
    };

    const getAdvances = () => {
        axios.get(route("get-user-advances", user_id)).then((res) => {
            setAdvances(res.data);
        });
    };

    const deleteAdvances = (advances_id) => {
        axios.delete(route("delete-advances", advances_id)).then((res) => {
            getAdvances();
            setAdvances(advances.filter((item) => item.id !== advances_id));
        });
    };
    const addNewAdvances = () => {
        axios.post(route("add-advances", user_id), newAdvances).then((res) => {
            getAdvances();
            setOpenAdvancesModal(false);
        });
    };

    const getAggreements = () => {
        axios.get(route("aggreements")).then((res) => {
            setAggreements(res.data);
        });
    };

    const getCertificates = () => {
        axios.get(route("certificates-get")).then((res) => {
            setCertificates(res.data);
        });
    };

    const getUserCertificates = () => {
        axios.get(route("get-user-certificates", user_id)).then((res) => {
            setUserCertificates(res.data);
        });
    };

    const getHourBanks = () => {
        axios.get(route("get-user-hour-banks", user_id)).then((res) => {
            let hourBanksUnsorted = res.data;
            if (hourBanksUnsorted.length > 0) {
                let hourBanksSorted = hourBanksUnsorted.sort((a, b) => {
                    return a.date.localeCompare(b.date);
                });
                setHourBanks(hourBanksSorted);
            }
        });
    };

    const deleteHourBank = (hourBank) => {
        axios.delete(route("delete-hour-bank", hourBank.id)).then((res) => {
            getHourBanks();
            setHourBanks(hourBanks.filter((item) => item.id !== hourBank.id));
        });
    };

    const getPrograms = () => {
        axios.get(route("programs")).then((res) => {
            setPrograms(res.data);
        });
    };

    const getUserPrograms = () => {
        axios.get(route("user.programs", user_id)).then((res) => {
            setUserPrograms(res.data);
        });
    };
/*
    const validationSchema = yup.object().shape({
        driver_id: yup.string().required(),
        name: yup.string().required(),
        birth_date: yup.date().required(),
        identity_number: yup.string().required(),
        phone: yup.string().required(),
        email: yup.string().email().required(),
        bank_iban: yup
            .string()
            .required("IBAN gerekli")
    });
*/
    const getProfessions = () => {
        axios
            .get(route("professions"))
            .then((res) => {
                setProfessions([
                    ...res.data.map((profession) => ({
                        label: profession.name,
                        value: profession.id,
                    })),
                ]);
                return [...res.data];
            })
            .then((old_resp) => {
                axios
                    .get(route("get-user-professions", user_id))
                    .then(async (res) => {
                        let userProfessions = res.data;
                        let selectedProfessions = [];
                        for (const userProfession of userProfessions) {
                            let profession = old_resp.find(
                                (profession) =>
                                    profession.id ===
                                    userProfession.profession_id
                            );

                            selectedProfessions.push({
                                label: profession.name,
                                value: profession.id,
                            });
                        }
                        setUserProfessions(selectedProfessions);
                    });
            });
    };



    const getClients = () => {
        axios
            .get(route("admin-clients"))
            .then((res) => {
                setClients([
                    ...res.data.map((client) => ({
                        label: client.name,
                        value: client.id,
                    })),
                ]);
                return [...res.data];
            })
            .then((old_resp) => {
                axios
                    .get(route("get-user-clients", user_id))
                    .then(async (res) => {
                        let userClients = res.data;
                        let selectedClients = [];
                        for (const userClient of userClients) {
                            let client = old_resp.find(
                                (client) =>
                                    client.id ===
                                    userClient.client_id
                            );

                            selectedClients.push({
                                label: client.name,
                                value: client.id,
                            });
                        }
                        setUserClients(selectedClients);
                    });
            });
    }

    const getUserClients = () => {
        axios.get(route("get-user-clients", user_id)).then((res) => {
            let userClients = res.data;
            let selectedClients = [];
            for (const userClient of userClients) {
                let client = clients.find(client => client.value === userClient.client_id);
                selectedClients.push({
                    label: client.name,
                    value: client.id,
                });
            }
            setUserClients(selectedClients);

        });
    }

    const handleCreateProfession = (value) => {
        axios.post(route("professions-store"), { name: value }).then((res) => {
            let profession_id = res.data.id;
            axios
                .post(route("add-user-profession", user_id), {
                    profession_id: profession_id,
                })
                .then((res) => {
                    getProfessions();
                });
        });
    };

    const handleSelectProfession = async (selected, process) => {
        if (process.action === "select-option") {
            let profession_id = process.option.value;
            axios
                .post(route("add-user-profession", user_id), {
                    profession_id: profession_id,
                })
                .then((res) => {
                    setUserClients();
                });
        } else if (process.action === "remove-value") {
            let profession_id = process.removedValue.value;
            axios
                .delete(
                    route("delete-user-professions", {
                        user_id: user_id,
                        profession_id: profession_id,
                    })
                )
                .then((res) => {
                    setUserClients();
                });
        }
    };

    const handleCreateClient = (value) => {
        axios.post(route("add-user-clients", user_id), { name: value }).then((res) => {
            let client_id = res.data.id;
            axios
                .post(route("add-user-clients", user_id), {
                    client_id: client_id,
                })
                .then((res) => {
                    getClients();
                });
        });
    };

    const handleSelectClient = async (selected, process) => {
        if (process.action === "select-option") {
            let client_id = process.option.value;
            axios
                .post(route("add-user-clients", user_id), {
                    client_id: client_id,
                })
                .then((res) => {
                    getClients();
                });
        } else if (process.action === "remove-value") {
            let client_id = process.removedValue.value;
            axios
                .delete(route("delete-user-clients", {
                    user_id: user_id,
                    client_id: client_id,
                }))
                .then((res) => {
                    getClients();

                });
        }
    };


    useEffect(() => {
        axios
            .get(route("user.show", user_id))
            .then((res) => {
                res.data.start_working_date = moment(
                    res.data.start_working_date
                ).format("YYYY-MM-DD");
                console.log(res.data);
                if(auth.user.accountant){
                    if(res.data.is_admin ){
                        window.location.href = route("users.index");
                    } else {
                        setUser(res.data);
                    }
                } else {
                    if(res.data.id){
                        setUser(res.data);
                    } else {
                        window.location.href = route("users.index");
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
        getBonus();
        getAdvances();
        getHourBanks();
        getProfessions();
        getUserBahnCards();
        getAggreements();
        getCertificates();
        getUserCertificates();
        getPrograms();
        getUserPrograms();
        getClients();
        getUserClients();
        /*const interval = setInterval(() => {
            getBonus();
            getAdvances();
            getHourBanks();
            getProfessions();
            getUserBahnCards();
        }, 100000);
        return () => clearInterval(interval);*/
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {user ? user.name : "User"} Bearbeiten
                </h2>
            }
        >
            <Head title={user ? user.name : "User Bearbeiten"} />

            {/* Bonus Modal */}
            <Modal
                show={openBonusModal}
                onClose={() => setOpenBonusModal(false)}
            >
                <Modal.Header>Bonus Hinzufügen</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-4000">
                            Füllen Sie das Formular aus, um{" "}
                            {user ? user.name : "User"} einen Bonus zu geben
                        </p>
                        <div>
                            <Label htmlFor="transaction_date">Datum</Label>
                            <input
                                type="date"
                                id="transaction_date"
                                className="w-full border-2 border-gray-300 rounded-md p-2"
                                value={
                                    newBonus.transaction_date
                                        .toISOString()
                                        .split("T")[0]
                                }
                                onChange={(e) => {
                                    setNewBonus({
                                        ...newBonus,
                                        transaction_date: new Date(
                                            e.target.value
                                        ),
                                    });
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="amount">Betrag</Label>
                            <input
                                type="number"
                                id="amount"
                                className="w-full border-2 border-gray-300 rounded-md p-2"
                                value={newBonus.amount}
                                onChange={(e) => {
                                    setNewBonus({
                                        ...newBonus,
                                        amount: parseFloat(e.target.value),
                                    });
                                }}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={addNewBonus}>Hinzufügen</Button>
                    <Button
                        color="gray"
                        onClick={() => setOpenBonusModal(false)}
                    >
                        Abbrechen
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Advances Modal */}
            <Modal
                show={openAdvancesModal}
                onClose={() => setOpenAdvancesModal(false)}
            >
                <Modal.Header>Vorauszahlung Hinzufügen</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-4000">
                            Füllen Sie das Formular aus, um{" "}
                            {user ? user.name : "User"} eine Vorauszahlung zu
                            geben
                        </p>
                        <div>
                            <Label htmlFor="transaction_date">Datum</Label>
                            <input
                                type="date"
                                id="transaction_date"
                                className="w-full border-2 border-gray-300 rounded-md p-2"
                                value={
                                    newAdvances.transaction_date
                                        .toISOString()
                                        .split("T")[0]
                                }
                                onChange={(e) => {
                                    setNewAdvances({
                                        ...newAdvances,
                                        transaction_date: new Date(
                                            e.target.value
                                        ),
                                    });
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="amount">Betrag</Label>
                            <input
                                type="number"
                                id="amount"
                                className="w-full border-2 border-gray-300 rounded-md p-2"
                                value={newAdvances.amount}
                                onChange={(e) => {
                                    setNewAdvances({
                                        ...newAdvances,
                                        amount: parseFloat(e.target.value),
                                    });
                                }}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={addNewAdvances}>Hinzufügen</Button>
                    <Button
                        color="gray"
                        onClick={() => setOpenAdvancesModal(false)}
                    >
                        Abbrechen
                    </Button>
                </Modal.Footer>
            </Modal>

            {/** Hour Bank Modal*/}
            <Modal
                show={openHourBanksModal}
                onClose={() => setOpenHourBanksModal(false)}
            >
                <Modal.Header>Hour Bank Hinzufügen</Modal.Header>
                <Modal.Body>
                    <div className="space-y-6">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-4000">
                            Füllen Sie das Formular aus, um{" "}
                            {user ? user.name : "User"}
                            einen Hour Bank zu geben
                        </p>
                        <Formik
                            initialValues={{
                                hours: "",
                                type: "",
                                date: "",
                                credit: false,
                            }}
                            //validate={hourBankValidationSchema}
                            onSubmit={(
                                values,
                                { setSubmitting, setErrors }
                            ) => {
                                if (values.type === "withdraw" && !values.credit) {
                                    const totalHours = hourBanks.reduce(
                                        (acc, curr) => {
                                            return (
                                                acc +
                                                (curr.type === "deposit"
                                                    ? curr.hours
                                                    : -curr.hours)
                                            );
                                        },
                                        0
                                    );

                                    if (values.hours > totalHours) {
                                        setErrors({
                                            hours: "In der Kasse ist dieser Betrag nicht vorhanden",
                                        });
                                        setSubmitting(false);
                                        return;
                                    }
                                }

                                axios
                                    .post(
                                        route("add-hour-bank", user.id),
                                        values
                                    )
                                    .then((res) => {
                                        getHourBanks();
                                        setOpenHourBanksModal(false);
                                        setSubmitting(false);
                                    });
                            }}
                        >
                            {({ isSubmitting, errors,values, setFieldValue }) => (
                                <Form>
                                    <div>
                                        <ToggleSwitch 
                                            id="credit"
                                            name="credit"
                                            value={values.credit}
                                            onChange={(e) => {
                                                setFieldValue("credit", e);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="date">Datum</Label>
                                        <Field
                                            type="date"
                                            id="date"
                                            name="date"
                                            className="w-full border-2 border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="hours">Stunden</Label>
                                        <Field
                                            type="number"
                                            id="hours"
                                            name="hours"
                                            step="0.01"
                                            className="w-full border-2 border-gray-300 rounded-md p-2"
                                        />
                                        {errors.hours && (
                                            <div className="text-red-500">
                                                {errors.hours}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label>Typ</Label>
                                        <div
                                            role="group"
                                            aria-labelledby="type"
                                            className="flex space-x-4 mt-2"
                                        >
                                            <label className="flex items-center space-x-2">
                                                <Field
                                                    type="radio"
                                                    name="type"
                                                    value="deposit"
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span>Einzahlung</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <Field
                                                    type="radio"
                                                    name="type"
                                                    value="withdraw"
                                                    className="form-radio h-4 w-4 text-blue-600"
                                                />
                                                <span>Abhebung</span>
                                            </label>
                                        </div>
                                    </div>
                                    <Modal.Footer>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            Hinzufügen
                                        </Button>
                                        <Button
                                            color="gray"
                                            onClick={() =>
                                                setOpenHourBanksModal(false)
                                            }
                                        >
                                            Abbrechen
                                        </Button>
                                    </Modal.Footer>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Modal.Body>
            </Modal>

            <div className="container mx-auto mt-10">
                {user && (
                    <Formik
                        initialValues={{
                            ...user,
                            is_admin:
                                user.is_admin != null && user.is_admin == 1
                                    ? true
                                    : false,
                            accountant:
                                user.accountant != null && user.accountant == 1
                                    ? true
                                    : false,
                            show_on_timeline:
                                user.show_on_timeline != null && user.show_on_timeline == 1
                                    ? true
                                    : false,
                        }}
                        //validationSchema={validationSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            axios
                                .post(route("edit.inside"), values)
                                .then((res) => {
                                    if (res.data.success) {
                                        Swal.fire({
                                            icon: "success",
                                            title: "Erfolgreich",
                                            text: "Benutzer erfolgreich gespeichert!",
                                        });
                                        window.location.href =
                                            route("users.index");
                                    } else {
                                        Swal.fire({
                                            icon: "error",
                                            title: "Fehler",
                                            text:
                                                data.data.message ||
                                                "Benutzer konnte nicht gespeichert werden!",
                                        });
                                    }
                                    setSubmitting(false);
                                })
                                .catch((error) => {
                                    console.log("error", error);
                                    Swal.fire({
                                        icon: "error",
                                        title: "Fehler",
                                        text:
                                            error.response.data.message ||
                                            "Ein Fehler ist aufgetreten!",
                                    });
                                    setSubmitting(false);
                                });
                        }}
                    >
                        {({
                            values,
                            isSubmitting,
                            setFieldValue,
                            errors,
                            touched,
                        }) => (
                            <div>
                                <Tabs
                                    aria-label="Tabs with icons"
                                    variant="underline"
                                >
                                    <Tabs.Item
                                        active
                                        title="Profil"
                                        icon={HiUserCircle}
                                    >
                                        <div className="mb-4 mx-4 flex space-x-4">
                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="driver_id"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Fahrer ID
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="driver_id"
                                                    id="driver_id"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.driver_id || ""}
                                                />
                                                {errors.driver_id &&
                                                    touched.driver_id && (
                                                        <p className="text-red-500">
                                                            *{errors.driver_id}
                                                        </p>
                                                    )}
                                            </div>

                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="name"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Name und Nachname
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.name || ""}
                                                />
                                                {errors.name &&
                                                    touched.name && (
                                                        <p className="text-red-500">
                                                            *{errors.name}
                                                        </p>
                                                    )}
                                            </div>

                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="identity_number"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Identifikationsnummer
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="identity_number"
                                                    id="identity_number"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.identity_number || ""}
                                                />
                                                {errors.identity_number &&
                                                    touched.identity_number && (
                                                        <p className="text-red-500">
                                                            *
                                                            {
                                                                errors.identity_number
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="flex space-x-4 mb-4 mx-4">
                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="phone"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Telefon
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.phone || ""}
                                                />
                                                {errors.phone &&
                                                    touched.phone && (
                                                        <p className="text-red-500">
                                                            *{errors.phone}
                                                        </p>
                                                    )}
                                            </div>
                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="birth_date"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Geburtsdatum
                                                </label>
                                                <Field
                                                    type="date"
                                                    name="birth_date"
                                                    id="birth_date"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.birth_date || ""}
                                                />
                                                {errors.birth_date &&
                                                    touched.birth_date && (
                                                        <p className="text-red-500">
                                                            *{errors.birth_date}
                                                        </p>
                                                    )}
                                            </div>
                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="start_working_date"
                                                    className="block text-sm font-medium text-gray-7000"
                                                >
                                                    Arbeitsbeginn
                                                </label>
                                                <Datepicker
                                                    name="start_working_date"
                                                    id="start_working_date"
                                                    onSelectedDateChanged={(
                                                        e
                                                    ) => {
                                                        setFieldValue(
                                                            "start_working_date",
                                                            new Date(
                                                                e
                                                            ).toDateString()
                                                        );
                                                    }}
                                                    value={
                                                        values.start_working_date || ""
                                                    }
                                                    className=""
                                                />
                                                {errors.start_working_date &&
                                                    touched.start_working_date && (
                                                        <p className="text-red-500">
                                                            *
                                                            {
                                                                errors.start_working_date
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="mb-4 mx-4 w-1/3">
                                                <label
                                                    htmlFor="nationality"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Nationalität
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="nationality"
                                                    id="nationality"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.nationality || ""}
                                                />
                                                {errors.nationality &&
                                                    touched.nationality && (
                                                        <p className="text-red-500">
                                                            *
                                                            {errors.nationality}
                                                        </p>
                                                    )}
                                            </div>

                                            <div className="mb-4 mx-4 w-1/3">
                                                <label
                                                    htmlFor="kinder"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Anzahl der Kinder
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="kinder"
                                                    id="kinder"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.kinder || ""}
                                                />
                                                {errors.kinder &&
                                                    touched.kinder && (
                                                        <p className="text-red-500">
                                                            *{errors.kinder}
                                                        </p>
                                                    )}
                                            </div>

                                            <div className="mb-4 mx-4 w-1/3">
                                                <label
                                                    htmlFor="is_retired"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Rentner?
                                                </label>
                                                <ToggleSwitch
                                                    label=""
                                                    id="is_retired"
                                                    name="is_retired"
                                                    className="mb-4 mx-4"
                                                    checked={
                                                        values.is_retired
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={(e) => {
                                                        setFieldValue(
                                                            "is_retired",
                                                            e
                                                        );
                                                    }}
                                                />

                                                {errors.is_retired &&
                                                    touched.is_retired && (
                                                        <p className="text-red-500">
                                                            *{errors.is_retired}
                                                        </p>
                                                    )}
                                            </div>

                                            <div className="mb-4 mx-4 w-1/3">
                                                <label
                                                    htmlFor="show_on_timeline"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    In Timeline anzeigen?
                                                </label>
                                                <ToggleSwitch
                                                    label=""
                                                    id="show_on_timeline"
                                                    name="show_on_timeline"
                                                    className="mb-4 mx-4"
                                                    checked={
                                                        values.show_on_timeline
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={(e) => {
                                                        setFieldValue(
                                                            "show_on_timeline",
                                                            e
                                                        );
                                                    }}
                                                />

                                                {errors.show_on_timeline &&
                                                    touched.show_on_timeline && (
                                                        <p className="text-red-500">
                                                            *{errors.show_on_timeline}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="mb-4 mx-4 flex space-x-4">
                                            <div className="w-1/4">
                                                <label
                                                    htmlFor="street"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Straße
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="street"
                                                    id="street"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.street || ""}
                                                />
                                                {errors.street &&
                                                    touched.street && (
                                                        <p className="text-red-500">
                                                            *{errors.street}
                                                        </p>
                                                    )}
                                            </div>
                                            <div className="w-1/4">
                                                <label
                                                    htmlFor="apartment"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Hausnummer
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="apartment"
                                                    id="apartment"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.apartment || ""}
                                                />
                                                {errors.apartment &&
                                                    touched.apartment && (
                                                        <p className="text-red-500">
                                                            *{errors.apartment}
                                                        </p>
                                                    )}
                                            </div>
                                            <div className="w-1/4">
                                                <label
                                                    htmlFor="zip"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Postleitzahl
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="zip"
                                                    id="zip"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.zip || ""}
                                                />
                                                {errors.zip && touched.zip && (
                                                    <p className="text-red-500">
                                                        *{errors.zip}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="w-1/4">
                                                <label
                                                    htmlFor="city"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Stadt
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="city"
                                                    id="city"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.city || ""}
                                                />
                                                {errors.city &&
                                                    touched.city && (
                                                        <p className="text-red-500">
                                                            *{errors.city}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="mb-4 mx-4 flex space-x-4">
                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="urgency_contact_name"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Notfallkontakt
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="urgency_contact_name"
                                                    id="urgency_contact_name"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.urgency_contact_name || ""}
                                                />
                                                {errors.urgency_contact_name &&
                                                    touched.urgency_contact_name && (
                                                        <p className="text-red-500">
                                                            *
                                                            {
                                                                errors.urgency_contact_name
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="urgency_contact_phone"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Notfallkontakt Telefon
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="urgency_contact_phone"
                                                    id="urgency_contact_phone"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.urgency_contact_phone || ""}
                                                />
                                                {errors.urgency_contact_phone &&
                                                    touched.urgency_contact_phone && (
                                                        <p className="text-red-500">
                                                            *
                                                            {
                                                                errors.urgency_contact_phone
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                            <div className="w-1/3">
                                                <label
                                                    htmlFor="private_phone"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Privattelefon
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="private_phone"
                                                    id="private_phone"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.private_phone || ""}
                                                />
                                                {errors.private_phone &&
                                                    touched.private_phone && (
                                                        <p className="text-red-500">
                                                            *
                                                            {
                                                                errors.private_phone
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="mb-4 mx-4 flex space-x-4">
                                            <div className="w-1/2">
                                                <label
                                                    htmlFor="email"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Email
                                                </label>
                                                <Field
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.email || ""}
                                                />
                                                {errors.email &&
                                                    touched.email && (
                                                        <p className="text-red-500">
                                                            *{errors.email}
                                                        </p>
                                                    )}
                                            </div>

                                            <div className="w-1/2">
                                                <label
                                                    htmlFor="password"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Passwort
                                                </label>
                                                <div className="relative">
                                                    <Field
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        autoComplete="new-password"
                                                        className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                        value={values.password || ""}
                                                    />
                                                    <span
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                                        onClick={() => {
                                                            const passwordField =
                                                                document.getElementById(
                                                                    "password"
                                                                );
                                                            if (
                                                                passwordField.type ===
                                                                "password"
                                                            ) {
                                                                passwordField.type =
                                                                    "text";
                                                            } else {
                                                                passwordField.type =
                                                                    "password";
                                                            }
                                                        }}
                                                    >
                                                        <svg
                                                            className="h-5 w-5 text-gray-500"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M10 3C5 3 1.73 7.11 1 10c.73 2.89 4 7 9 7s8.27-4.11 9-7c-.73-2.89-4-7-9-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                                                        </svg>
                                                    </span>
                                                </div>
                                                {errors.password &&
                                                    touched.password && (
                                                        <p className="text-red-500">
                                                            *{errors.password}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>

                                        <div className="mb-4 mx-4 flex space-x-4">
                                            <div className="w-1/4">
                                                <label
                                                    htmlFor="working_hours"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Arbeitsstunden
                                                </label>
                                                <Field
                                                    type="number"
                                                    name="working_hours"
                                                    id="working_hours"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.working_hours || ""}
                                                />
                                                {errors.working_hours &&
                                                    touched.working_hours && (
                                                        <p className="text-red-500">
                                                            *
                                                            {
                                                                errors.working_hours
                                                            }
                                                        </p>
                                                    )}
                                            </div>
                                            <div className="w-1/4">
                                                <label
                                                    htmlFor="annual_leave_rights"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Jahresurlaubsanspruch (Tage)
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="annual_leave_rights"
                                                    id="annual_leave_rights"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.annual_leave_rights || ""}
                                                />
                                                {errors.annual_leave_rights &&
                                                    touched.annual_leave_rights && (
                                                        <p className="text-red-500">
                                                            *
                                                            {
                                                                errors.annual_leave_rights
                                                            }
                                                        </p>
                                                    )}
                                            </div>

                                            <div className="w-1/4">
                                                <label
                                                    htmlFor="salary"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Gehalt (Stunden)
                                                </label>
                                                <Field
                                                    type="text"
                                                    name="salary"
                                                    id="salary"
                                                    className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                    value={values.salary || ""}
                                                />
                                                {errors.salary &&
                                                    touched.salary && (
                                                        <p className="text-red-500">
                                                            *{errors.salary}
                                                        </p>
                                                    )}
                                            </div>
                                            <div className="w-1/5">
                                                <label
                                                    htmlFor="is_admin"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Admin Benutzer?
                                                </label>

                                                <ToggleSwitch
                                                    label=""
                                                    id="is_admin"
                                                    name="is_admin"
                                                    className="mt-2"
                                                    checked={
                                                        values.is_admin
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={(e) => {
                                                        setFieldValue(
                                                            "is_admin",
                                                            e
                                                        );
                                                    }}
                                                />
                                                {errors.is_admin &&
                                                    touched.is_admin && (
                                                        <p className="text-red-500">
                                                            *{errors.is_admin}
                                                        </p>
                                                    )}
                                            </div>
                                            <div className="w-1/5">
                                                <label
                                                    htmlFor="accountant"
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    Buchhalter?
                                                </label>

                                                <ToggleSwitch
                                                    label=""
                                                    id="accountant"
                                                    name="accountant"
                                                    className="mt-2"
                                                    checked={
                                                        values.accountant
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={(e) => {
                                                        setFieldValue(
                                                            "accountant",
                                                            e
                                                        );
                                                    }}
                                                />
                                                {errors.accountant &&
                                                    touched.accountant && (
                                                        <p className="text-red-500">
                                                            *{errors.accountant}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="profession_name"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Beruf
                                            </label>
                                            <CreatableSelect
                                                isClearable
                                                isMulti
                                                onCreateOption={
                                                    handleCreateProfession
                                                }
                                                options={professions}
                                                value={userProfessions}
                                                onChange={
                                                    handleSelectProfession
                                                }
                                            />
                                        </div>
                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="profession_name"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Kunden
                                            </label>
                                            <CreatableSelect
                                                isClearable
                                                isMulti
                                                onCreateOption={
                                                    handleCreateClient
                                                }
                                                options={clients}
                                                value={userClients}
                                                onChange={
                                                    handleSelectClient
                                                }
                                            />
                                        </div>
                                    </Tabs.Item>
                                    <Tabs.Item
                                        title="Bankdaten"
                                        icon={MdOutlineWorkOutline}
                                    >
                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="bank_name"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Bank
                                            </label>
                                            <Field
                                                type="text"
                                                name="bank_name"
                                                id="bank_name"
                                                className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                            />
                                            {errors.bank_name &&
                                                touched.bank_name && (
                                                    <p className="text-red-500">
                                                        *{errors.bank_name}
                                                    </p>
                                                )}
                                        </div>
                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="bank_account_number"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Bankkonto Nummer
                                            </label>
                                            <Field
                                                type="text"
                                                name="bank_account_number"
                                                id="bank_account_number"
                                                className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                            />
                                            {errors.bank_account_number &&
                                                touched.bank_account_number && (
                                                    <p className="text-red-500">
                                                        *
                                                        {
                                                            errors.bank_account_number
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="bank_iban"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                IBAN
                                            </label>
                                            <Field
                                                type="text"
                                                name="bank_iban"
                                                id="bank_iban"
                                                className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                                pattern="[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}"
                                                placeholder="DE00 0000 0000 0000 0000 0000 00"
                                                onKeyDown={(e) => {
                                                    const value =
                                                        e.target.value.replace(
                                                            /\s+/g,
                                                            ""
                                                        );
                                                    if (
                                                        e.keyCode !== 8 &&
                                                        value.length >= 26
                                                    ) {
                                                        e.preventDefault();
                                                    } else if (
                                                        e.keyCode !== 8 &&
                                                        (value.length === 4 ||
                                                            value.length ===
                                                                8 ||
                                                            value.length ===
                                                                12 ||
                                                            value.length ===
                                                                16 ||
                                                            value.length ===
                                                                20 ||
                                                            value.length === 24)
                                                    ) {
                                                        e.target.value =
                                                            e.target.value +
                                                            " ";
                                                    }
                                                }}
                                            />
                                            {errors.bank_iban &&
                                                touched.bank_iban && (
                                                    <p className="text-red-500">
                                                        *{errors.bank_iban}
                                                    </p>
                                                )}
                                        </div>
                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="bank_bic"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                BIC
                                            </label>
                                            <Field
                                                type="text"
                                                name="bank_bic"
                                                id="bank_bic"
                                                className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                            />
                                            {errors.bank_bic &&
                                                touched.bank_bic && (
                                                    <p className="text-red-500">
                                                        *{errors.bank_bic}
                                                    </p>
                                                )}
                                        </div>
                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="bank_account_holder"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Kontoinhaber
                                            </label>
                                            <Field
                                                type="text"
                                                name="bank_account_holder"
                                                id="bank_account_holder"
                                                className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                            />
                                            {errors.bank_account_holder &&
                                                touched.bank_account_holder && (
                                                    <p className="text-red-500">
                                                        *
                                                        {
                                                            errors.bank_account_holder
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                    </Tabs.Item>
                                    <Tabs.Item
                                        title="Versicherungsinformationen"
                                        icon={HiShieldCheck}
                                    >
                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="insurance_number"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Versicherungsnummer
                                            </label>
                                            <Field
                                                type="text"
                                                name="insurance_number"
                                                id="insurance_number"
                                                className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                            />
                                            {errors.insurance_number &&
                                                touched.insurance_number && (
                                                    <p className="text-red-500">
                                                        *
                                                        {
                                                            errors.insurance_number
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="social_security_number"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Sozialversicherungsnummer
                                            </label>
                                            <Field
                                                type="text"
                                                name="social_security_number"
                                                id="social_security_number"
                                                className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                            />
                                            {errors.social_security_number &&
                                                touched.social_security_number && (
                                                    <p className="text-red-500">
                                                        *
                                                        {
                                                            errors.social_security_number
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="social_security_name"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Krankenkasse
                                            </label>
                                            <Field
                                                type="text"
                                                name="social_security_name"
                                                id="social_security_name"
                                                className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                            />
                                            {errors.social_security_name &&
                                                touched.social_security_name && (
                                                    <p className="text-red-500">
                                                        *
                                                        {
                                                            errors.social_security_name
                                                        }
                                                    </p>
                                                )}
                                        </div>

                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="tax_class"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Steuerklasse
                                            </label>
                                            <Field
                                                type="number"
                                                name="tax_class"
                                                id="tax_class"
                                                className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                            />
                                            {errors.tax_class &&
                                                touched.tax_class && (
                                                    <p className="text-red-500">
                                                        *{errors.tax_class}
                                                    </p>
                                                )}
                                        </div>
                                        <div className="mb-4 mx-4">
                                            <label
                                                htmlFor="tax_class"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Steuer-ID
                                            </label>
                                            <Field
                                                type="number"
                                                name="tax_id"
                                                id="tax_id"
                                                className="placeholder:italic placeholder:text-slate-4000 block bg-white w-full border border-slate-500 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                            />
                                            {errors.tax_id &&
                                                touched.tax_id && (
                                                    <p className="text-red-500">
                                                        *{errors.tax_id}
                                                    </p>
                                                )}
                                        </div>
                                    </Tabs.Item>
                                    {/* Bonuslar */}
                                    <Tabs.Item
                                        title="Bonuses"
                                        icon={HiClipboardList}
                                    >
                                        <div className="container mx-auto mt-10">
                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                                                        <div className="flex justify-between align-middle">
                                                            <div>
                                                                {user
                                                                    ? user.name
                                                                    : "User"}{" "}
                                                                - Bonus
                                                                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                                                                    {user
                                                                        ? user.name
                                                                        : "User"}{" "}
                                                                    - Bonus
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                                    onClick={() => {
                                                                        setOpenBonusModal(
                                                                            true
                                                                        );
                                                                    }}
                                                                >
                                                                    Neu Bonus
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </caption>

                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3"
                                                            >
                                                                Datum
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3"
                                                            >
                                                                Betrag
                                                            </th>

                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3"
                                                            >
                                                                Löschen
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bonus &&
                                                            bonus.length > 0 &&
                                                            bonus.map(
                                                                (
                                                                    bonus,
                                                                    key
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                                    >
                                                                        <td className="px-6 py-4">
                                                                            {moment(
                                                                                bonus.transaction_date
                                                                            ).format(
                                                                                "DD.MM.YYYY HH:mm"
                                                                            )}
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            {
                                                                                bonus.amount
                                                                            }
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <Button
                                                                                onClick={() =>
                                                                                    deleteBonus(
                                                                                        bonus.id
                                                                                    )
                                                                                }
                                                                                className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                                                                            >
                                                                                Löschen
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        {bonus &&
                                                            bonus.length ===
                                                                0 && (
                                                                <tr>
                                                                    <td
                                                                        colSpan="3"
                                                                        className="text-center py-4"
                                                                    >
                                                                        Bonus
                                                                        nicht gefunden
                                                                    </td>
                                                                </tr>
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </Tabs.Item>
                                    {/* Avanslar */}
                                    <Tabs.Item
                                        title="Vorauszahlungen"
                                        icon={HiUserCircle}
                                    >
                                        <div className="container mx-auto mt-10">
                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                                                        <div className="flex justify-between align-middle">
                                                            <div>
                                                                {" "}
                                                                {user
                                                                    ? user.name
                                                                    : "User"}{" "}
                                                                -
                                                                Vorauszahlungen
                                                                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                                                                    {user
                                                                        ? user.name
                                                                        : "User"}{" "}
                                                                    -
                                                                    Vorauszahlungen
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                                    onClick={() => {
                                                                        setOpenAdvancesModal(
                                                                            true
                                                                        );
                                                                    }}
                                                                >
                                                                    Neu
                                                                    Vorauszahlung
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </caption>

                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3"
                                                            >
                                                                Datum
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3"
                                                            >
                                                                Betrag
                                                            </th>

                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3"
                                                            >
                                                                Löschen
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {advances &&
                                                            advances.length >
                                                                0 &&
                                                            advances.map(
                                                                (
                                                                    advances,
                                                                    key
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                                    >
                                                                        <td className="px-6 py-4">
                                                                            {moment(
                                                                                advances.transaction_date
                                                                            ).format(
                                                                                "DD.MM.YYYY HH:mm"
                                                                            )}
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            {
                                                                                advances.amount
                                                                            }
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <Button
                                                                                onClick={() =>
                                                                                    deleteAdvances(
                                                                                        advances.id
                                                                                    )
                                                                                }
                                                                                className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                                                                            >
                                                                                Löschen
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}

                                                        {advances &&
                                                            advances.length ===
                                                                0 && (
                                                                <tr>
                                                                    <td
                                                                        colSpan="3"
                                                                        className="text-center py-4"
                                                                    >
                                                                        Vorauszahlung
                                                                        nicht gefunden
                                                                    </td>
                                                                </tr>
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </Tabs.Item>
                                    {/* Saat Bankası */}
                                    <Tabs.Item
                                        title="Arbeitszeitkonto"
                                        icon={HiClipboardList}
                                    >
                                        <div className="container mx-auto mt-10">
                                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                                    <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                                                        <div className="flex justify-between align-middle">
                                                            <div>
                                                                {" "}
                                                                {user
                                                                    ? user.name
                                                                    : "User"}{" "}
                                                                - Arbeitszeitkonto
                                                                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                                                                    {user
                                                                        ? user.name
                                                                        : "User"}{" "}
                                                                    - Arbeitszeitkonto
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <button
                                                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                                    onClick={() => {
                                                                        setOpenHourBanksModal(
                                                                            true
                                                                        );
                                                                    }}
                                                                >
                                                                    Neu Arbeitszeitkonto
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </caption>

                                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3"
                                                            >
                                                                Datum
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3"
                                                            >
                                                                Typ
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3"
                                                            >
                                                                Betrag
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3"
                                                            >
                                                                Löschen
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {hourBanks &&
                                                            hourBanks.length >
                                                                0 &&
                                                            hourBanks.map(
                                                                (
                                                                    hourBank,
                                                                    key
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            key
                                                                        }
                                                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                                    >
                                                                        <td className="px-6 py-4">
                                                                            {moment(
                                                                                hourBank.date
                                                                            ).format(
                                                                                "DD.MM.YYYY HH:mm"
                                                                            )}
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            {
                                                                                hourBank.type
                                                                            }
                                                                        </td>
                                                                        <td
                                                                            className={
                                                                                "px-6 py-4" +
                                                                                (hourBank.type ==
                                                                                "deposit"
                                                                                    ? " text-green-500"
                                                                                    : " text-red-500")
                                                                            }
                                                                        >
                                                                            {hourBank.type ==
                                                                            "deposit"
                                                                                ? "+"
                                                                                : "-"}
                                                                            {
                                                                                hourBank.hours
                                                                            }
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <Button
                                                                                onClick={() => {
                                                                                    Swal.fire(
                                                                                        {
                                                                                            title: "Sind Sie sicher?",
                                                                                            text: "Diese Aktion kann nicht rückgängig gemacht werden!",
                                                                                            icon: "warning",
                                                                                            showCancelButton: true,
                                                                                            confirmButtonColor:
                                                                                                "#3085d6",
                                                                                            cancelButtonColor:
                                                                                                "#d33",
                                                                                            confirmButtonText:
                                                                                                "Ja, löschen!",
                                                                                            cancelButtonText:
                                                                                                "Nein, abbrechen",
                                                                                        }
                                                                                    ).then(
                                                                                        (
                                                                                            result
                                                                                        ) => {
                                                                                            if (
                                                                                                result.isConfirmed
                                                                                            ) {
                                                                                                deleteHourBank(
                                                                                                    hourBank
                                                                                                );
                                                                                                Swal.fire(
                                                                                                    "Gelöscht!",
                                                                                                    "Der Eintrag wurde erfolgreich gelöscht.",
                                                                                                    "success"
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }}
                                                                                className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                                                                            >
                                                                                Löschen
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}

                                                        {hourBanks &&
                                                            hourBanks.length ===
                                                                0 && (
                                                                <tr>
                                                                    <td
                                                                        colSpan="4"
                                                                        className="text-center py-4"
                                                                    >
                                                                        Keine
                                                                        Bewegung
                                                                        im
                                                                        Stundensaldo
                                                                        gefunden
                                                                    </td>
                                                                </tr>
                                                            )}
                                                    </tbody>
                                                    {hourBanks &&
                                                        hourBanks.length >
                                                            0 && (
                                                            <tfoot>
                                                                <tr className="bg-gray-50 dark:bg-gray-700">
                                                                    <th
                                                                        scope="col"
                                                                        className="px-6 py-3"
                                                                        colSpan="2"
                                                                    >
                                                                        Gesamtbetrag
                                                                    </th>
                                                                    <th
                                                                        scope="col"
                                                                        className="px-6 py-3"
                                                                    >
                                                                        <span
                                                                            className={
                                                                                hourBanks.reduce(
                                                                                    (
                                                                                        total,
                                                                                        hourBank
                                                                                    ) => {
                                                                                        return (
                                                                                            total +
                                                                                            (hourBank.type ===
                                                                                            "deposit"
                                                                                                ? hourBank.hours
                                                                                                : -hourBank.hours)
                                                                                        );
                                                                                    },
                                                                                    0
                                                                                ) >=
                                                                                0
                                                                                    ? "text-green-500"
                                                                                    : "text-red-500"
                                                                            }
                                                                        >
                                                                            {hourBanks.reduce(
                                                                                (
                                                                                    total,
                                                                                    hourBank
                                                                                ) => {
                                                                                    return (
                                                                                        total +
                                                                                        (hourBank.type ===
                                                                                        "deposit"
                                                                                            ? hourBank.hours
                                                                                            : -hourBank.hours)
                                                                                    );
                                                                                },
                                                                                0
                                                                            )}
                                                                        </span>
                                                                    </th>
                                                                    <th
                                                                        scope="col"
                                                                        className="px-6 py-3"
                                                                    ></th>
                                                                </tr>
                                                            </tfoot>
                                                        )}
                                                </table>
                                            </div>
                                        </div>
                                    </Tabs.Item>
                                    {/* Sertifikalar */}
                                    <Tabs.Item
                                        title={
                                            <div className="flex items-center">
                                                Zertifikate
                                                {alertCertificates && (
                                                    <span className="bg-red-500 text-white text-xs font-semibold ml-2 px-2.5 py-0.5 rounded">
                                                        {alertCertificates}
                                                    </span>
                                                )}
                                            </div>
                                        }
                                        icon={HiShieldCheck}
                                    >

                                        <UserCertificate certificates={certificates} user={user} userCertificates={userCertificates} />


                                    </Tabs.Item>
                                    {/* Sözleşmeler */}
                                    <Tabs.Item
                                        title="Verträge"
                                        icon={HiClipboardList}
                                    >
                                        <UserAgreement agreements={aggreements} user={user} userAgreements={userAgreements} />
                                    </Tabs.Item>
                                    {/* Programlar */}
                                    <Tabs.Item
                                        title="Programme"
                                        icon={MdDashboard}
                                    >
                                        <UserProgram programs={programs} user={user} userPrograms={userPrograms} />
                                    </Tabs.Item>
                                    {/* Bahn Kart */}
                                    <Tabs.Item
                                        title="Bahnkarte"
                                        icon={HiCreditCard}
                                    >
                                        {userBahnCard && (
                                            <div className="flex justify-center">
                                                <BahnCard
                                                    bahnCard={userBahnCard}
                                                    user={user}
                                                />
                                            </div>
                                        )}
                                    </Tabs.Item>
                                    <Tabs.Item
                                        title="Gehaltsabrechnungen"
                                        icon={HiDocumentReport}
                                    >
                                        <GehaltsBerichte  user={user} />
                                    </Tabs.Item>
                                </Tabs>
                                <Form>
                                    <div className="flex items-center justify-end mt-4 mx-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Speichern
                                        </button>
                                    </div>
                                </Form>
                            </div>
                        )}
                    </Formik>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
