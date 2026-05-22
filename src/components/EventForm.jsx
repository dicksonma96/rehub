import React, { useState, useEffect, useRef } from "react";
import "./EventForm.scss";

const fields = [
    { name: "full_name", label: "Full Name", placeholder: "Enter your full name", type: "text", required: true },
    { name: "email", label: "Email Address", placeholder: "Enter your email", type: "email", required: true },
    { name: "phone", label: "Phone Number", placeholder: "0123456789", type: "tel", required: false },
]

const EventForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);


    const validateStep1 = () => {
        let newErrors = {};
        let isValid = true;

        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} is required`;
                isValid = false;
            } else if (field.type === 'email' && formData[field.name]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData[field.name])) {
                    newErrors[field.name] = "Invalid email format";
                    isValid = false;
                }
            } else if (field.type === 'tel' && formData[field.name]) {
                const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
                if (!phoneRegex.test(formData[field.name])) {
                    newErrors[field.name] = "Invalid phone number format";
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleNextStep1 = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const onDragLeave = () => setIsDragActive(false);

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragActive(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    };

    const MAX_FILE_SIZE_MB = 10;

    const handleSubmit = async () => {
        setSubmitting(true);

        if (!file) {
            alert("Please attach your payment receipt.");
            return;
        }

        try {
            const endpoint = import.meta.env.PUBLIC_GET_EVENT_APPSCRIPT;

            if (!endpoint) throw new Error("Endpoint not configured.");

            if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                alert("File too large. Max 10MB.");
                return;
            }

            let fileBase64 = null;
            if (file) {
                fileBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result.split(",")[1]);
                    reader.onerror = reject;
                });
            }

            const payload = {
                full_name: formData.full_name || "",
                email: formData.email || "",
                phone: formData.phone || "",
                fileBase64,
                fileName: file?.name ?? null,
                mimeType: file?.type ?? null,
            };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload),
                redirect: "follow",
            });

            const result = await response.json();

            if (result.status === "success") {
                setStep(4);
                setFormData({});
                setFile(null);
                setErrors({});
            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error("Submission error:", error);
            alert("Submission failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };
    if (loading) return <div className="event-form-container"><p>Loading form...</p></div>;

    return (

        <div className="event-form-container">
            <div className="step-indicator">
                <div className={`step-dot ${step >= 1 ? "active" : ""} ${step > 1 ? "completed" : ""}`}>1</div>
                <div className={`step-dot ${step >= 2 ? "active" : ""} ${step > 2 ? "completed" : ""}`}>2</div>
                <div className={`step-dot ${step >= 3 ? "active" : ""} ${step > 3 ? "completed" : ""}`}>3</div>
            </div>

            {step === 1 && (
                <div className="form-step">
                    <h2>Personal Details</h2>
                    <div className="fields-grid">
                        {fields.map(field => (
                            <div key={field.name} className="input-group">
                                <label>{field.label}</label>
                                {field.type === "select" ? (
                                    <select name={field.name} onChange={handleInputChange} value={formData[field.name] || ""} className={errors[field.name] ? "error-input" : ""}>
                                        <option value="">Select an option</option>
                                        {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        required={field.required}
                                        onChange={handleInputChange}
                                        value={formData[field.name] || ""}
                                        placeholder={field.placeholder}
                                        className={errors[field.name] ? "error-input" : ""}
                                    />
                                )}
                                {errors[field.name] && (
                                    <span className="error-message" style={{ color: "#dc3545", fontSize: "12px", marginTop: "4px", display: "block" }}>
                                        {errors[field.name]}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="button-group">
                        <button className="btn-next" onClick={handleNextStep1}>Next Step</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="form-step">
                    <h2>Upload Payment Screenshot</h2>
                    <div
                        className={`dropzone ${isDragActive ? "drag-active" : ""}`}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <span className="upload-icon">🧾</span>
                        <p>Drag and drop your file here, or click to browse (png/jpg)</p>
                        <button type="button" className="cta_btn">Choose File</button>
                        {file && <div className="file-name">Selected: {file.name}</div>}
                    </div>
                    <div className="button-group">
                        <button className="btn-prev" onClick={() => setStep(1)}>Previous</button>
                        <button className="btn-next" onClick={() => {
                            if (!file) {
                                alert("Please attach your payment receipt.");
                                return;
                            }
                            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                                alert("File too large. Max 10MB.");
                                return;
                            }
                            setStep(3);
                        }}>Next Step</button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="form-step">
                    <h2>Review & Submit</h2>
                    <div className="preview-section">
                        {fields.map(field => (
                            <div key={field.name} className="preview-item">
                                <span className="label">{field.label}</span>
                                <span className="value">{formData[field.name] || "—"}</span>
                            </div>
                        ))}
                        <div className="preview-item">
                            <span className="label">Uploaded Document</span>
                            <span className="value">{file ? file.name : "No file uploaded"}</span>
                        </div>
                    </div>
                    <div className="button-group">
                        <button className="btn-prev" onClick={() => setStep(2)}>Previous</button>
                        <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                            {submitting ? "Submitting..." : "Confirm & Submit"}
                        </button>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="form-step" style={{ textAlign: "center", padding: "2rem 0" }}>
                    <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
                    <h2>Registration Successful!</h2>
                    <p style={{ marginTop: "1rem", color: "inherit", fontSize: "1.1rem" }}>Thank you for registering. We have received your details.</p>
                    <div className="button-group" style={{ justifyContent: "center", marginTop: "2rem" }}>
                        <button className="btn-submit" onClick={() => setStep(1)}>Register Another</button>
                    </div>
                </div>
            )}
        </div>
    );
};


function EventRegistration() {
    const [eventData, setEventData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handler = (e) => {
            setEventData(e.detail);
            setIsLoading(false);
        };

        // Register listener FIRST before checking cache
        window.addEventListener("event-data-ready", handler);

        // Then check cache — avoids race condition
        const cachedData = sessionStorage.getItem("globalEventData");
        if (cachedData) {
            setEventData(JSON.parse(cachedData));
            setIsLoading(false);
        }

        return () => window.removeEventListener("event-data-ready", handler);
    }, []);

    if (isLoading) return <div className="hero_loader colc">
        <div className="loader"></div>
    </div>;

    if (!eventData.active) return (
        <div className="event-form-container colc" style={{ gap: '2rem', textAlign: 'center' }}>
            <h1>📅</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
                <p style={{ fontSize: 18, fontWeight: 500, margin: 0 }}>No upcoming events</p>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, margin: 0 }}>
                    We don't have any active events at the moment. Follow us on social media to stay updated on what's coming next.
                </p>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                <a href="https://www.instagram.com/rehub_pj?igsh=eWtnY2huYnhlcDRw" target="_blank" rel="noreferrer"
                    style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                        borderRadius: 8, background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                        color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none"
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2" />
                        <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="2" />
                        <circle cx="17.5" cy="6.5" r="1" fill="white" />
                    </svg>
                    Instagram
                </a>

                <a href="https://www.facebook.com/profile.php?id=61576003985372&mibextid=wwXIfr&rdid=252qaGp8eWaWn7kH&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AgrWzyxK8%2F%3Fmibextid%3DwwXIfr#" target="_blank" rel="noreferrer"
                    style={{
                        display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                        borderRadius: 8, background: "#1877F2",
                        color: "#fff", fontSize: 14, fontWeight: 500, textDecoration: "none"
                    }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="2" width="20" height="20" rx="5" fill="white" />
                        <path d="M13.5 8H15V6H13.5C12.1 6 11 7.1 11 8.5V10H9.5V12H11V18H13V12H14.5L15 10H13V8.5C13 8.22 13.22 8 13.5 8Z" fill="#1877F2" />
                    </svg>
                    Facebook
                </a>
            </div>

            <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>We'll announce new events there first.</p>
        </div>
    );



    return <>
        <img className="event_hero_banner" src={eventData.event_img} alt={eventData.event_name} />

        <h5 data-aos="flip-up">Join our upcoming events</h5>
        <h1 style={{ textAlign: "center" }} data-aos="fade-right">
            <span className="latte">EVENT</span>
            <span className="orange">REGISTRATION</span>
        </h1>
        <EventForm />
    </>;
}

export default EventRegistration;
