import { useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [waitConfirmedCount, setWaitConfirmedCount] = useState(0);
    const [weeklyTodos, setWeeklyTodos] = useState(0);
    const getWaitConfirmedCount = async () => {
        const response = await axios.get(route("wait-confirmed-jobs-count"));
        setWaitConfirmedCount(response.data.count);
    };

    const getWeeklyTodos = async () => {
        const response = await axios.get(route("get-weekly-todos"));
        setWeeklyTodos(response.data.count);
    };

    window.userId = user.id;

    if (user.is_admin || user.accountant) {
        useEffect(() => {
            getWaitConfirmedCount();
            getWeeklyTodos();
            let id = setInterval(getWaitConfirmedCount, 60000);
            let id2 = setInterval(getWeeklyTodos, 60000);
            return () => {
                clearInterval(id);
                clearInterval(id2);
            };
        }, []);
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {user.id && (
                <span id="user-id" style={{ display: "none" }}>
                    {user.id}
                </span>
            )}
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/dashboard">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden xl:flex space-x-6 sm:-my-px sm:ms-10">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                            <div className="hidden xl:flex space-x-6 sm:-my-px sm:ms-10">
                                <NavLink
                                    href={route("new-jobs")}
                                    active={route().current("new-jobs")}
                                >
                                    Neue Berichte
                                </NavLink>
                            </div>
                            <div className="hidden xl:flex space-x-6 sm:-my-px sm:ms-10">
                                <NavLink
                                    href={route("draft-jobs")}
                                    active={route().current("draft-jobs")}
                                >
                                    Bericht Entwürfe
                                </NavLink>
                            </div>
                            <div className="hidden xl:flex space-x-6 sm:-my-px sm:ms-10">
                                <NavLink
                                    href={route("finalized-jobs")}
                                    active={route().current("finalized-jobs")}
                                >
                                    Eingereichte Berichte
                                </NavLink>
                            </div>
                            <div className="hidden xl:flex space-x-6 sm:-my-px sm:ms-10">
                                <NavLink
                                    href={route("planner")}
                                    active={route().current("planner")}
                                >
                                    Planung
                                </NavLink>
                            </div>
                            {/*<div className="hidden xl:flex space-x-6 sm:-my-px sm:ms-10">
                                <NavLink href={route('sick-leaves')} active={route().current('sick-leaves')}>
                                    Krankmeldungen
                                </NavLink>
                            </div>
                            <div className="hidden xl:flex space-x-6 sm:-my-px sm:ms-10">
                                <NavLink href={route('annual-leaves')} active={route().current('annual-leaves')}>
                                Urlaubsanträge
                                </NavLink>
                            </div>*/}
                            {(user.is_admin || user.accountant) && (
                                <div className="hidden xl:flex space-x-6 sm:-my-px sm:ms-10">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className="inline-flex mt-3 items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                Admin-Menü
                                                {waitConfirmedCount > 0 && (
                                                    <span className="absolute bg-red-600 text-red-100 px-2 py-1 text-xs font-bold rounded-full top-2 right-2">
                                                        {waitConfirmedCount}
                                                    </span>
                                                )}
                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route("users.index")}
                                            >
                                                Benutzer
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("clients-index")}
                                            >
                                                Kunden
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("confirmed-jobs")}
                                            >
                                                Bestätigte Berichte
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route(
                                                    "wait-confirmed-jobs"
                                                )}
                                            >
                                                Unbestätigte Berichte
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route(
                                                    "confirmed-jobs-to-edit"
                                                )}
                                            >
                                                Bearbeiten Bestätigte Berichte
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("admin-planner")}
                                            >
                                                Planung
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("clients.new-job")}
                                            >
                                                Kundenaufträge
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route(
                                                    "confirmed-jobs-to-client"
                                                )}
                                            >
                                                Kunden Berichte
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("bahn-cards")}
                                            >
                                                Bahnkarten
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("aggreements.view")}
                                            >
                                                Vertrag
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("hotels.history")}
                                            >
                                                Hotels history
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("certificates")}
                                            >
                                                Zertifikate
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("programs.view")}
                                            >
                                                Programme
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("todo.view")}
                                            >
                                                ToDo Liste
                                                {weeklyTodos > 0 && (
                                                    <span className="bg-red-600 text-red-100 px-2 py-1 text-xs font-bold rounded-full ms-2">
                                                        {weeklyTodos}
                                                    </span>
                                                )}
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            )}
                        </div>

                        <div className="hidden xl:flex xl:items-center xl:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route("new-jobs")}>
                                            Neue Berichte
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("draft-jobs")}
                                        >
                                            Bericht Entwürfe
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("finalized-jobs")}
                                        >
                                            Eingereichte Berichte{" "}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("planner")}>
                                            Planung
                                        </Dropdown.Link>
                                        {/*<Dropdown.Link href={route('sick-leaves')}>Krankmeldungen</Dropdown.Link>
                                        <Dropdown.Link href={route('annual-leaves')}>Urlaubsanträge</Dropdown.Link>*/}
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Abmelden
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center xl:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " xl:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Armaturenbrett
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-2 pb-3 space-y-1">
                        {(user.is_admin || user.accountant) && (
                            <div className="">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex mt-3 items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                        >
                                            Admin-Menü
                                            {waitConfirmedCount > 0 && (
                                                <span className="absolute bg-red-600 text-red-100 px-2 py-1 text-xs font-bold rounded-full top-2 right-2">
                                                    {waitConfirmedCount}
                                                </span>
                                            )}
                                            <svg
                                                className="ms-2 -me-0.5 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content className="mt-2 l-0 w-full">
                                        <ResponsiveNavLink
                                            href={route("users.index")}
                                        >
                                            Benutzer
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route("clients-index")}
                                        >
                                            Kunden
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route("confirmed-jobs")}
                                        >
                                            Bestätigte Berichte
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route("wait-confirmed-jobs")}
                                        >
                                            Unbestätigte Berichte
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route(
                                                "confirmed-jobs-to-edit"
                                            )}
                                        >
                                            Bearbeiten Bestätigte Berichte
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route("admin-planner")}
                                        >
                                            Planung
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route("clients.new-job")}
                                        >
                                            Kundenaufträge
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route(
                                                "confirmed-jobs-to-client"
                                            )}
                                        >
                                            Kunden Berichte
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route("aggreements.view")}
                                        >
                                            Vertrag
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route("certificates")}
                                        >
                                            Zertifikate
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route("programs.view")}
                                        >
                                            Programme
                                        </ResponsiveNavLink>
                                        <ResponsiveNavLink
                                            href={route("todo.view")}
                                        >
                                            ToDo Liste
                                        </ResponsiveNavLink>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("new-jobs")}>
                                Neue Berichte
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("draft-jobs")}>
                                Bericht Entwürfe
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("finalized-jobs")}>
                                Eingereichte Berichte
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("planner")}>
                                Planung
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("sick-leaves")}>
                                Krankmeldungen
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("annual-leaves")}>
                                Urlaubsanträge
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Abmelden
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
