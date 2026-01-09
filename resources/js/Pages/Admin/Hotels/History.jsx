import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState, useCallback } from "react";
import {
    Label,
    Select,
    Button,
    Spinner,
    Tabs,
    Textarea,
    TextInput,
    Table,
} from "flowbite-react";
import { useDropzone } from "react-dropzone";
import AsyncSelect from "react-select/async";
import axios from "axios";
import Swal from "sweetalert2";

export default function HotelsHistory({ auth }) {
    const [activeTab, setActiveTab] = useState("search");
    const [filterView, setFilterView] = useState(true);
    const [filter, setFilter] = useState({});
    const [weekSelectable, setWeekSelectable] = useState(false);
    const [monthSelectable, setMonthSelectable] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterSources, setFilterSources] = useState({
        user: [],
        client: [],
        month: [],
        year: [],
        week: [],
    });
    const [errors, setErrors] = useState({});
    const [data, setData] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Form state for adding hotel
    const [hotelForm, setHotelForm] = useState({
        client_id: "",
        user_id: "",
        hotel_name: "",
        tour_name: "",
        price: "",
        check_in_date: "",
        check_out_date: "",
        notes: "",
        invoice_file: "",
    });
    const [selectedTour, setSelectedTour] = useState(null);
    const [invoiceFile, setInvoiceFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        axios
            .get("/finalized-filter")
            .then((res) => {
                if (res.status == 200 && res.data) {
                    if (res.data.year) {
                        res.data.year.sort((a, b) => {
                            return b - a;
                        });
                    }
                    setFilterSources({
                        user: res.data.users || [],
                        client: res.data.clients || [],
                        month: res.data.months || [],
                        year: res.data.year || [],
                        week: Array.from({ length: 52 }, (_, i) => i + 1),
                    });
                }
            })
            .catch((err) => {
                console.error("Error fetching filters:", err);
                Swal.fire({
                    icon: "error",
                    title: "Fehler",
                    text:
                        "Filterdaten konnten nicht geladen werden: " +
                        (err.response?.data?.message || err.message),
                });
            });
    }, []);

    const handleChange = (e) => {
        let key = e.target.id;
        let value = e.target.value;
        if (key == "week") {
            if (value != "Suchen...") {
                setMonthSelectable(true);
            } else {
                setMonthSelectable(false);
            }
        }
        if (key == "month") {
            if (value != "Suchen...") {
                setWeekSelectable(true);
            } else {
                setWeekSelectable(false);
            }
        }
        setFilter((filter) => ({
            ...filter,
            [key]: value,
        }));
    };

    const filterAction = () => {
        setIsSubmitting(true);
        setErrors({});

        if (!filter.client || filter.client === "Suchen...") {
            setErrors({ client_id: "Bitte wählen Sie einen Kunden" });
            setIsSubmitting(false);
            return;
        }

        if (!filter.year || filter.year === "Suchen...") {
            setErrors({ year: "Bitte wählen Sie ein Jahr" });
            setIsSubmitting(false);
            return;
        }

        if (
            (!filter.month || filter.month === "Suchen...") &&
            (!filter.week || filter.week === "Suchen...")
        ) {
            setErrors({
                month: "Bitte wählen Sie einen Monat oder eine Woche",
            });
            setIsSubmitting(false);
            return;
        }

        axios
            .get("/hotels", {
                params: {
                    user_id: filter.user,
                    client_id: filter.client,
                    week: filter.week,
                    month: filter.month,
                    year: filter.year,
                },
            })
            .then((res) => {
                setIsSubmitting(false);
                if (res.data.status) {
                    setData(res.data.data);
                    setTotalPrice(res.data.total_price || 0);
                    setFilterView(false);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Fehler",
                        text: "Keine Daten gefunden",
                    });
                }
            })
            .catch((err) => {
                setIsSubmitting(false);
                Swal.fire({
                    icon: "error",
                    title: "Fehler",
                    text:
                        err.response?.data?.message ||
                        "Ein Fehler ist aufgetreten",
                });
                if (err.response?.data?.errors) {
                    setErrors(err.response.data.errors);
                }
            });
    };

    const uploadInvoice = async (acceptedFiles) => {
        setIsUploading(true);
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
            formData.append("files[]", file);
        });

        try {
            const response = await axios.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data && response.data.length > 0) {
                let fileUrl = response.data[0].url;

                try {
                    const url = new URL(fileUrl);
                    fileUrl = url.pathname;
                } catch (e) {
                    // If URL parsing fails, try regex
                    const urlMatch = fileUrl.match(/\/storage\/.*$/);
                    if (urlMatch) {
                        fileUrl = urlMatch[0];
                    } else {
                        // Fallback: remove common URL patterns
                        fileUrl = fileUrl.replace(/^https?:\/\/[^\/]+/, "");
                    }
                }
                setHotelForm((prev) => ({
                    ...prev,
                    invoice_file: fileUrl,
                }));
                setInvoiceFile(response.data[0]);
            }
        } catch (error) {
            console.error("Fehler beim Hochladen der Datei:", error);
            Swal.fire({
                icon: "error",
                title: "Fehler",
                text: "Rechnung konnte nicht hochgeladen werden",
            });
        } finally {
            setIsUploading(false);
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        uploadInvoice(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpeg", ".jpg"],
            "image/png": [".png"],
            "image/gif": [".gif"],
            "image/heif": [".heif"],
            "image/heic": [".heic"],
            "application/pdf": [".pdf"],
        },
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setHotelForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const loadTourOptions = async (inputValue) => {
        try {
            const response = await axios.get("/hotels/tour-names", {
                params: { search: inputValue },
            });
            return response.data;
        } catch (error) {
            console.error("Error loading tour names:", error);
            return [];
        }
    };

    const handleTourChange = (selectedOption) => {
        setSelectedTour(selectedOption);
        setHotelForm((prev) => ({
            ...prev,
            tour_name: selectedOption ? selectedOption.value : "",
        }));
        if (formErrors.tour_name) {
            setFormErrors((prev) => ({
                ...prev,
                tour_name: "",
            }));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setFormErrors({});
        setIsSaving(true);

        if (!hotelForm.client_id || hotelForm.client_id === "") {
            setFormErrors({ client_id: "Bitte wählen Sie einen Kunden" });
            setIsSaving(false);
            return;
        }

        if (!hotelForm.user_id || hotelForm.user_id === "") {
            setFormErrors({ user_id: "Bitte wählen Sie einen Mitarbeiter" });
            setIsSaving(false);
            return;
        }

        axios
            .post("/hotels", hotelForm)
            .then((res) => {
                setIsSaving(false);
                if (res.data.status) {
                    Swal.fire({
                        icon: "success",
                        title: "Erfolgreich",
                        text: "Hotel-Verlauf erfolgreich hinzugefügt",
                    });
                    setHotelForm({
                        client_id: "",
                        user_id: "",
                        hotel_name: "",
                        tour_name: "",
                        price: "",
                        check_in_date: "",
                        check_out_date: "",
                        notes: "",
                        invoice_file: "",
                    });
                    setSelectedTour(null);
                    setInvoiceFile(null);
                }
            })
            .catch((err) => {
                setIsSaving(false);
                Swal.fire({
                    icon: "error",
                    title: "Fehler",
                    text:
                        err.response?.data?.message ||
                        "Ein Fehler ist aufgetreten",
                });
                if (err.response?.data?.errors) {
                    setFormErrors(err.response.data.errors);
                }
            });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Hotels History
                </h2>
            }
        >
            <Head title="Hotels History" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-4">
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-yellow-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">
                                    ⚠️ Diese Seite befindet sich in der
                                    Testphase
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <Tabs aria-label="Hotels History Tabs">
                                <Tabs.Item
                                    active={activeTab === "search"}
                                    title="Suchen"
                                >
                                    {filterView ? (
                                        <div className="flex justify-center flex-row p-5 mx-auto flex-wrap">
                                            <div className="max-w-md w-1/6 mx-5 mb-4">
                                                <div className="mb-2 block">
                                                    <Label
                                                        htmlFor="client"
                                                        value="Kunden"
                                                    />
                                                </div>
                                                <Select
                                                    id="client"
                                                    onChange={handleChange}
                                                >
                                                    <option>Suchen...</option>
                                                    {filterSources.client &&
                                                        filterSources.client
                                                            .length > 0 &&
                                                        filterSources.client.map(
                                                            (client) => (
                                                                <option
                                                                    key={
                                                                        client.id
                                                                    }
                                                                    value={
                                                                        client.id
                                                                    }
                                                                >
                                                                    {
                                                                        client.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                </Select>
                                                {errors && errors.client_id && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.client_id}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="max-w-md w-1/6 mx-5 mb-4">
                                                <div className="mb-2 block">
                                                    <Label
                                                        htmlFor="user"
                                                        value="Mitarbeiter"
                                                    />
                                                </div>
                                                <Select
                                                    id="user"
                                                    onChange={handleChange}
                                                >
                                                    <option>Suchen...</option>
                                                    {filterSources.user &&
                                                        filterSources.user
                                                            .length > 0 &&
                                                        filterSources.user.map(
                                                            (user) => (
                                                                <option
                                                                    key={
                                                                        user.id
                                                                    }
                                                                    value={
                                                                        user.id
                                                                    }
                                                                >
                                                                    {user.name}
                                                                </option>
                                                            )
                                                        )}
                                                </Select>
                                                {errors && errors.user_id && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.user_id}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="max-w-md w-1/6 mx-5 mb-4">
                                                <div className="mb-2 block">
                                                    <Label
                                                        htmlFor="week"
                                                        value="Woche"
                                                    />
                                                </div>
                                                <Select
                                                    id="week"
                                                    onChange={handleChange}
                                                    disabled={weekSelectable}
                                                >
                                                    <option>Suchen...</option>
                                                    {filterSources.week &&
                                                        filterSources.week
                                                            .length > 0 &&
                                                        filterSources.week.map(
                                                            (week, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={week}
                                                                >
                                                                    {week
                                                                        .toString()
                                                                        .padStart(
                                                                            2,
                                                                            "0"
                                                                        )}
                                                                </option>
                                                            )
                                                        )}
                                                </Select>
                                                {errors && errors.week && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.week}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="max-w-md w-1/6 mx-5 mb-4">
                                                <div className="mb-2 block">
                                                    <Label
                                                        htmlFor="month"
                                                        value="Monat"
                                                    />
                                                </div>
                                                <Select
                                                    id="month"
                                                    onChange={handleChange}
                                                    disabled={monthSelectable}
                                                >
                                                    <option>Suchen...</option>
                                                    {filterSources.month &&
                                                        filterSources.month
                                                            .length > 0 &&
                                                        filterSources.month.map(
                                                            (month, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        index +
                                                                        1
                                                                    }
                                                                >
                                                                    {month}
                                                                </option>
                                                            )
                                                        )}
                                                </Select>
                                                {errors && errors.month && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.month}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="max-w-md w-1/6 mx-5 mb-4">
                                                <div className="mb-2 block">
                                                    <Label
                                                        htmlFor="year"
                                                        value="Jahr"
                                                    />
                                                </div>
                                                <Select
                                                    id="year"
                                                    onChange={handleChange}
                                                >
                                                    <option>Suchen...</option>
                                                    {filterSources.year &&
                                                        filterSources.year
                                                            .length > 0 &&
                                                        filterSources.year.map(
                                                            (year, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={year}
                                                                >
                                                                    {year}
                                                                </option>
                                                            )
                                                        )}
                                                </Select>
                                                {errors && errors.year && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {errors.year}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="max-w-md flex justify-end p-5 w-full">
                                                <div className="mb-2 block">
                                                    {isSubmitting ? (
                                                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
                                                            <Spinner
                                                                aria-label="Spinner button example"
                                                                size="sm"
                                                            />
                                                            <span className="pl-3">
                                                                Loading...
                                                            </span>
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            onClick={
                                                                filterAction
                                                            }
                                                        >
                                                            Suchen
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-gray-900">
                                            <Button
                                                onClick={() => {
                                                    setFilterView(true);
                                                    setData([]);
                                                }}
                                                className="mb-4"
                                            >
                                                Zurück zu Filtern
                                            </Button>
                                            {data && data.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    {totalPrice > 0 && (
                                                        <div className="mb-4">
                                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                                <p className="text-lg font-semibold text-blue-800">
                                                                    Gesamtpreis
                                                                    (Tarih
                                                                    Aralığı):{" "}
                                                                    {totalPrice.toLocaleString(
                                                                        "de-DE",
                                                                        {
                                                                            minimumFractionDigits: 2,
                                                                            maximumFractionDigits: 2,
                                                                        }
                                                                    )}{" "}
                                                                    €
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <Table striped>
                                                        <Table.Head>
                                                            <Table.HeadCell>
                                                                Datum
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                Kunde
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                Mitarbeiter
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                Hotelname
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                Tourname
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                Check-in
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                Check-out
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                Preis
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                Notiz
                                                            </Table.HeadCell>
                                                            <Table.HeadCell>
                                                                Rechnung
                                                            </Table.HeadCell>
                                                        </Table.Head>
                                                        <Table.Body className="divide-y">
                                                            {data.map(
                                                                (
                                                                    hotel,
                                                                    index
                                                                ) => (
                                                                    <Table.Row
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                                                                    >
                                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                            {new Date(
                                                                                hotel.created_at
                                                                            ).toLocaleDateString(
                                                                                "de-DE"
                                                                            )}
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            {hotel.client
                                                                                ? hotel
                                                                                      .client
                                                                                      .name
                                                                                : "-"}
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            {hotel.user
                                                                                ? hotel
                                                                                      .user
                                                                                      .name
                                                                                : "-"}
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            {hotel.hotel_name ||
                                                                                "-"}
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            {hotel.tour_name ||
                                                                                "-"}
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            {hotel.check_in_date
                                                                                ? new Date(
                                                                                      hotel.check_in_date
                                                                                  ).toLocaleDateString(
                                                                                      "de-DE"
                                                                                  )
                                                                                : "-"}
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            {hotel.check_out_date
                                                                                ? new Date(
                                                                                      hotel.check_out_date
                                                                                  ).toLocaleDateString(
                                                                                      "de-DE"
                                                                                  )
                                                                                : "-"}
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            {hotel.price
                                                                                ? parseFloat(
                                                                                      hotel.price
                                                                                  ).toLocaleString(
                                                                                      "de-DE",
                                                                                      {
                                                                                          minimumFractionDigits: 2,
                                                                                          maximumFractionDigits: 2,
                                                                                      }
                                                                                  ) +
                                                                                  " €"
                                                                                : "-"}
                                                                        </Table.Cell>
                                                                        <Table.Cell className="max-w-xs truncate">
                                                                            {hotel.notes ||
                                                                                "-"}
                                                                        </Table.Cell>
                                                                        <Table.Cell>
                                                                            {hotel.invoice_file ? (
                                                                                <a
                                                                                    href={
                                                                                        hotel.invoice_file
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-blue-600 hover:underline"
                                                                                >
                                                                                    Anzeigen
                                                                                </a>
                                                                            ) : (
                                                                                "-"
                                                                            )}
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                )
                                                            )}
                                                        </Table.Body>
                                                    </Table>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500">
                                                    Keine Daten gefunden.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </Tabs.Item>
                                <Tabs.Item
                                    active={activeTab === "add"}
                                    title="Hinzufügen"
                                >
                                    <form
                                        onSubmit={handleFormSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label
                                                    htmlFor="form_client_id"
                                                    value="Kunden *"
                                                />
                                                <Select
                                                    id="form_client_id"
                                                    name="client_id"
                                                    value={hotelForm.client_id}
                                                    onChange={handleFormChange}
                                                    required
                                                >
                                                    <option value="">
                                                        Bitte wählen...
                                                    </option>
                                                    {filterSources.client &&
                                                        filterSources.client
                                                            .length > 0 &&
                                                        filterSources.client.map(
                                                            (client) => (
                                                                <option
                                                                    key={
                                                                        client.id
                                                                    }
                                                                    value={
                                                                        client.id
                                                                    }
                                                                >
                                                                    {
                                                                        client.name
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                </Select>
                                                {formErrors.client_id && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {formErrors.client_id}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor="form_user_id"
                                                    value="Mitarbeiter *"
                                                />
                                                <Select
                                                    id="form_user_id"
                                                    name="user_id"
                                                    value={hotelForm.user_id}
                                                    onChange={handleFormChange}
                                                    required
                                                >
                                                    <option value="">
                                                        Bitte wählen...
                                                    </option>
                                                    {filterSources.user &&
                                                        filterSources.user
                                                            .length > 0 &&
                                                        filterSources.user.map(
                                                            (user) => (
                                                                <option
                                                                    key={
                                                                        user.id
                                                                    }
                                                                    value={
                                                                        user.id
                                                                    }
                                                                >
                                                                    {user.name}
                                                                </option>
                                                            )
                                                        )}
                                                </Select>
                                                {formErrors.user_id && (
                                                    <p className="text-red-500 text-sm mt-1">
                                                        {formErrors.user_id}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="hotel_name"
                                                value="Hotelname (Optional)"
                                            />
                                            <TextInput
                                                id="hotel_name"
                                                name="hotel_name"
                                                type="text"
                                                value={hotelForm.hotel_name}
                                                onChange={handleFormChange}
                                                placeholder="Hotelname"
                                            />
                                        </div>
                                        <div>
                                            <Label value="Tourname (Optional)" />
                                            <AsyncSelect
                                                cacheOptions
                                                defaultOptions
                                                loadOptions={loadTourOptions}
                                                value={selectedTour}
                                                onChange={handleTourChange}
                                                placeholder="Tourname suchen..."
                                                noOptionsMessage={() =>
                                                    "Keine Tournamen gefunden"
                                                }
                                                loadingMessage={() => "Lädt..."}
                                                isClearable
                                            />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="price"
                                                value="Preis (Optional)"
                                            />
                                            <TextInput
                                                id="price"
                                                name="price"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={hotelForm.price}
                                                onChange={handleFormChange}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label
                                                    htmlFor="check_in_date"
                                                    value="Check-in Datum (Optional)"
                                                />
                                                <TextInput
                                                    id="check_in_date"
                                                    name="check_in_date"
                                                    type="date"
                                                    value={
                                                        hotelForm.check_in_date
                                                    }
                                                    onChange={handleFormChange}
                                                />
                                            </div>
                                            <div>
                                                <Label
                                                    htmlFor="check_out_date"
                                                    value="Check-out Datum (Optional)"
                                                />
                                                <TextInput
                                                    id="check_out_date"
                                                    name="check_out_date"
                                                    type="date"
                                                    value={
                                                        hotelForm.check_out_date
                                                    }
                                                    onChange={handleFormChange}
                                                    min={
                                                        hotelForm.check_in_date
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="notes"
                                                value="Notiz (Optional)"
                                            />
                                            <Textarea
                                                id="notes"
                                                name="notes"
                                                value={hotelForm.notes}
                                                onChange={handleFormChange}
                                                placeholder="Notizen"
                                                rows={4}
                                            />
                                        </div>
                                        <div>
                                            <Label value="Rechnung (Optional)" />
                                            <div
                                                {...getRootProps()}
                                                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                                                    isDragActive
                                                        ? "border-blue-500 bg-blue-50"
                                                        : "border-gray-300 hover:border-gray-400"
                                                }`}
                                            >
                                                <input {...getInputProps()} />
                                                {isUploading ? (
                                                    <div className="flex items-center justify-center">
                                                        <Spinner size="sm" />
                                                        <span className="ml-2">
                                                            Wird hochgeladen...
                                                        </span>
                                                    </div>
                                                ) : invoiceFile ? (
                                                    <div>
                                                        <p className="text-green-600">
                                                            ✓ {invoiceFile.name}{" "}
                                                            hochgeladen
                                                        </p>
                                                        <Button
                                                            type="button"
                                                            color="failure"
                                                            size="xs"
                                                            className="mt-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setInvoiceFile(
                                                                    null
                                                                );
                                                                setHotelForm(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        invoice_file:
                                                                            "",
                                                                    })
                                                                );
                                                            }}
                                                        >
                                                            Entfernen
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <p>
                                                        Datei hier ablegen oder
                                                        klicken zum Auswählen
                                                        <br />
                                                        <span className="text-sm text-gray-500">
                                                            PDF, JPG, PNG
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                type="submit"
                                                disabled={isSaving}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <Spinner
                                                            size="sm"
                                                            className="mr-2"
                                                        />
                                                        Speichern...
                                                    </>
                                                ) : (
                                                    "Speichern"
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </Tabs.Item>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
