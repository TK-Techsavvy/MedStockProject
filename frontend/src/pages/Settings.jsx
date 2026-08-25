import React, {
    useEffect,
    useState
} from "react";

import { useAuth } from "../context/AuthContext";


const Settings = () => {

    const {
        user,
        changeTheme
    } = useAuth();


    // ============================================================
    // DEFAULT SETTINGS
    // ============================================================

    const [settings, setSettings] = useState({

        theme: "Light",

        language: "English",

        timezone: "Africa/Johannesburg",

        date_format: "DD/MM/YYYY",

        email_notifications: true,

        push_notifications: true,

        session_timeout: 30
    });


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);


    // ============================================================
    // LOAD SETTINGS
    // ============================================================

    useEffect(() => {

        if (!user?.userId) {

            setLoading(false);

            return;
        }


        const fetchSettings = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/settings/${user.userId}`
                );


                if (!response.ok) {

                    throw new Error(
                        "Unable to load settings"
                    );
                }


                const data =
                    await response.json();


                if (
                    data.success &&
                    data.settings
                ) {

                    const loadedSettings = {

                        theme:
                            data.settings.theme ||
                            "Light",

                        language:
                            data.settings.language ||
                            "English",

                        timezone:
                            data.settings.timezone ||
                            "Africa/Johannesburg",

                        date_format:
                            data.settings.date_format ||
                            "DD/MM/YYYY",

                        email_notifications:
                            data.settings.email_notifications ??
                            true,

                        push_notifications:
                            data.settings.push_notifications ??
                            true,

                        session_timeout:
                            data.settings.session_timeout ||
                            30
                    };


                    setSettings(
                        loadedSettings
                    );


                    // Make sure global theme
                    // matches database

                    changeTheme(
                        loadedSettings.theme
                    );
                }

            } catch (error) {

                console.error(
                    "Settings error:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };


        fetchSettings();

    }, [user]);


    // ============================================================
    // HANDLE INPUT CHANGES
    // ============================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        let newValue;


        if (type === "checkbox") {

            newValue = checked;

        } else if (
            name === "session_timeout"
        ) {

            newValue = Number(value);

        } else {

            newValue = value;
        }


        setSettings(
            previousSettings => ({
                ...previousSettings,
                [name]: newValue
            })
        );


        // ========================================================
        // APPLY THEME IMMEDIATELY
        // ========================================================

        if (name === "theme") {

            changeTheme(value);
        }
    };


    // ============================================================
    // SAVE SETTINGS
    // ============================================================

    const saveSettings = async () => {

        if (!user?.userId) {

            alert(
                "You must be logged in to save settings."
            );

            return;
        }


        try {

            setSaving(true);


            const response = await fetch(
                `http://localhost:5000/api/settings/${user.userId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        theme:
                            settings.theme,

                        language:
                            settings.language,

                        timezone:
                            settings.timezone,

                        date_format:
                            settings.date_format,

                        email_notifications:
                            settings.email_notifications,

                        push_notifications:
                            settings.push_notifications,

                        session_timeout:
                            Number(
                                settings.session_timeout
                            )
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(

                    data.details ||
                    data.error ||
                    "Failed to save settings"
                );
            }


            if (data.settings) {

                const savedSettings = {

                    theme:
                        data.settings.theme ||
                        "Light",

                    language:
                        data.settings.language ||
                        "English",

                    timezone:
                        data.settings.timezone ||
                        "Africa/Johannesburg",

                    date_format:
                        data.settings.date_format ||
                        "DD/MM/YYYY",

                    email_notifications:
                        data.settings.email_notifications ??
                        true,

                    push_notifications:
                        data.settings.push_notifications ??
                        true,

                    session_timeout:
                        data.settings.session_timeout ||
                        30
                };


                setSettings(
                    savedSettings
                );


                changeTheme(
                    savedSettings.theme
                );
            }


            alert(
                "Settings saved successfully."
            );

        } catch (error) {

            console.error(
                "Save settings error:",
                error
            );


            alert(
                `Unable to save settings.\n\n${error.message}`
            );

        } finally {

            setSaving(false);
        }
    };


    // ============================================================
    // LOADING
    // ============================================================

    if (loading) {

        return (

            <div className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-white
            ">

                <p className="
                    text-slate-500
                ">
                    Loading settings...
                </p>

            </div>
        );
    }


    // ============================================================
    // PAGE
    // ============================================================

    return (

        <div className="
            min-h-screen
            bg-white
            p-4
            transition-colors
            duration-200
            md:p-6
        ">

            <div className="
                mx-auto
                max-w-5xl
            ">


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="mb-6">

                    <h1 className="
                        text-2xl
                        font-bold
                        text-slate-800
                    ">
                        Settings
                    </h1>


                    <p className="
                        mt-1
                        text-sm
                        text-slate-500
                    ">
                        Manage your MediStock preferences
                    </p>

                </div>


                {/* ==================================================
                    APPEARANCE
                ================================================== */}

                <div className="
                    mb-5
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                ">

                    <h2 className="
                        mb-5
                        text-lg
                        font-semibold
                        text-slate-800
                    ">
                        Appearance
                    </h2>


                    <label className="
                        block
                        max-w-md
                    ">

                        <span className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-slate-700
                        ">
                            Theme
                        </span>


                        <select
                            name="theme"
                            value={settings.theme}
                            onChange={handleChange}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-3
                                text-slate-800
                                outline-none
                                focus:border-[#00549a]
                            "
                        >

                            <option value="Light">
                                Light
                            </option>

                            <option value="Dark">
                                Dark
                            </option>

                        </select>

                    </label>

                </div>


                {/* ==================================================
                    REGIONAL PREFERENCES
                ================================================== */}

                <div className="
                    mb-5
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                ">

                    <h2 className="
                        mb-5
                        text-lg
                        font-semibold
                        text-slate-800
                    ">
                        Regional Preferences
                    </h2>


                    <div className="
                        grid
                        gap-5
                        md:grid-cols-2
                    ">


                        {/* LANGUAGE */}

                        <label>

                            <span className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-700
                            ">
                                Language
                            </span>


                            <select
                                name="language"
                                value={settings.language}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-slate-800
                                    outline-none
                                    focus:border-[#00549a]
                                "
                            >

                                <option value="English">
                                    English
                                </option>

                            </select>

                        </label>


                        {/* TIMEZONE */}

                        <label>

                            <span className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-700
                            ">
                                Timezone
                            </span>


                            <select
                                name="timezone"
                                value={settings.timezone}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-slate-800
                                    outline-none
                                    focus:border-[#00549a]
                                "
                            >

                                <option value="Africa/Johannesburg">
                                    Africa/Johannesburg
                                </option>

                            </select>

                        </label>


                        {/* DATE FORMAT */}

                        <label>

                            <span className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-slate-700
                            ">
                                Date Format
                            </span>


                            <select
                                name="date_format"
                                value={settings.date_format}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-3
                                    text-slate-800
                                    outline-none
                                    focus:border-[#00549a]
                                "
                            >

                                <option value="DD/MM/YYYY">
                                    DD/MM/YYYY
                                </option>

                                <option value="YYYY-MM-DD">
                                    YYYY-MM-DD
                                </option>

                            </select>

                        </label>

                    </div>

                </div>


                {/* ==================================================
                    NOTIFICATIONS
                ================================================== */}

                <div className="
                    mb-5
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                ">

                    <h2 className="
                        mb-5
                        text-lg
                        font-semibold
                        text-slate-800
                    ">
                        Notifications
                    </h2>


                    <div className="space-y-4">


                        {/* EMAIL */}

                        <label className="
                            flex
                            items-center
                            justify-between
                            rounded-lg
                            border
                            border-slate-200
                            p-4
                        ">

                            <div>

                                <p className="
                                    font-medium
                                    text-slate-800
                                ">
                                    Email Notifications
                                </p>


                                <p className="
                                    text-sm
                                    text-slate-500
                                ">
                                    Receive important inventory updates by email.
                                </p>

                            </div>


                            <input
                                type="checkbox"
                                name="email_notifications"
                                checked={
                                    settings.email_notifications
                                }
                                onChange={handleChange}
                                className="
                                    h-5
                                    w-5
                                    accent-[#00549a]
                                "
                            />

                        </label>


                        {/* PUSH */}

                        <label className="
                            flex
                            items-center
                            justify-between
                            rounded-lg
                            border
                            border-slate-200
                            p-4
                        ">

                            <div>

                                <p className="
                                    font-medium
                                    text-slate-800
                                ">
                                    Push Notifications
                                </p>


                                <p className="
                                    text-sm
                                    text-slate-500
                                ">
                                    Receive system notifications.
                                </p>

                            </div>


                            <input
                                type="checkbox"
                                name="push_notifications"
                                checked={
                                    settings.push_notifications
                                }
                                onChange={handleChange}
                                className="
                                    h-5
                                    w-5
                                    accent-[#00549a]
                                "
                            />

                        </label>

                    </div>

                </div>


                {/* ==================================================
                    SECURITY
                ================================================== */}

                <div className="
                    mb-6
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-sm
                ">

                    <h2 className="
                        mb-5
                        text-lg
                        font-semibold
                        text-slate-800
                    ">
                        Security
                    </h2>


                    <label className="
                        block
                        max-w-md
                    ">

                        <span className="
                            mb-2
                            block
                            text-sm
                            font-medium
                            text-slate-700
                        ">
                            Session Timeout (minutes)
                        </span>


                        <input
                            type="number"
                            min="5"
                            name="session_timeout"
                            value={
                                settings.session_timeout
                            }
                            onChange={handleChange}
                            className="
                                w-full
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                py-3
                                text-slate-800
                                outline-none
                                focus:border-[#00549a]
                            "
                        />

                    </label>

                </div>


                {/* ==================================================
                    SAVE BUTTON
                ================================================== */}

                <div className="
                    flex
                    justify-end
                ">

                    <button
                        onClick={saveSettings}
                        disabled={saving}
                        className="
                            rounded-lg
                            bg-[#00549a]
                            px-6
                            py-3
                            text-sm
                            font-semibold
                            text-white
                            shadow-sm
                            transition
                            hover:bg-[#00427a]
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    >

                        {saving
                            ? "Saving..."
                            : "Save Settings"}

                    </button>

                </div>

            </div>

        </div>
    );
};


export default Settings;